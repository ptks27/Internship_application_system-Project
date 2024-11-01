import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import logo from "../../assets/logo.png";
import { useTranslation } from "react-i18next"; // เพิ่มการ import นี้

const VerifyEmail = () => {
  const { t } = useTranslation(); // เพิ่มบรรทัดนี้เพื่อใช้งาน translation

  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date().getTime();
    const savedEndTime = localStorage.getItem("verificationEndTime");

    if (savedEndTime) {
      const remaining = Math.max(
        0,
        Math.floor((parseInt(savedEndTime, 10) - now) / 1000)
      );
      return remaining > 0 ? remaining : 600;
    }
    return 600; // Default to 600 seconds if no saved time
  });
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const inputRefs = useRef([]);
  const [resendLoading, setResendLoading] = useState(false);

  const handleBackToLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    if (!email) {
      navigate("/login", { replace: true });
      toast.error(t('pleaseLoginToVerify'));
      return;
    }

    const now = new Date().getTime();
    const newEndTime = now + 600 * 1000; // 600 seconds from now
    localStorage.setItem("verificationEndTime", newEndTime.toString());
    setTimeLeft(600);

    const timer = setInterval(() => {
      const currentTime = new Date().getTime();
      const endTime = parseInt(localStorage.getItem("verificationEndTime"), 10);
      const remaining = Math.max(0, Math.floor((endTime - currentTime) / 1000));

      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(timer);
        localStorage.removeItem("verificationEndTime");
        navigate("/login", { replace: true });
        toast.error(t('verificationTimeExpired'));
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [email, navigate, t]);

  useEffect(() => {
    if (verificationCode.every((code) => code !== "")) {
      handleSubmit();
    }
  }, [verificationCode]);

  const handleChange = (index, value) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      if (value !== "" && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newCode = [...verificationCode];
    pastedData.forEach((char, index) => {
      if (index < 6) newCode[index] = char;
    });
    setVerificationCode(newCode);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/verify-email`,
        { code: verificationCode.join("") },
        { withCredentials: true }
      );

      if (response.data.success) {
        setTimeout(() => {
          setLoading(false);
          toast.success(t('emailVerifiedSuccess'));
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t('verificationFailed'));
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/resend-verification-code`,
        { email },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(t('newVerificationCodeSent'));
        // Reset verification code fields
        setVerificationCode(["", "", "", "", "", ""]);
        
        // Reset timer
        const now = new Date().getTime();
        const newEndTime = now + 600 * 1000;
        localStorage.setItem("verificationEndTime", newEndTime.toString());
        setTimeLeft(600);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || t('failedToResendVerificationCode')
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-100 to-indigo-200 min-h-screen flex flex-col items-center justify-center relative p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBackToLogin}
          className="text-[#723bcf] hover:bg-purple-100 hover:text-[#5c2da6]"
        >
          <ArrowLeft size={24} />
        </Button>
      </motion.div>

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
          {t('verifyYourEmail')}
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 text-center">
          {t('verificationCodeSentTo')} <strong>{email}</strong>.
          {t('pleaseEnterCodeBelow')}
        </p>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 text-center">
          {t('timeRemaining')}: <strong>{formatTime(timeLeft)}</strong>
        </p>
        <div className="flex justify-between mb-6 sm:mb-8">
          {verificationCode.map((code, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Input
                type="text"
                maxLength={1}
                value={code}
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
              <p className="text-[#723bcf] font-semibold text-sm sm:text-base">{t('verifyingEmail')}</p>
            </div>
          ) : (
            <Button
              className="w-full bg-[#723bcf] text-white py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base md:text-lg hover:bg-[#5c2da6] transition-colors duration-200"
              onClick={handleSubmit}
            >
              {t('verifyEmail')}
            </Button>
          )}
          <Button
            variant="outline"
            className="w-full border-[#723bcf] text-[#723bcf] py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base md:text-lg hover:bg-[#f4f4f4] hover:text-black transition-colors duration-200"
            onClick={handleResendCode}
            disabled={resendLoading || timeLeft === 0}
          >
            {resendLoading ? (
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
            ) : null}
            {t('resendCode')}
          </Button>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-4 text-center">
          {t('didntReceiveCode')}
        </p>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
