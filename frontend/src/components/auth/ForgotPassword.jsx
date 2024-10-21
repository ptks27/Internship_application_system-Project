import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import logo from "../../assets/logo.png";
import { useTranslation } from "react-i18next";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${USER_API_END_POINT}/forgot-password`,
        { email },
        { withCredentials: true }
      );

      if (response.data.success) {
        navigate("/forgot-password-success", { state: { email } });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || t("failedToSendResetEmail")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-100 to-indigo-200 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
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
          {t("forgotPassword1")}
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 text-center">
          {t("enterEmailForReset")}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("enterEmailAddress")}
            className="w-full border-2 border-[#723bcf] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#723bcf] focus:border-transparent transition-all duration-200 text-sm sm:text-base"
            required
          />
          <Button
            type="submit"
            className="w-full bg-[#723bcf] text-white py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base md:text-lg hover:bg-[#5c2da6] transition-colors duration-200"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
            ) : null}
            {t("sendResetLink")}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
