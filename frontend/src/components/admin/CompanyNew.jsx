import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { COMPANY_ALL_API } from "../utils/constant";
import { setSingleCompany } from "@/redux/companySlice";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useTranslation } from "react-i18next";

const CompanyNew = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [companyName, setCompanyName] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!companyName.trim()) {
      newErrors.companyName = t("companyNameRequired");
      isValid = false;
    } else if (companyName.trim().length < 2) {
      newErrors.companyName = t("companyNameMinLength");
      isValid = false;
    } else if (companyName.trim().length > 100) {
      newErrors.companyName = t("companyNameMaxLength");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const registerNewCompany = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const res = await axios.post(
        `${COMPANY_ALL_API}/register`,
        { companyName: companyName.trim() },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res?.data?.success) {
        toast.success(t("companyRegisteredSuccess"));
        const companyId = res?.data?.company?.company_id;
        dispatch(setSingleCompany(res.data.company));
        navigate(`/admin/companies/${companyId}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(t("failedToRegisterCompany"));
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <Navbar />
      <div className="max-w-4xl mx-auto my-8 md:my-20 p-4 md:p-8 bg-white rounded-lg shadow-lg">
        <div className="mb-6 md:mb-10 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#723bcf] mb-2">
            {t("createYourCompany")}
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            {t("letsGetStarted")}
          </p>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="my-2">
            <Label
              htmlFor="companyName"
              className="text-base md:text-lg font-medium "
            >
              {t("companyName")}
            </Label>
            <Input
              id="companyName"
              type="text"
              className={`mt-1 pl-4 pr-4 py-2 w-full rounded-md focus:ring-2 focus:ring-[#723bcf] ${
                errors.companyName ? "border-red-500" : "border-gray-400"
              }`}
              placeholder={t("enterCompanyName")}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6 md:mt-10">
          <Button
            onClick={() => navigate("/admin/companies")}
            variant="outline"
            className="w-full sm:w-auto px-4 md:px-6"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={registerNewCompany}
            className="w-full sm:w-auto bg-[#723bcf] text-white px-4 md:px-6 hover:bg-[#5f2db8]"
            disabled={!companyName.trim()}
          >
            {t("continue")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyNew;
