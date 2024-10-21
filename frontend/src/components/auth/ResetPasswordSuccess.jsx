import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/logo.png";

const ResetPasswordSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount === 1) {
          clearInterval(timer);
          setIsLoading(true);
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        }
        return prevCount > 0 ? prevCount - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="bg-gradient-to-br from-purple-100 to-indigo-200 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-[90%] sm:max-w-[400px] md:max-w-[450px] mx-auto text-center"
      >
        <motion.img
          src={logo}
          alt="Logo"
          className="w-32 h-8 sm:w-40 sm:h-10 md:w-48 md:h-12 mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-[#723bcf] mx-auto mb-4" />
        </motion.div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-[#723bcf]">
          {t("passwordResetSuccessful")}
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6">
          {t("passwordResetSuccessMessage")}
        </p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-base sm:text-lg md:text-xl font-semibold text-[#723bcf]"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 sm:w-6 sm:h-6 border-t-2 border-[#723bcf] rounded-full animate-spin mr-2"></div>
              <span>{t("redirecting")}</span>
            </div>
          ) : (
            <>
              {t("redirectingToLoginPage")}{" "}
              <span className="inline-block w-6 h-6 sm:w-8 sm:h-8 bg-[#723bcf] text-white rounded-full">
                {countdown}
              </span>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordSuccess;
