import { ArrowLeftIcon, FileImage } from "lucide-react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import axios from "axios";
import { COMPANY_ALL_API } from "../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyById";
import { useTranslation } from "react-i18next";
import { FaSpinner } from "react-icons/fa";

const CompanySetup = () => {
  const { t } = useTranslation();
  const params = useParams();
  useGetCompanyById(params.id);
  const [input, setInput] = useState({
    name: "",
    agent_fullname: "",
    email: "",
    phoneNumber: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });

  const { singleCompany } = useSelector((state) => state.company);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [charCount, setCharCount] = useState(0);

  const validateForm = () => {
    const newErrors = {};

    if (!input.name.trim()) {
      newErrors.name = t("companyNameRequired");
    }

    if (!input.agent_fullname.trim()) {
      newErrors.agent_fullname = t("agentNameRequired");
    } else if (input.agent_fullname.trim().length < 3) {
      newErrors.agent_fullname = t("agentNameMinLength");
    } else if (input.agent_fullname.trim().length > 100) {
      newErrors.agent_fullname = t("agentNameMaxLength");
    } else if (!/^[a-zA-Zก-๙\s]+$/.test(input.agent_fullname)) {
      newErrors.agent_fullname = t("agentNameOnlyThaiEnglish");
    }

    if (!input.email.trim()) {
      newErrors.email = t("emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(input.email)) {
      newErrors.email = t("invalidEmailFormat");
    }

    if (!input.description.trim()) {
      newErrors.description = t("descriptionRequired");
    } else if (input.description.length < 10) {
      newErrors.description = t("descriptionMinLength");
    } else if (input.description.length > 400) {
      newErrors.description = t("descriptionMaxLength");
    }

    if (!input.location.trim()) {
      newErrors.location = t("locationRequired");
    }

    if (!input.phoneNumber.trim()) {
      newErrors.phoneNumber = t("phoneNumberRequired");
    } else if (!/^\d{8,13}$/.test(input.phoneNumber)) {
      newErrors.phoneNumber = t("phoneNumberLength");
    }

    if (!input.file && !singleCompany.logo) {
      newErrors.file = t("logoRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    if (name === "agent_fullname") {
      // Only allow Thai and English letters for agent_fullname
      const sanitizedValue = value.replace(/[^a-zA-Zก-๙\s]/g, "");
      setInput((prev) => ({ ...prev, [name]: sanitizedValue }));
    } else if (name === "description") {
      if (value.length <= 400) {
        setInput((prev) => ({ ...prev, [name]: value }));
        setCharCount(value.length);
      }
    } else if (name === "phoneNumber") {
      // Only allow digits and limit to 10 characters
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
      setInput((prev) => ({ ...prev, [name]: sanitizedValue }));
    } else {
      setInput((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      // ตรวจสอบประเภทไฟล์
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        toast.error(t("fileTypeError"));
        e.target.value = ""; // รีเซ็ตค่า input file
        return;
      }

      setInput({
        ...input,
        file,
      });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error(t("pleaseCorrectFormErrors"));
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("agent_fullname", input.agent_fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("description", input.description);
    formData.append("location", input.location);

    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      const res = await axios.put(
        `${COMPANY_ALL_API}/update/${params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(t("COMPANY_UPDATED_SUCCESSFULLY"));
        navigate("/admin/companies");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || t("somethingWentWrong"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || "",
        agent_fullname: singleCompany.agent_fullname || "",
        email: singleCompany.email || "",
        phoneNumber: singleCompany.phoneNumber || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
        file: singleCompany.file || null,
      });
    }
  }, [singleCompany]);

  if (!singleCompany) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Loading company data...
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch the company information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <Navbar className="bg-white" />
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
        <form onSubmit={submitHandler}>
          <div className="flex items-center gap-5 mb-6">
            <Button
              onClick={() => navigate("/admin/companies")}
              variant="outline"
              className="flex items-center gap-2 text-gray-600 hover:bg-purple-50 transition-colors duration-300"
              disabled={loading}
            >
              <ArrowLeftIcon size={18} />
              <span>{t("back")}</span>
            </Button>
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-[#7e22ce] ml-4">
                {t("companySetup")}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
            <div className="space-y-2">
              <Label className="text-sm font-medium  text-gray-700">
                {t("companyName")}
              </Label>
              <Input
                type="text"
                placeholder={t("enterCompanyName")}
                name="name"
                value={input.name}
                onChange={changeEventHandler}
                className={`w-full border px-4 ${
                  errors.name ? "border-red-500" : "border-gray-400"
                } rounded-md focus:ring-2 focus:ring-[#7e22ce] focus:border-transparent`}
                disabled={loading}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{t(errors.name)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t("description")}
              </Label>
              <textarea
                placeholder={t("enterCompanyDescription")}
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className={`w-full h-24 px-4 py-2 border ${
                  errors.description ? "border-red-500" : "border-gray-400"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#7e22ce] focus:border-[#7e22ce] resize-none`}
                disabled={loading}
                maxLength={400}
              />
              <div className="text-xs text-gray-500 text-right">
                {charCount}/400
              </div>
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {t(errors.description)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t("agentName")}
              </Label>
              <Input
                type="text"
                placeholder={t("enterAgentName")}
                name="agent_fullname"
                value={input.agent_fullname}
                onChange={changeEventHandler}
                className={`w-full border px-4 ${
                  errors.agent_fullname ? "border-red-500" : "border-gray-400"
                } rounded-md focus:ring-2 focus:ring-[#7e22ce] focus:border-transparent`}
                disabled={loading}
                maxLength={100}
              />
              {errors.agent_fullname && (
                <p className="text-red-500 text-xs mt-1">
                  {t(errors.agent_fullname)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t("location")}
              </Label>
              <Input
                type="text"
                placeholder={t("enterLocation")}
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className={`w-full border px-4 ${
                  errors.location ? "border-red-500" : "border-gray-400"
                } rounded-md focus:ring-2 focus:ring-[#7e22ce] focus:border-transparent`}
                disabled={loading}
              />
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">
                  {t(errors.location)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t("email")}
              </Label>
              <Input
                type="email"
                placeholder={t("enterEmail")}
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                className={`w-full border px-4 ${
                  errors.email ? "border-red-500" : "border-gray-400"
                } rounded-md focus:ring-2 focus:ring-[#7e22ce] focus:border-transparent`}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{t(errors.email)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t("phoneNumber")}
              </Label>
              <Input
                type="tel"
                placeholder={t("enterPhoneNumber")}
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                className={`w-full border px-4 ${
                  errors.phoneNumber ? "border-red-500" : "border-gray-400"
                } rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                disabled={loading}
                maxLength={10}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {t(errors.phoneNumber)}
                </p>
              )}
            </div>

            <div className="space-y-2 col-span-full">
              <Label className="text-sm font-medium text-gray-700">
                {t("companyLogo")} <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-20 h-20 bg-[#d4d4d4] rounded-full overflow-hidden border-2 border-[#7e22ce]">
                  {input.file ? (
                    <img
                      src={URL.createObjectURL(input.file)}
                      alt="Company logo preview"
                      className="w-full h-full object-cover"
                    />
                  ) : singleCompany.logo ? (
                    <img
                      src={singleCompany.logo}
                      alt="Company logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileImage className="text-[#a6a6a6]" size={32} />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={changeFileHandler}
                    className="hidden"
                    id="logo-upload"
                    disabled={loading}
                  />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-400 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    {t("chooseFile")}
                  </label>
                  {errors.file && (
                    <p className="text-red-500 text-xs mt-1">{errors.file}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              className="px-6 py-2 bg-[#7e22ce] text-white rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-300"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  {t("creating")}
                </div>
              ) : (
                t("create")
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;
