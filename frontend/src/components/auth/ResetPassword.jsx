import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Loader2, ArrowLeft, Eye, EyeOff, Check, X } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import logo from "../../assets/logo.png";
import { useTranslation } from "react-i18next"; // Import useTranslation hook

const ResetPassword = () => {
  const { t } = useTranslation(); // Initialize the translation function
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { email, otpVerified } = location.state || {};

  useEffect(() => {
    if (!email || !otpVerified) {
      toast.error(
        "Invalid access. Please start from the forgot password page."
      );
      navigate("/forgot-password");
    }
  }, [email, otpVerified, navigate]);

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const validatePassword = (password) => {
    setPasswordCriteria({
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    });
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (password !== confirmPassword) {
      setErrors({ match: "Passwords do not match." });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/reset-password`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Password reset successfully!");
        navigate("/reset-password-success"); // Redirect to ResetPasswordSuccess
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
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

        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-center text-[#723bcf]">
          {t("resetPassword")}
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-center text-gray-600 mb-4 sm:mb-6">
          {t("enterNewPasswordBelow")}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="relative">
            <Input
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              placeholder={t("newPassword")}
              className="w-full pl-4 border-2 border-[#723bcf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#723bcf] focus:border-transparent transition-all duration-200 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="relative">
            <Input
              type={confirmPasswordVisible ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t("confirmNewPassword")}
              className="w-full pl-4 border-2 border-[#723bcf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#723bcf] focus:border-transparent transition-all duration-200 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {confirmPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="space-y-2">
            {Object.entries(passwordCriteria).map(([criterion, isValid]) => (
              <div key={criterion} className="flex items-center text-xs sm:text-sm">
                {isValid ? (
                  <Check className="text-green-500 mr-2" size={14} />
                ) : (
                  <X className="text-red-500 mr-2" size={14} />
                )}
                <span className={isValid ? "text-green-500" : "text-red-500"}>
                  {t(getCriterionText(criterion))}
                </span>
              </div>
            ))}
          </div>
          {Object.values(errors).map((error, index) => (
            <p key={index} className="text-red-500 text-xs sm:text-sm mt-1">
              {t(error)}
            </p>
          ))}
          <Button
            type="submit"
            className="w-full bg-[#723bcf] text-white py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base md:text-lg hover:bg-[#5c2da6] transition-colors duration-200"
            disabled={loading || !Object.values(passwordCriteria).every(Boolean)}
          >
            {loading ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" /> : null}
            {t("resetPassword")}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

function getCriterionText(criterion) {
  switch (criterion) {
    case "length":
      return "passwordLengthCriterion";
    case "lowercase":
      return "passwordLowercaseCriterion";
    case "uppercase":
      return "passwordUppercaseCriterion";
    case "number":
      return "passwordNumberCriterion";
    case "special":
      return "passwordSpecialCharCriterion";
    default:
      return "";
  }
}

export default ResetPassword;
