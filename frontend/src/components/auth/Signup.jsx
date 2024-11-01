import { Link, useNavigate } from "react-router-dom";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "../../components/utils/constant";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Image as ImageIcon, Check, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { motion } from "framer-motion";
import Navbar2 from "../shared/Navbar2";
import Footer from "../shared/Footer";
import { useTranslation } from "react-i18next"; // เพิ่มการ import นี้

const Signup = () => {
  const { t } = useTranslation(); // เพิ่มบรรทัดนี้เพื่อใช้งานฟังก์ชันแปลภาษา
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "",
    file: "",
  });

  const [errors, setErrors] = useState({
    fullname: false,
    email: false,
    phoneNumber: "",
    password: false,
    confirmPassword: false,
    role: false,
    file: false,
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const [showPasswordCriteria, setShowPasswordCriteria] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);

  const validatePassword = (password) => {
    setPasswordCriteria({
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password),
    });
  };

  const changeEventHandler = (e) => {
    const { name, value } = e.target;

    if (name === "fullname") {
      const isValidFullname = /^[ก-๙a-zA-Z\s]*$/.test(value);
      if (isValidFullname && value.length <= 50) {
        setInput({ ...input, fullname: value });
      }
      setErrors({
        ...errors,
        fullname: !(value.length >= 5 && value.length <= 50 && isValidFullname),
      });
    } else if (name === "phoneNumber") {
      const digitOnly = value.replace(/\D/g, "");
      if (digitOnly.length <= 13) {
        setInput({ ...input, phoneNumber: digitOnly });
        if (digitOnly.length === 0) {
          setErrors({
            ...errors,
            phoneNumber: t("phoneNumberRequired"),
          });
        } else if (digitOnly.length < 8 || digitOnly.length > 13) {
          setErrors({
            ...errors,
            phoneNumber: t("phoneNumberLengthError"),
          });
        } else {
          setErrors({ ...errors, phoneNumber: "" });
        }
      }
    } else if (name === "email") {
      const isNotThai = /^[^\u0E00-\u0E7F]*$/.test(value);
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isAllowedDomain =
        /(gmail\.com|ku\.th|outlook\.com|yahoo\.com|hotmail\.com)$/.test(value);

      if (!value) {
        setErrors({ ...errors, email: t("emailRequired") });
        setInput({ ...input, email: value });
        return;
      }

      const [prefix, domain] = value.split("@");

      const isValidPrefixLength = prefix.length <= 20;
      const isValidDomainLength = domain ? domain.length <= 12 : true;

      if (prefix.length > 20) {
        setErrors({
          ...errors,
          email: t("emailPrefixLengthError"),
        });
        return;
      }

      if (value.includes("@") && !domain) {
        setInput({ ...input, email: value });
      } else if (isValidPrefixLength && isValidDomainLength) {
        setInput({ ...input, email: value });
      } else {
        setErrors({ ...errors, email: t("emailValidation") });
      }

      if (!isNotThai) {
        setErrors({ ...errors, email: t("emailEnterEnglish") });
      } else if (!isValidEmail || !isAllowedDomain) {
        setErrors({ ...errors, email: t("emailValidation") });
      } else {
        setErrors({ ...errors, email: false });
      }
    } else if (name === "password") {
      if (value.length <= 30) {
        setInput({ ...input, password: value });
        validatePassword(value);
        setShowPasswordError(false);
        setShowPasswordCriteria(true);
      }
      setErrors({ ...errors, password: value.length < 8 });
    } else if (name === "role") {
      setInput({ ...input, role: value });
      setErrors({ ...errors, role: false });
    } else {
      setInput({ ...input, [name]: value });
      setErrors({ ...errors, [name]: false });
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setInput({ ...input, confirmPassword: value });
    setErrors({
      ...errors,
      confirmPassword: value !== input.password,
    });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const validExtensions = /\.(png|jpe?g)$/i;
      if (!validExtensions.test(file.name)) {
        setErrors({ ...errors, file: true });
        setPreviewUrl(null);
      } else {
        setErrors({ ...errors, file: false });
        setInput({ ...input, file });
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setErrors({ ...errors, file: false });
      setPreviewUrl(null);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.password.trim()) {
      setShowPasswordError(true);
      setShowPasswordCriteria(false);
    }

    const additionalValidation = {
      fullname: input.fullname.trim() === "",
      email: !input.email.trim() ? t("emailRequired") : false,
      phoneNumber: !input.phoneNumber.trim()
        ? t("phoneNumberRequired")
        : input.phoneNumber.length < 8 || input.phoneNumber.length > 13
        ? t("phoneNumberLengthError")
        : false,
      password:
        input.password.trim() === "" ||
        input.password.length < 8 ||
        input.password.length > 30,
      confirmPassword:
        input.confirmPassword.trim() === "" ||
        input.confirmPassword !== input.password,
      role: input.role.trim() === "",
      file: !input.file,
    };

    const hasErrors = Object.values(additionalValidation).some(
      (value) => value === true
    );

    if (hasErrors) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...additionalValidation,
      }));
      toast.error(t("fillAllFieldsCorrectly"));
      return;
    }

    const newErrors = {
      fullname:
        !input.fullname ||
        input.fullname.length < 5 ||
        input.fullname.length > 50 ||
        /[^ก-๙a-zA-Z\s]/.test(input.fullname),
      email:
        !input.email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email) ||
        /[ก-๙]/.test(input.email) ||
        !/(gmail\.com|ku\.th|outlook\.com|yahoo\.com|hotmail\.com)$/.test(
          input.email
        ) ||
        input.email.split("@")[0].length > 20,
      phoneNumber: !input.phoneNumber
        ? t("phoneNumberRequired")
        : input.phoneNumber.length < 8 || input.phoneNumber.length > 13
        ? t("phoneNumberLengthError")
        : "",
      password: input.password.length < 8 || input.password.length > 30,
      confirmPassword: input.confirmPassword !== input.password,
      role: !input.role,
      file: !input.file || errors.file,
    };

    if (
      Object.values(newErrors).some((error) => error !== false && error !== "")
    ) {
      setErrors(newErrors);
      toast.error(t("fillAllFieldsCorrectly"));
      return;
    }

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);

    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        navigate("/verify-email", { state: { email: input.email } });
        toast.success(t(res.data.message));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message;
      if (errorMessage === "User already exists with this email.") {
        toast.error(t("EMAIL_ALREADY_EXISTS"));
      } else if (errorMessage === "User already exists with this phone number.") {
        toast.error(t("PHONE_ALREADY_EXISTS"));
      } else {
        toast.error(t(errorMessage));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <Navbar2 />
      <div className="container mx-auto px-4 py-8">
        <motion.form
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={submitHandler}
          className="max-w-3xl mx-auto border border-purple-900 rounded-2xl p-6 sm:p-8 md:p-10 bg-[#723bcf] shadow-xl"
        >
          {/* Form Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {t("createAccount")}{" "}
              <span className="text-orange-400">{t("newsAccount")}</span>
            </h1>
          </motion.div>

          {/* Profile Picture Section */}
          <div className="mb-8">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <label htmlFor="fileInput" className="cursor-pointer">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile Preview"
                      className="w-32 h-32 object-cover rounded-full border-4 border-white transition-all duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-[#d4d4d4] rounded-full flex items-center justify-center border-4 border-white/30 transition-all duration-300 hover:border-white">
                      <ImageIcon className="text-[#a6a6a6] w-12 h-12" />
                    </div>
                  )}
                </label>
                <Input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={changeFileHandler}
                  className="hidden" // Hide the default file input
                />
              </div>
              {errors.file && (
                <p className="mt-2 text-red-400 text-sm">
                  {t("fileValidationMessage")}
                </p>
              )}
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fullname Field */}
            <div className="form-group">
              <Label className="block text-white font-semibold mb-2">
                {t("fullname")}
              </Label>
              <div className="relative">
                <Input
                  value={input.fullname}
                  name="fullname"
                  onChange={changeEventHandler}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                    errors.fullname ? "border-red-400" : "border-white/30"
                  } text-white placeholder-white/50 focus:border-white focus:ring-2 focus:ring-white/20 transition-all duration-300`}
                  type="text"
                  placeholder={t("enterFullname")}
                />
                {errors.fullname && (
                  <p className="mt-2 text-red-400 text-sm">
                    {t("fullnameValidation")}
                  </p>
                )}
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="form-group">
              <Label className="block text-white font-semibold mb-2">
                {t("phoneNumber")}
              </Label>
              <div className="relative">
                <Input
                  value={input.phoneNumber}
                  name="phoneNumber"
                  onChange={changeEventHandler}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                    errors.phoneNumber ? "border-red-400" : "border-white/30"
                  } text-white placeholder-white/50 focus:border-white focus:ring-2 focus:ring-white/20 transition-all duration-300`}
                  type="tel"
                  placeholder={t("enterPhoneNumber")}
                />
                {errors.phoneNumber && (
                  <p className="mt-2 text-red-400 text-sm">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="form-group">
              <Label className="block text-white font-semibold mb-2">
                {t("email")}
              </Label>
              <div className="relative">
                <Input
                  value={input.email}
                  name="email"
                  onChange={changeEventHandler}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                    errors.email ? "border-red-400" : "border-white/30"
                  } text-white placeholder-white/50 focus:border-white focus:ring-2 focus:ring-white/20 transition-all duration-300`}
                  type="email"
                  placeholder={t("enterEmail")}
                />
                {errors.email && (
                  <p className="mt-2 text-red-400 text-sm">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Role Field */}
            <div className="form-group">
              <Label className="block text-white font-semibold mb-2">
                {t("role")}
              </Label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name="role"
                    value="student"
                    checked={input.role === "student"}
                    onChange={changeEventHandler}
                    className="w-4 h-4 text-purple-600 bg-white/10 border-white/30 focus:ring-purple-500"
                  />
                  <Label className="text-white">{t("student")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name="role"
                    value="agent"
                    checked={input.role === "agent"}
                    onChange={changeEventHandler}
                    className="w-4 h-4 text-purple-600 bg-white/10 border-white/30 focus:ring-purple-500"
                  />
                  <Label className="text-white">{t("agent")}</Label>
                </div>
              </div>
              {errors.role && (
                <p className="mt-2 text-red-400 text-sm">
                  {t("roleValidation")}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <Label className="block text-white font-semibold mb-2">
                {t("password")}
              </Label>
              <div className="relative h-[46px]">
                <Input
                  value={input.password}
                  name="password"
                  onChange={changeEventHandler}
                  onFocus={() => setShowPasswordCriteria(true)}
                  type={passwordVisible ? "text" : "password"}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                    errors.password ? "border-red-400" : "border-white/30"
                  } text-white placeholder-white/50 pr-12`}
                  placeholder={t("enterPassword")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-[50%] -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-300"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {showPasswordError && (
                <p className="mt-2 text-red-400 text-sm">
                  {t("passwordError")}
                </p>
              )}
              {showPasswordCriteria && (
                <div className="space-y-2 mt-2">
                  {Object.entries(passwordCriteria).map(([criterion, isValid]) => (
                    <div key={criterion} className="flex items-center text-xs">
                      {isValid ? (
                        <Check className="text-green-400 mr-2" size={14} />
                      ) : (
                        <X className="text-red-400 mr-2" size={14} />
                      )}
                      <span className={isValid ? "text-green-400" : "text-red-400"}>
                        {t(getCriterionText(criterion))}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <Label className="block text-white font-semibold mb-2">
                {t("confirmPassword")}
              </Label>
              <div className="relative h-[46px]">
                <Input
                  value={input.confirmPassword}
                  name="confirmPassword"
                  onChange={handleConfirmPasswordChange}
                  type={confirmPasswordVisible ? "text" : "password"}
                  className={`w-full px-4 py-3 rounded-lg bg-white/10 border ${
                    errors.confirmPassword
                      ? "border-red-400"
                      : "border-white/30"
                  } text-white placeholder-white/50 pr-12`}
                  placeholder={t("confirmPassword")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-[50%] -translate-y-1/2 text-white/70 hover:text-white transition-colors duration-300"
                  onClick={() =>
                    setConfirmPasswordVisible(!confirmPasswordVisible)
                  }
                >
                  {confirmPasswordVisible ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-red-400 text-sm">
                  {t("confirmPasswordError")}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 flex flex-col items-center"
          >
            <Button
              type="submit"
              className="w-80 bg-black hover:bg-purple-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin mx-auto" />
              ) : (
                t("signupButton")
              )}
            </Button>

            <p className="mt-6 text-center text-white">
              {t("alreadyHaveAccount")}{" "}
              <Link
                to="/login"
                className="text-orange-400 font-bold hover:text-orange-300 transition-colors duration-300 underline"
              >
                {t("loginHere")}
              </Link>
            </p>
          </motion.div>
        </motion.form>
      </div>
      <Footer />
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

export default Signup;
