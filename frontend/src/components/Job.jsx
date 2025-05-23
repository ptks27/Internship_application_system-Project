import { Bookmark } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";
import { JOB_ALL_API } from "./utils/constant";
import { useDispatch } from "react-redux";
import { setAllJobs } from "@/redux/jobSlice";
import { useTranslation } from "react-i18next";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isBookmarked, setIsBookmarked] = useState(job.isBookmarked);
  const { t } = useTranslation();

  const toggleBookmark = async () => {
    try {
      const response = await axios.post(
        `${JOB_ALL_API}/toggle-bookmark/${job.job_id}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        setIsBookmarked(response.data.isBookmarked);
        // Fetch updated jobs list
        const updatedJobs = await axios.get(`${JOB_ALL_API}/getall`, {
          withCredentials: true,
        });
        if (updatedJobs.data.success) {
          dispatch(setAllJobs(updatedJobs.data.jobs));
        }
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const dayAgeFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  };

  const getDayAgeDisplay = (daysAgo) => {
    if (daysAgo === 0) return t("today");
    if (daysAgo >= 30) {
      return <span className="text-red-600 font-bold">{t("expired")}</span>;
    }
    if (daysAgo >= 25) {
      return (
        <span className="text-red-600 font-medium">
          {daysAgo} {t("daysAgo")} - {t("expiringsSoon")}
        </span>
      );
    }
    return `${daysAgo} ${t("daysAgo")}`;
  };

  const daysAgo = dayAgeFunction(job?.createdAt);
  const dayAgeDisplay = getDayAgeDisplay(daysAgo);
  const isExpired = daysAgo >= 30;

  const formatJobDescription = (description) => {
    if (!description) return [];
    return description
      .split("-")
      .filter((item) => item.trim() !== "")
      .map((item) => item.trim());
  };

  const truncateDescription = (description, maxLength) => {
    if (!description) return "";
    return description.length > maxLength
      ? description.substring(0, maxLength) + "..."
      : description;
  };

  const handleDetailsClick = () => {
    if (!isExpired) {
      navigate(`/details/${job?.job_id}?companyId=${job?.company?.company_id}`);
    }
  };

  return (
    <div
      className={`p-4 rounded-lg shadow-2xl bg-[#ffffff] border border-gray-300 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300 ${
        isExpired ? "opacity-75" : ""
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-500">{dayAgeDisplay}</p>
          <Button
            variant="outline"
            className={`rounded-full ${
              isBookmarked
                ? "bg-[#723bcf] hover:bg-purple-700 hover:text-white text-white"
                : ""
            }`}
            size="icon"
            onClick={toggleBookmark}
          >
            <Bookmark size={16} />
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={job?.company?.logo} />
          </Avatar>
          <div>
            <h2 className="font-medium text-base">
              {job.company ? job.company.name : "Unknown Company"}
            </h2>
            <p className="text-sm text-gray-600">
              {job.location ? job.location : "Location not specified"}
            </p>
          </div>
        </div>

        <h1 className="font-bold text-lg mb-2 text-[#723bcf]">{job?.title}</h1>
        <div className="text-sm text-gray-500 mb-3">
          {formatJobDescription(truncateDescription(job?.description, 120)).map(
            (item, index) => (
              <p key={index} className="mb-1">
                - {item}
              </p>
            )
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className="text-black font-bold text-xs" variant="outline">
            {job?.position} {t("positions")}
          </Badge>
          <Badge className="text-[#ff914d] font-bold text-xs" variant="outline">
            {job?.jobType}
          </Badge>
          <Badge className="text-[#00bf63] font-bold text-xs" variant="outline">
            {job?.salary} {t("currency")}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 my-4 ">
        <Button
          onClick={handleDetailsClick}
          variant="outline"
          disabled={isExpired}
          className={`w-full min-w-[140px] sm:w-1/3 ${
            isExpired
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-[#ffffff] text-black hover:bg-slate-100"
          } border border-black font-bold rounded-2xl`}
        >
          {isExpired ? t("unavailable") : t("details")}
        </Button>
        <Button
          className="w-full sm:w-1/2 bg-[#723bcf] hover:bg-[#5f31ad] text-white font-bold rounded-2xl"
          onClick={toggleBookmark}
        >
          {t("saveForLater")}
        </Button>
      </div>
    </div>
  );
};

Job.propTypes = {
  job: PropTypes.shape({
    company: PropTypes.shape({
      name: PropTypes.string,
      company_id: PropTypes.number,
      logo: PropTypes.string,
    }),
    job_id: PropTypes.number.isRequired,
    location: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    position: PropTypes.number,
    jobType: PropTypes.string,
    salary: PropTypes.number,
    createdAt: PropTypes.string,
    isBookmarked: PropTypes.bool,
  }).isRequired,
};

export default Job;
