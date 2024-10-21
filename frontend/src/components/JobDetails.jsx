import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { setSingleJob } from "@/redux/jobSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  JOB_ALL_API,
  COMPANY_ALL_API,
  Application_API,
} from "./utils/constant";
import { setSingleCompany } from "@/redux/companySlice";
import { toast } from "sonner";
import Navbar from "./shared/Navbar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { CircleUserRound, Mail, MapPinned, Phone, ArrowLeft } from "lucide-react";
import { useTranslation } from 'react-i18next';

const JobDetails = () => {
  const { t, i18n } = useTranslation(); // Get the i18n instance
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const params = useParams();
  const jobId = params.id;
  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const companyId = queryParams.get("companyId");

  const [isApplied, setIsApplied] = useState(false); // สถานะการสมัคร

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(`${Application_API}/apply/${jobId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        // อัพเดทสถานะการสมัคร
        setIsApplied(true);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while applying for the job.";
      toast.error(errorMessage);
    }
  };

  const { singleCompany } = useSelector((store) => store.company);

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_ALL_API}/getjob/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));

          // ใช้ค่า `userHasApplied` จาก API เพื่อตั้งสถานะของการสมัคร
          setIsApplied(res.data.job.userHasApplied);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to fetch job details.";
        toast.error(errorMessage);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, singleJob, user?.user_id]);

  useEffect(() => {
    const fetchSingleCompany = async () => {
      if (!companyId) {
        console.log("Company ID is not available");
        return;
      }
      try {
        const res = await axios.get(`${COMPANY_ALL_API}/get/${companyId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleCompany(res.data.company));
        } else {
          console.log("Failed to fetch company:", res.data.message);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Error fetching company details.";
        toast.error(errorMessage);
      }
    };
    fetchSingleCompany();
  }, [companyId, dispatch]);

  const formatDate = (dateString, language) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = date.getDate();
    
    // Define month names for both English and Thai
    const monthNames = {
      en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      th: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."]
    };

    // Select the appropriate month name based on the provided language
    const month = monthNames[language][date.getMonth()];

    // Adjust the year based on the language
    const year = language === 'th' ? date.getFullYear() + 543 : date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const formatJobDescription = (description) => {
    if (!description) return [];
    return description.split('-').filter(item => item.trim() !== '').map(item => item.trim());
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="flex items-center mb-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-[#723bcf] bg-transparent  transition-colors duration-200 my-2"
          >
            <ArrowLeft size={20} className="mr-2" />
            {t('back')}
          </button>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Section - Job Information */}
          <div className="w-full lg:w-2/3 bg-[#ffffff] border border-gray-300 p-4 md:p-6 rounded-lg shadow-md mt-6 lg:mt-0">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#723bcf] mb-2">{singleJob?.title}</h1>
              
              <p className="text-gray-600 font-medium">{singleJob?.location}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge
                  className="bg-[#ffffff] text-black font-bold"
                  variant="outline"
                >
                  {singleJob?.position} {t('positions')}
                </Badge>
                <Badge
                  className="bg-[#FFEEEB] text-[#ff914d] font-bold"
                  variant="secondary"
                >
                  {singleJob?.jobType}
                </Badge>
                <Badge
                  className="bg-[#E6F4EA] text-[#00bf63] font-bold"
                  variant="outline"
                >
                  {singleJob?.salary} {t('currency')}
                </Badge>
              </div>
            </div>

            <hr className="mt-6 md:mt-10 border-t-2 border-gray-300" />

            <div className="my-4">
              <h1 className="font-semibold text-lg">{t('jobInformation')}</h1>
              <div className="text-gray-800 my-4">
                {formatJobDescription(singleJob?.description).map((item, index) => (
                  <p key={index} className="mb-2">- {item}</p>
                ))}
              </div>

              <div className="space-y-3 md:space-y-5">
                <h1 className="font-bold">
                  {t('experience')}:{" "}
                  <span className="pl-2 md:pl-4 font-normal text-gray-800">
                    {singleJob?.experienceLevel >= 0 ? singleJob.experienceLevel : 0} {t('year')}
                  </span>
                </h1>
                <h1 className="font-bold">
                  {t('salary')}:{" "}
                  <span className="pl-2 md:pl-4 font-normal text-gray-800">
                    {singleJob?.salary} {t('currency')}
                  </span>
                </h1>

                <h1 className="font-bold">
                  {t('postedDate')}:{" "}
                  <span className="pl-2 md:pl-4 font-normal text-gray-800">
                    {formatDate(singleJob?.createdAt, i18n.language)}
                  </span>
                </h1>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                onClick={isApplied ? null : applyJobHandler}
                disabled={isApplied}
                className={`w-full md:w-auto rounded-lg px-6 py-2 font-bold text-white ${
                  isApplied
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-[#7209b7] hover:bg-[#5f32ad]"
                }`}
              >
                {isApplied ? t('alreadyApplied') : t('applyNow')}
              </Button>
            </div>
          </div>

          {/* Right Section - Company Information */}
          <div className="w-full lg:w-1/3 bg-[#ffffff] border border-gray-300 p-4 md:p-6 rounded-lg shadow-md mt-6 lg:mt-0">
            <div className="flex flex-col items-center mb-6">
              <img
                src={singleCompany?.logo}
                alt="Company Logo"
                className="w-16 h-16 md:w-20 md:h-20 mb-4"
              />
              <h1 className="font-bold text-xl md:text-2xl my-2 text-center">
                {singleCompany?.name}
              </h1>
            </div>
            <div className="space-y-3 md:space-y-5">
              <h1 className="font-bold flex items-center">
                <MapPinned size={20} className="mr-2 md:mr-4 flex-shrink-0" />
                <span className="font-normal text-gray-800">
                  {singleCompany?.location}
                </span>
              </h1>
              <h1 className="font-bold flex items-center">
                <CircleUserRound
                  size={20}
                  className="mr-2 md:mr-4 flex-shrink-0"
                />
                <span className="font-normal text-gray-800">
                  {singleCompany?.agent_fullname}
                </span>
              </h1>
              <h1 className="font-bold flex items-center">
                <Mail size={20} className="mr-2 md:mr-4 flex-shrink-0" />
                <span className="font-normal text-gray-800 break-all">
                  {singleCompany?.email}
                </span>
              </h1>
              <h1 className="font-bold flex items-center">
                <Phone size={20} className="mr-2 md:mr-4 flex-shrink-0" />
                <span className="font-normal text-gray-800">
                  {singleCompany?.phoneNumber}
                </span>
              </h1>
              <h1 className="font-bold ">
                {t('Description')} : <br className="my-10" />
                <span className="font-normal text-gray-800">
                  {singleCompany?.description}
                </span>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
