import { useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSelector } from "react-redux";
import axios from "axios";
import { JOB_ALL_API } from "../utils/constant";
import { toast } from "sonner";

const jobTypeOptions = [
  { value: "Full-time", label: "fullTime" },
  { value: "Part-time", label: "partTime" },
  { value: "Hybrid", label: "hybrid" },
  { value: "Internship", label: "internship" },
];

const PostJobs = () => {
  const { t, i18n } = useTranslation();
  const [input, setInput] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    jobType: "",
    experience: "",
    position: "",
    companyId: "",
  });

  const [errors, setErrors] = useState({});

  const { companies } = useSelector((state) => state.company);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [charCount, setCharCount] = useState(0);

  const provinces = [
    {
      name: { en: "Bangkok", th: "กรุงเทพมหานคร" },
      districts: [
        { en: "Phra Nakhon", th: "พระนคร" },
        { en: "Dusit", th: "ดุสิต" },
        { en: "Nong Chok", th: "หนองจอก" },
        { en: "Bang Rak", th: "บางรัก" },
        { en: "Bang Khen", th: "บางเขน" },
        { en: "Bang Kapi", th: "บางกะปิ" },
        { en: "Pathum Wan", th: "ปทุมวัน" },
        { en: "Pom Prap Sattru Phai", th: "ป้อมปราบศัตรูพ่าย" },
        { en: "Phra Khanong", th: "พระโขนง" },
        { en: "Min Buri", th: "มีนบุรี" },
        { en: "Lat Krabang", th: "ลาดกระบัง" },
        { en: "Yan Nawa", th: "ยานนาวา" },
        { en: "Samphanthawong", th: "สัมพันธวงศ์" },
        { en: "Phaya Thai", th: "พญาไท" },
        { en: "Thon Buri", th: "ธนบุรี" },
        { en: "Bangkok Yai", th: "บางกอกใหญ่" },
        { en: "Huai Khwang", th: "ห้วยขวาง" },
        { en: "Khlong San", th: "คลองสาน" },
        { en: "Taling Chan", th: "ตลิ่งชัน" },
        { en: "Bangkok Noi", th: "บางกอกน้อย" },
        { en: "Bang Khun Thian", th: "บางขุนเทียน" },
        { en: "Phasi Charoen", th: "ภาษีเจริญ" },
        { en: "Nong Khaem", th: "หนองแขม" },
        { en: "Rat Burana", th: "ราษฎร์บูรณะ" },
        { en: "Bang Phlat", th: "บางพลัด" },
        { en: "Din Daeng", th: "ดินแดง" },
        { en: "Bueng Kum", th: "บึงกุ่ม" },
        { en: "Sathon", th: "สาทร" },
        { en: "Bang Sue", th: "บางซื่อ" },
        { en: "Chatuchak", th: "จตุจักร" },
        { en: "Bang Kho Laem", th: "บางคอแหลม" },
        { en: "Prawet", th: "ประเวศ" },
        { en: "Khlong Toei", th: "คลองเตย" },
        { en: "Suan Luang", th: "สวนหลวง" },
        { en: "Chom Thong", th: "จอมทอง" },
        { en: "Don Mueang", th: "ดอนเมือง" },
        { en: "Ratchathewi", th: "ราชเทวี" },
        { en: "Lat Phrao", th: "ลาดพร้าว" },
        { en: "Watthana", th: "วัฒนา" },
        { en: "Bang Khae", th: "บางแค" },
        { en: "Lak Si", th: "หลักสี่" },
        { en: "Sai Mai", th: "สายไหม" },
        { en: "Khan Na Yao", th: "คันนายาว" },
        { en: "Saphan Sung", th: "สะพานสูง" },
        { en: "Wang Thonglang", th: "วังทองหลาง" },
        { en: "Khlong Sam Wa", th: "คลองสามวา" },
        { en: "Bang Na", th: "บางนา" },
        { en: "Thawi Watthana", th: "ทวีวัฒนา" },
        { en: "Thung Khru", th: "ทุ่งครุ" },
        { en: "Bang Bon", th: "บางบอน" },
      ],
    },
    {
      name: { en: "Chiang Mai", th: "เชียงใหม่" },
      districts: [
        { en: "Mueang Chiang Mai", th: "เมืองเชียงใหม่" },
        { en: "Mae Rim", th: "แม่ริม" },
        { en: "Hang Dong", th: "หางดง" },
        { en: "San Sai", th: "สันทราย" },
        { en: "San Kamphaeng", th: "สันกำแพง" },
        { en: "Doi Saket", th: "ดอยสะเก็ด" },
        // เพิ่มอำเภออื่นๆที่เชียงใหม่
      ],
    },
    {
      name: { en: "Phuket", th: "ภูเก็ต" },
      districts: [
        { en: "Mueang Phuket", th: "เมืองภูเก็ต" },
        { en: "Kathu", th: "กะทู้" },
        { en: "Thalang", th: "ถลาง" },
        // เพิ่มอำเภออื่นๆที่ภูเก็ต
      ],
    },
    {
      name: { en: "Khon Kaen", th: "ขอนแก่น" },
      districts: [
        { en: "Mueang Khon Kaen", th: "เมืองขอนแก่น" },
        { en: "Ban Phai", th: "บ้านไผ่" },
        { en: "Chonnabot", th: "ชนบท" },
        { en: "Phon", th: "พล" },
        // เพิ่มอำเภออื่นๆที่ขอนแก่น
      ],
    },
    {
      name: { en: "Nakhon Ratchasima", th: "นครราชสีมา" },
      districts: [
        { en: "Mueang Nakhon Ratchasima", th: "เมืองนครราชสีมา" },
        { en: "Pak Chong", th: "ปากช่อง" },
        { en: "Chok Chai", th: "โชคชัย" },
        { en: "Bua Yai", th: "บัวใหญ่" },
        { en: "Phimai", th: "พิมาย" },
        { en: "Non Sung", th: "โนนสูง" },
        // เพิ่มอำเภออื่นๆที่นครราชสีมา
      ],
    },
    {
      name: { en: "Chiang Rai", th: "เชียงราย" },
      districts: [
        { en: "Mueang Chiang Rai", th: "เมืองเชียงราย" },
        { en: "Mae Sai", th: "แม่สาย" },
        { en: "Chiang Saen", th: "เชียงแสน" },
        { en: "Phan", th: "พาน" },
        { en: "Wiang Pa Pao", th: "เวียงป่าเป้า" },
        // เพิ่มอำเภออื่นๆที่เชียงราย
      ],
    },
    {
      name: { en: "Udon Thani", th: "อุดรธานี" },
      districts: [
        { en: "Mueang Udon Thani", th: "เมืองอุดรธานี" },
        { en: "Kumphawapi", th: "กุมภวาปี" },
        { en: "Nong Han", th: "หนองหาน" },
        { en: "Ban Dung", th: "บ้านดุง" },
        { en: "Nam Som", th: "น้ำโสม" },
        // พิ่มอำเภออื่นๆที่อุดรธานี
      ],
    },
    {
      name: { en: "Nonthaburi", th: "นนทบุรี" },
      districts: [
        { en: "Mueang Nonthaburi", th: "เมืองนนทบุรี" },
        { en: "Bang Bua Thong", th: "บางบัวทอง" },
        { en: "Bang Yai", th: "บางใหญ่" },
        { en: "Bang Kruai", th: "บางกรวย" },
        { en: "Pak Kret", th: "ปากเกร็ด" },
        { en: "Sai Noi", th: "ไทรน้อย" },
        // เพิ่มอำเภออื่นๆที่นนทบุรี
      ],
    },
    // เพิ่มจังหวัดและอำเภออื่นๆที่เหลือ
  ];

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const validateForm = () => {
    let newErrors = {};

    if (!input.title.trim())
      newErrors.title = t("VALIDATION.JOB_POSITION_REQUIRED");
    else if (input.title.length < 3)
      newErrors.title = t("VALIDATION.JOB_POSITION_MIN_LENGTH");

    if (!input.description.trim())
      newErrors.description = t("VALIDATION.DESCRIPTION_REQUIRED");
    else if (input.description.length < 20)
      newErrors.description = t("VALIDATION.DESCRIPTION_MIN_LENGTH");
    else if (input.description.length > 400)
      newErrors.description = t("VALIDATION.DESCRIPTION_MAX_LENGTH");

    if (!input.location.trim())
      newErrors.location = t("VALIDATION.LOCATION_REQUIRED");

    if (!input.salary.trim()) 
      newErrors.salary = t("VALIDATION.SALARY_REQUIRED");
    else if (isNaN(parseInt(input.salary)))
      newErrors.salary = t("VALIDATION.SALARY_MUST_BE_NUMBER");
    else if (input.salary.length > 10)
      newErrors.salary = t("VALIDATION.SALARY_MAX_LENGTH");

    if (!input.jobType) 
      newErrors.jobType = t("VALIDATION.JOB_TYPE_REQUIRED");

    if (!String(input.experience).trim())
      newErrors.experience = t("VALIDATION.EXPERIENCE_REQUIRED");
    else if (isNaN(parseInt(input.experience)))
      newErrors.experience = t("VALIDATION.EXPERIENCE_MUST_BE_NUMBER");

    if (!String(input.position).trim())
      newErrors.position = t("VALIDATION.POSITION_REQUIRED");
    else if (isNaN(parseInt(input.position)))
      newErrors.position = t("VALIDATION.POSITION_MUST_BE_NUMBER");

    if (!input.companyId) 
      newErrors.companyId = t("VALIDATION.COMPANY_REQUIRED");

    if (selectedProvince && !selectedDistrict) {
      newErrors.district = t("VALIDATION.DISTRICT_REQUIRED");
    }

    if (!input.location.trim() || (selectedProvince && !selectedDistrict)) {
      newErrors.location = t("VALIDATION.LOCATION_REQUIRED");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    if (name === "description") {
      if (value.length <= 400) {
        setInput({ ...input, [name]: value });
        setCharCount(value.length);
      }
    } else if (name === "experience" || name === "position") {
      // Allow any integer value for experience and position
      const numValue = parseInt(value, 10);
      setInput((prev) => ({
        ...prev,
        [name]: isNaN(numValue) ? "" : numValue,
      }));
    } else {
      setInput({ ...input, [name]: value });
    }
    // Clear the error for this field when the user starts typing
    setErrors({ ...errors, [name]: "" });
  };

  const changeSelectHandler = (value) => {
    setInput({ ...input, jobType: value });
    setErrors({ ...errors, jobType: "" });
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value
    );
    setInput({
      ...input,
      companyId: selectedCompany ? Number(selectedCompany.company_id) : "",
    });
    setErrors({ ...errors, companyId: "" });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const res = await axios.post(`${JOB_ALL_API}/post`, input, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        if (res.data.success) {
          toast.success(t(res.data.message));
          navigate("/admin/jobs");
        }
      } catch (error) {
        toast.error(t(error.response?.data?.message || "UNEXPECTED_ERROR"));
      } finally {
        setLoading(false);
      }
    } else {
      toast.error(t("FILL_INFORMATION_COMPLETELY"));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
        <form onSubmit={submitHandler}>
          <div className="flex items-center gap-5 mb-6">
            <Button
              onClick={() => navigate("/admin/jobs")}
              variant="outline"
              className="flex items-center gap-2 text-gray-600 hover:bg-purple-50 transition-colors duration-300"
              disabled={loading}
            >
              <ArrowLeftIcon size={18} />
              <span>{t("back")}</span>
            </Button>
            <div className="flex-grow">
              <h1 className="text-3xl font-bold text-[#7e22ce] ml-4">
                {t("jobSetup")}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t("jobPosition")}
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder={t("enterJobPosition")}
                  name="title"
                  value={input.title}
                  onChange={changeEventHandler}
                  className={`px-4 py-2 w-full border ${
                    errors.title ? "border-red-500" : "border-gray-400"
                  } rounded-md focus:ring-2 focus:ring-[#7e22ce] focus:border-transparent`}
                  disabled={loading}
                />
              </div>
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t("description")}
              </Label>
              <div className="relative">
                <textarea
                  placeholder={t("enterJobDescription")}
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  maxLength={400}
                  className={`w-full h-24 px-4 py-2 border ${
                    errors.description ? "border-red-500" : "border-gray-400"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#7e22ce] focus:border-[#7e22ce] resize-none`}
                  disabled={loading}
                />
                <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                  {charCount}/400
                </div>
              </div>
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t("location")}
              </Label>
              <div className="relative">
                <select
                  name="province"
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setSelectedDistrict("");
                    setErrors({ ...errors, location: "" });
                  }}
                  className={`px-4 py-2 w-full border ${
                    errors.location ? "border-red-500" : "border-gray-400"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#7e22ce] focus:border-[#7e22ce] resize-none`}
                  disabled={loading}
                >
                  <option value="">{t("selectProvince")}</option>
                  {provinces.map((province) => (
                    <option
                      key={province.name.en}
                      value={province.name[i18n.language]}
                    >
                      {province.name[i18n.language]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative mt-2">
                <select
                  name="district"
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setInput((prev) => ({
                      ...prev,
                      location: `${selectedProvince} - ${e.target.value}`,
                    }));
                    setErrors((prev) => ({
                      ...prev,
                      district: "",
                      location: ""
                    }));
                  }}
                  className={`px-4 py-2 w-full border ${
                    errors.district ? "border-red-500" : "border-gray-400"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#7e22ce] focus:border-[#7e22ce] resize-none`}
                  disabled={loading || !selectedProvince}
                >
                  <option value="">{t("selectDistrict")}</option>
                  {provinces
                    .find(
                      (province) =>
                        province.name[i18n.language] === selectedProvince
                    )
                    ?.districts.map((district) => (
                      <option key={district.en} value={district[i18n.language]}>
                        {district[i18n.language]}
                      </option>
                    ))}
                </select>
                {errors.district && (
                  <p className="text-red-500 text-xs mt-1">{errors.district}</p>
                )}
              </div>
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">
                  {t(errors.location)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t("salary")}
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder={t("enterSalary")}
                  name="salary"
                  value={input.salary}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                    setInput({ ...input, salary: value });
                    setErrors({ ...errors, salary: "" });
                  }}
                  className={`px-4 py-2 w-full border ${
                    errors.salary ? "border-red-500" : "border-gray-400"
                  } rounded-md focus:ring-2 focus:ring-[#7e22ce] focus:border-transparent`}
                  disabled={loading}
                />
              </div>
              {errors.salary && (
                <p className="text-red-500 text-xs mt-1">{errors.salary}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t("numberOfPositions")}
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder={t("enterNumberOfPositions")}
                  name="position"
                  value={input.position >= 0 ? input.position : 0}
                  onChange={changeEventHandler}
                  className={`px-4 py-2 w-full border ${
                    errors.position ? "border-red-500" : "border-gray-400"
                  } rounded-md focus:ring-2 focus:ring-[#7e22ce] focus:border-transparent`}
                  disabled={loading}
                />
              </div>
              {errors.position && (
                <p className="text-red-500 text-xs mt-1">{errors.position}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t("experienceLevel")}
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder={t("enterExperienceLevel")}
                  name="experience"
                  value={input.experience >= 0 ? input.experience : 0}
                  onChange={changeEventHandler}
                  className={`px-4 py-2 w-full border ${
                    errors.experience ? "border-red-500" : "border-gray-400"
                  } rounded-md focus:ring-2 focus:ring-[#7e22ce] focus:border-transparent`}
                  disabled={loading}
                />
              </div>
              {errors.experience && (
                <p className="text-red-500 text-xs mt-1">{errors.experience}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t("jobType")}
              </Label>
              <div className="relative">
                <Select onValueChange={changeSelectHandler}>
                  <SelectTrigger 
                    className={`px-4 py-2 w-full border ${
                      errors.jobType ? "border-red-500" : "border-gray-400"
                    } rounded-md focus:ring-2 focus:ring-[#7e22ce] focus:border-transparent`}
                  >
                    <SelectValue placeholder={t("selectJobType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {jobTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {t(option.label)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {errors.jobType && (
                <p className="text-red-500 text-xs mt-1">{errors.jobType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t("company")}
              </Label>
              <div className="relative">
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger 
                    className={`px-4 py-2 w-full border ${
                      errors.companyId ? "border-red-500" : "border-gray-400"
                    } rounded-md focus:ring-2 focus:ring-[#7e22ce] focus:border-transparent`}
                  >
                    <SelectValue placeholder={t("selectCompany")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map((company) => (
                        <SelectItem
                          key={company.company_id}
                          value={company?.name?.toLowerCase()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {errors.companyId && (
                <p className="text-red-500 text-xs mt-1">{errors.companyId}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              className="px-6 py-2 bg-[#7e22ce] text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-[#7e22ce] focus:ring-offset-2 transition-colors duration-300"
              disabled={loading || (selectedProvince && !selectedDistrict)}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t("posting")}
                </div>
              ) : (
                t("postJob")
              )}
            </Button>
          </div>
          {companies.length === 0 && (
            <p className="text-xs text-red-600 font-bold text-center my-3">
              {t("pleaseRegisterCompany")}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJobs;
