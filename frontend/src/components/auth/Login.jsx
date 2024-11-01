import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup } from "../ui/radio-group";
import login from "../../assets/login.png";
import LOGOLOGIN from "../../assets/LOGOLOGIN.png";
import { useEffect, useState } from "react";
import { USER_API_END_POINT } from "../../components/utils/constant";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { resetJobs } from "@/redux/jobSlice"; // Add this import
import { motion } from "framer-motion";
import Navbar2 from "../shared/Navbar2";
import Footer from "../shared/Footer";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const [errors, setErrors] = useState({ email: "", password: "" }); // State for validation errors
  const { loading, user } = useSelector((store) => store.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateEmail = (email) => {
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    if (!email) {
      return t("emailRequired");
    } else if (!emailRegex.test(email)) {
      return t("invalidEmail");
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) {
      return t("passwordRequired");
    } else if (password.length > 30) {
      return t("passwordTooLong");
    }
    return "";
  };

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });

    // Validation and error removal
    if (name === "email") {
      const emailError = validateEmail(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: emailError,
      }));
    }

    if (name === "password") {
      const passwordError = validatePassword(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: passwordError,
      }));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(input.email);
    const passwordError = validatePassword(input.password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    try {
      dispatch(setLoading(true));

      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        dispatch(resetJobs());
        navigate("/home");
        toast.success(res.data.message);
      } else {
        if (res.data.requireVerification) {
          // ถ้าต้องการการยืนยันอีเมล
          navigate("/verify-email", { state: { email: input.email } });
          toast.error("Please verify your email before logging in.");
        } else {
          // จัดการข้อผิดพลาดอื่นๆ
          handleLoginError(res.data.message);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.status === 403) {
        navigate("/verify-email", { state: { email: input.email } });
        toast.error(t("verifyEmailBeforeLogin"));
      } else if (
        error.response?.data?.message === "ACCOUNT_NOT_EXIST_WITH_ROLE"
      ) {
        toast.error(t("accountNotExistWithRole"));
      } else if (
        error.response?.data?.message === "FILL_INFORMATION_COMPLETELY"
      ) {
        toast.error(t("fillInformationCompletely"));
      } else if (
        error.response?.data?.message === "INCORRECT_EMAIL_OR_PASSWORD"
      ) {
        toast.error(t("incorrectEmailOrPassword"));
      } else {
        const errorMessage =
          error.response?.data?.message ||
          "An unexpected error occurred. Please try again.";
        toast.error(errorMessage);
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLoginError = (message) => {
    if (message === "invalid email") {
      setErrors({ email: "อีเมลไม่ถูกต้อง", password: "" });
    } else if (message === "invalid password") {
      setErrors({ email: "", password: "รหัสผ่านไม่ถูกต้อง" });
    } else {
      setErrors({
        email: "อีเมลและรหัสผ่านไม่ถูกต้อง",
        password: "อีเมลและรหัสผ่านไม่ถูกต้อง",
      });
    }
    toast.error(message);
  };

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  return (
    <div className="bg-[#f4f4f4] min-h-screen flex flex-col">
      <Navbar2 />
      <motion.form
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={submitHandler}
        className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto py-8 px-4 gap-y-10 md:gap-x-20 my-20"
      >
        {/* Left-side Illustration */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full md:w-1/2 hidden md:block"
        >
          <img src={login} alt="Illustration" className="w-full h-auto" />
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full md:w-1/2 bg-[#723bcf] rounded-lg p-6 md:p-8 shadow-lg shadow-purple-500/50 transform translate-x-20 translate-y-20"
        >
          {/* Heading with Logo */}
          <div className="flex items-center justify-between mb-5">
            <h1 className="font-bold text-3xl md:text-4xl text-white leading-tight">
              {t("welcome")} <br />
              <span className="text-sm font-normal leading-none">
                {t("welcomeSubtitle")}
              </span>
            </h1>
            {/* Logo on the right */}
            <img
              src={LOGOLOGIN}
              alt={t("logo")}
              className="w-12 h-12 md:w-16 md:h-16" // Responsive logo size
            />
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <div>
              <Label className="font-bold text-white">{t("email")}</Label>
              <Input
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                className={`mt-2 pl-3 w-full bg-[#723bcf] text-white font-semibold ${
                  errors.email ? "border-red-500" : "border-white"
                }`}
                type="email"
                placeholder={t("enterEmail")}
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>

            <div className="relative">
              <Label className="font-bold text-white">{t("password")}</Label>
              <Input
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                className={`mt-2 pl-3 w-full bg-[#723bcf] text-white font-semibold pr-10 ${
                  errors.password ? "border-red-500" : "border-white"
                }`}
                type={passwordVisible ? "text" : "password"}
                placeholder={t("enterPassword")}
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute inset-y-0 right-0 flex items-center justify-center h-full w-10 text-black my-4"
              >
                {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className=" text-red-500">{errors.password}</p>
            )}

            <div className="mt-4">
              <Label className="font-bold text-white">{t("role")}</Label>
              <RadioGroup
                defaultValue="student"
                className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-6 mt-2"
              >
                <div className="flex items-center">
                  <Input
                    type="radio"
                    name="role"
                    value="student"
                    checked={input.role === "student"}
                    onChange={changeEventHandler}
                    className="cursor-pointer h-4 w-4"
                  />
                  <Label htmlFor="student" className="text-white ml-2">
                    {t("student")}
                  </Label>
                </div>
                <div className="flex items-center">
                  <Input
                    type="radio"
                    name="role"
                    value="agent"
                    checked={input.role === "agent"}
                    onChange={changeEventHandler}
                    className="cursor-pointer h-4 w-4"
                  />
                  <Label htmlFor="agent" className="text-white ml-2">
                    {t("agent")}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-between items-center">
              <Link
                to="/forgot-password"
                className="text-sm text-yellow-500 hover:underline font-bold"
              >
                {t("forgotPassword")}
              </Link>
            </div>

            {loading ? (
              <Button className="mt-4 w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-purple-900">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("pleaseWaitLogin")}
              </Button>
            ) : (
              <Button
                type="submit"
                className="mt-4 w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-purple-900"
              >
                {t("login")}
              </Button>
            )}

            <div className="text-left mt-4">
              <span className="font-bold text-white">
                {t("dontHaveAccount")}{" "}
                <Link to="/signup" className="text-yellow-500 underline">
                  {t("signup")}
                </Link>
              </span>
            </div>
          </div>
        </motion.div>
      </motion.form>
      <Footer />
    </div>
  );
};

export default Login;
