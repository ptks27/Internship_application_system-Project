import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import logo from "../../assets/logo.png";
import { useTranslation } from "react-i18next"; // Add this import

const EnterOTP = () => {
  const { t } = useTranslation(); // Add this line
  const [otp, setOTP] = useState(["", "", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // Always start with 10 minutes
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
      return;
    }

    const otpEndTimeKey = `otpEndTime_${email}`;
    const verifiedKey = `verified_${email}`;
    const storedEndTime = localStorage.getItem(otpEndTimeKey);
    const isVerified = localStorage.getItem(verifiedKey) === "true";
    let remainingTime = 0;

    if (storedEndTime && !isVerified) {
      remainingTime = Math.max(0, Math.floor((parseInt(storedEndTime) - new Date().getTime()) / 1000));
    }

    if (remainingTime <= 0 || isVerified) {
      remainingTime = 600;
      const newEndTime = new Date().getTime() + 600000;
      localStorage.setItem(otpEndTimeKey, newEndTime.toString());
      localStorage.removeItem(verifiedKey); // Reset verified status
    }

    setTimeLeft(remainingTime);

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          localStorage.removeItem(otpEndTimeKey);
          localStorage.removeItem(verifiedKey);
          navigate("/login");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (value.length <= 1) {
      const newValue = value.toUpperCase();
      const newOTP = [...otp];
      newOTP[index] = newValue;
      setOTP(newOTP);
      
      if (value !== "" && index < 6) {
        inputRefs.current[index + 1].focus();
      }
      
      if (newValue !== "") {
        const isComplete = newOTP.every(char => char !== "");
        if (isComplete) {
          setTimeout(() => {
            handleSubmit();
          }, 300);
        }
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/[^A-Za-z0-9]/g, '')
      .toUpperCase()
      .slice(0, 7);

    if (pastedData.length === 7) {
      const newOTP = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOTP[i] = pastedData[i];
      }
      setOTP(newOTP);
      inputRefs.current[6].focus();
      
      setLoading(true);
      
      setTimeout(async () => {
        try {
          const response = await axios.post(
            `${USER_API_END_POINT}/verify-otp`,
            {
              email,
              otp: pastedData
            },
            { withCredentials: true }
          );

          if (response.data.success) {
            toast.success(t("emailSentSuccessfully"));
            localStorage.setItem("otpVerified", "true");
            localStorage.setItem(`verified_${email}`, "true");
            navigate("/reset-password", { state: { email, otpVerified: true } });
          }
        } catch (error) {
          console.error("OTP verification error:", error.response?.data || error);
          toast.error(error.response?.data?.message || t("unexpectedError"));
          setOTP(["", "", "", "", "", "", ""]);
          inputRefs.current[0].focus();
        } finally {
          setLoading(false);
        }
      }, 2000);

    } else if (pastedData.length > 0) {
      const newOTP = Array(7).fill("");
      for (let i = 0; i < Math.min(pastedData.length, 7); i++) {
        newOTP[i] = pastedData[i];
      }
      setOTP(newOTP);
      const nextIndex = Math.min(pastedData.length, 6);
      inputRefs.current[nextIndex].focus();
    } else {
      setOTP(["", "", "", "", "", "", ""]);
      inputRefs.current[0].focus();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!otp.every(char => char !== "")) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/verify-otp`,
        {
          email,
          otp: otp.join("")
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(t("emailSentSuccessfully"));
        localStorage.setItem("otpVerified", "true");
        localStorage.setItem(`verified_${email}`, "true");
        navigate("/reset-password", { state: { email, otpVerified: true } });
      }
    } catch (error) {
      console.error("OTP verification error:", error.response?.data || error);
      toast.error(error.response?.data?.message || t("unexpectedError"));
      setOTP(["", "", "", "", "", "", ""]);
      inputRefs.current[0].focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/forgot-password`,
        { email },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(t("newOTPSent"));
        setOTP(["", "", "", "", "", "", ""]);
        setTimeLeft(600); // Reset the timer
        
        const otpEndTimeKey = `otpEndTime_${email}`;
        const newEndTime = new Date().getTime() + 600000;
        localStorage.setItem(otpEndTimeKey, newEndTime.toString());
        localStorage.removeItem(`verified_${email}`);
      }
    } catch (error) {
      toast.error(t("failedToResendOTP") + `: ${error.message}`);
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="bg-gradient-to-br from-purple-100 to-indigo-200 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-[90%] sm:max-w-[400px] md:max-w-[450px] mx-auto"
      >
        <div className="flex justify-center mb-6">
          <motion.img
            src={logo}
            alt="Logo"
            className="w-32 h-8 sm:w-40 sm:h-10 md:w-48 md:h-12"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          />
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center text-[#723bcf]">
          {t("enterOTP")}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 text-center">
          {t("otpSentTo")} <strong>{email}</strong>. {t("pleaseEnterBelow")}
        </p>
        <p className="text-sm sm:text-base text-gray-600 mb-4 text-center">
          {t("timeRemaining")}: <strong>{formatTime(timeLeft)}</strong>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between mb-6 sm:mb-8">
            {otp.map((digit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Input
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onPaste={handlePaste}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-8 h-10 sm:w-10 sm:h-12 md:w-12 md:h-14 text-center text-lg sm:text-xl md:text-2xl border-2 border-[#723bcf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#723bcf] focus:border-transparent transition-all duration-200"
                />
              </motion.div>
            ))}
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-[#723bcf] mb-2" />
                <p className="text-[#723bcf] font-semibold text-sm sm:text-base">
                  {t('optLoading')}
                </p>
              </div>
            ) : (
              <>
                <Button
                  type="submit"
                  className="w-full bg-[#723bcf] text-white py-2 sm:py-3 rounded-lg font-semibold text-base sm:text-lg hover:bg-[#5c2da6] transition-colors duration-200"
                  onClick={handleSubmit}
                  disabled={loading || otp.some((digit) => digit === "")}
                >
                  {t("verifyOTP")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-[#723bcf] text-[#723bcf] py-2 sm:py-3 rounded-lg font-semibold text-base sm:text-lg hover:bg-[#f4f4f4] hover:text-black transition-colors duration-200"
                  onClick={handleResendOTP}
                  disabled={resendLoading}
                >
                  {resendLoading ? (
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
                  ) : null}
                  {t("resendOTP")}
                </Button>
              </>
            )}
          </div>
        </form>
        <p className="text-xs sm:text-sm text-gray-500 mt-4 text-center">
          {t("didntReceiveOTP")}
        </p>
      </motion.div>
    </div>
  );
};

export default EnterOTP;
