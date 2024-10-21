import { Link, useNavigate } from "react-router-dom";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup } from "../ui/radio-group";
import { useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "../../components/utils/constant";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Image as ImageIcon } from "lucide-react";
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

      const [prefix, domain] = value.split("@");

      const isValidPrefixLength = prefix.length <= 20;
      const isValidDomainLength = domain ? domain.length <= 12 : true;

      if (prefix.length > 20) {
        setErrors({
          ...errors,
          email: "Please enter no more than 20 characters before '@'.",
        });
        return;
      }

      if (value.includes("@") && !domain) {
        setInput({ ...input, email: value });
      } else if (isValidPrefixLength && isValidDomainLength) {
        setInput({ ...input, email: value });
      } else {
        setErrors({ ...errors, email: "Please enter a valid email address." });
      }

      if (!isNotThai) {
        setErrors({ ...errors, email: "Please enter English." });
      } else if (!isValidEmail || !isAllowedDomain) {
        setErrors({ ...errors, email: "Please enter a valid email address." });
      } else {
        setErrors({ ...errors, email: false });
      }
    } else if (name === "password") {
      if (value.length <= 30) {
        setInput({ ...input, password: value });
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

    // เพิ่มการตรวจสอบเพิ่มเติม
    const additionalValidation = {
      fullname: input.fullname.trim() === "",
      email: input.email.trim() === "",
      phoneNumber: input.phoneNumber.trim() === "" || input.phoneNumber.length < 8 || input.phoneNumber.length > 13,
      password: input.password.trim() === "" || input.password.length < 8 || input.password.length > 30,
      confirmPassword: input.confirmPassword.trim() === "" || input.confirmPassword !== input.password,
      role: input.role.trim() === "",
      file: !input.file
    };

    const hasErrors = Object.values(additionalValidation).some(value => value === true);

    if (hasErrors) {
      setErrors(prevErrors => ({
        ...prevErrors,
        ...additionalValidation
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
      phoneNumber: !input.phoneNumber ? t("phoneNumberRequired") : (input.phoneNumber.length < 8 || input.phoneNumber.length > 13 ? t("phoneNumberLengthError") : ""),
      password: input.password.length < 8 || input.password.length > 30,
      confirmPassword: input.confirmPassword !== input.password,
      role: !input.role,
      file: !input.file || errors.file,
    };

    if (Object.values(newErrors).some(error => error !== false && error !== "")) {
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
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="bg-[#f4f4f4]">
      <Navbar2 />
      <div className="flex items-center justify-center max-w-7xl mx-auto my-5 px-4">
        <motion.form
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={submitHandler}
          className="w-full md:w-3/4 lg:w-1/2 border border-purple-900 rounded-lg p-6 sm:p-8 md:p-10 my-10 bg-[#723bcf] shadow-lg shadow-purple-500/50 transform translate-x-2 translate-y-2"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-bold text-2xl sm:text-3xl md:text-4xl mb-5 text-center my-1 text-white"
          >
            {t("createAccount")}
          </motion.h1>
          <hr className="my-3" />

          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center mb-6">
            <Label className="font-bold text-white mb-2 my-2">
              {t("uploadProfilePicture")}
            </Label>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex-shrink-0">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile Preview"
                    className="w-32 h-32 object-cover rounded-full border-4 border-white"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
                    <ImageIcon className="text-gray-600 w-10 h-10" />
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={changeFileHandler}
                  className={`bg-[#723bcf] border ${
                    errors.file ? "border-red-500" : "border-white"
                  } text-white font-semibold`}
                />
                {errors.file && (
                  <div className="text-red-400 text-sm mt-1">
                    {t("fileValidationMessage")}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="my-2">
              <Label className="font-bold text-white">{t("fullname")}</Label>
              <Input
                value={input.fullname}
                name="fullname"
                onChange={changeEventHandler}
                className={`my-2 bg-[#723bcf] border ${
                  errors.fullname ? "border-red-500" : "border-white"
                } text-white font-semibold`}
                type="text"
                placeholder={t("enterFullname")}
              />
              {errors.fullname && (
                <div className="text-red-400 text-sm">
                  {t("fullnameValidation")}
                </div>
              )}
            </div>

            <div className="my-2">
              <Label className="font-bold text-white">{t("phoneNumber")}</Label>
              <Input
                value={input.phoneNumber}
                name="phoneNumber"
                onChange={changeEventHandler}
                className={`my-2 bg-[#723bcf] border ${
                  errors.phoneNumber ? "border-red-500" : "border-white"
                } text-white font-semibold`}
                type="tel"
                placeholder={t("phoneNumberPlaceholder")}
                maxLength={13}
              />
              {errors.phoneNumber && (
                <div className="text-red-400 text-sm">{t("phoneNumberValidation")}</div>
              )}
            </div>

            <div className="my-2">
              <Label className="font-bold text-white">{t("email")}</Label>
              <Input
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                className={`my-2 bg-[#723bcf] border ${
                  errors.email ? "border-red-500" : "border-white"
                } text-white font-semibold`}
                type="email"
                placeholder={t("emailPlaceholder")}
              />
              {errors.email && (
                <div className="text-red-400 text-sm">
                  {errors.email === "Please enter English."
                    ? t("emailEnterEnglish")
                    : errors.email ===
                      "Please enter no more than 20 characters before '@'."
                    ? t("emailMaxCharacters")
                    : t("emailValidDomains")}
                </div>
              )}
            </div>

            <div className="my-2">
              <Label className="font-bold text-white">{t("role")}</Label>
              <RadioGroup className="flex space-x-4 my-2">
                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name="role"
                    value="student"
                    checked={input.role === "student"}
                    onChange={changeEventHandler}
                    className="cursor-pointer bg-[#723bcf] border-white text-white"
                  />
                  <Label
                    htmlFor="option-one"
                    className="text-white font-semibold"
                  >
                    {t("student")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name="role"
                    value="agent"
                    checked={input.role === "agent"}
                    onChange={changeEventHandler}
                    className="cursor-pointer bg-[#723bcf] border-white text-white"
                  />
                  <Label
                    htmlFor="option-two"
                    className="text-white font-semibold"
                  >
                    {t("agent")}
                  </Label>
                </div>
              </RadioGroup>
              {errors.role && (
                <div className="text-red-400 text-sm">{t("roleValidation")}</div>
              )}
            </div>

            <div className="my-2 relative">
              <Label className="font-bold text-white">{t("password")}</Label>
              <Input
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                type={passwordVisible ? "text" : "password"}
                className={`my-2 bg-[#723bcf] border ${
                  errors.password ? "border-red-500" : "border-white"
                } text-white font-semibold`}
                placeholder={t("enterPassword")}
              />
              <button
                type="button"
                className="absolute right-3 top-10"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <EyeOff /> : <Eye />}
              </button>
              {errors.password && (
                <div className="text-red-400 text-sm">{t("passwordError")}</div>
              )}
            </div>

            <div className="my-2 relative">
              <Label className="font-bold text-white">
                {t("confirmPassword")}
              </Label>
              <Input
                value={input.confirmPassword}
                name="confirmPassword"
                onChange={handleConfirmPasswordChange}
                type={confirmPasswordVisible ? "text" : "password"}
                className={`my-2 bg-[#723bcf] border ${
                  errors.confirmPassword ? "border-red-500" : "border-white"
                } text-white font-semibold`}
                placeholder={t("confirmPasswordPlaceholder")}
              />
              <button
                type="button"
                className="absolute right-3 top-10"
                onClick={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
              >
                {confirmPasswordVisible ? <EyeOff /> : <Eye />}
              </button>
              {errors.confirmPassword && (
                <div className="text-red-400 text-sm">
                  {t("confirmPasswordError")}
                </div>
              )}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              type="submit"
              className="w-full mt-5 bg-black hover:bg-purple-800 text-white font-bold py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : t("signupButton")}
            </Button>

            <p className="mt-5 text-center text-white text-sm sm:text-base">
              {t("alreadyHaveAccount")}{" "}
              <Link to="/login" className="text-orange-400 font-bold">
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

export default Signup;
