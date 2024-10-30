import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import notFoundImage from "../assets/404.png";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center w-full max-w-md"
      >
        <motion.img
          src={notFoundImage}
          alt={t("notFound.heading")}
          className="w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 mb-6 sm:mb-8 mx-auto"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            y: {
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            },
            rotate: {
              repeat: Infinity,
              duration: 5,
              ease: "linear",
            },
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 sm:mb-4 text-[#723bcf]">
            {t("notFound.title")}
          </h1>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-2 sm:mb-4 text-gray-800">
            {t("notFound.heading")}
          </h2>
          <p className="mb-6 sm:mb-8 text-lg sm:text-xl text-gray-600">
            {t("notFound.description")}
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/home"
              className="inline-block bg-[#723bcf] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold hover:bg-[#5e35b1] transition duration-300 ease-in-out"
            >
              {t("notFound.backToHome")}
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
