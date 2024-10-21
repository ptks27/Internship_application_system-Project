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
import { useTranslation } from 'react-i18next';

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

  const formatJobDescription = (description) => {
    if (!description) return [];
    return description.split('-').filter(item => item.trim() !== '').map(item => item.trim());
  };

  const truncateDescription = (description, maxLength) => {
    if (!description) return "";
    return description.length > maxLength
      ? description.substring(0, maxLength) + "..."
      : description;
  };

  return (
    <div
      className="p-4 rounded-lg shadow-2xl bg-[#ffffff] border border-gray-300 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300 "
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-500">
            {dayAgeFunction(job?.createdAt) === 0
              ? t('today')
              : `${dayAgeFunction(job?.createdAt)} ${t('daysAgo')}`}
          </p>
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
          {formatJobDescription(truncateDescription(job?.description, 120)).map((item, index) => (
            <p key={index} className="mb-1">- {item}</p>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className="text-black font-bold text-xs" variant="outline">
            {job?.position} {t('positions')}
          </Badge>
          <Badge className="text-[#ff914d] font-bold text-xs" variant="outline">
            {job?.jobType}
          </Badge>
          <Badge className="text-[#00bf63] font-bold text-xs" variant="outline">
            {job?.salary} {t('currency')}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 my-4">
        <Button
          onClick={() =>
            navigate(
              `/details/${job?.job_id}?companyId=${job?.company?.company_id}`
            )
          }
          variant="outline"
          className="w-full  sm:w-1/3 bg-[#ffffff] text-black border border-black hover:bg-slate-100 font-bold  rounded-2xl"
        >
          {t('details')}
        </Button>
        <Button
          className="w-full sm:w-1/2 bg-[#723bcf] hover:bg-[#5f31ad] text-white font-bold rounded-2xl"
          onClick={toggleBookmark}
        >
          {t('saveForLater')}
        </Button>
      </div>
    </div>
  );
};

Job.propTypes = {
  job: PropTypes.shape({
    company: PropTypes.shape({
      name: PropTypes.string,
      company_id: PropTypes.number, // Add this line
      logo: PropTypes.string,
    }),
    job_id: PropTypes.number.isRequired, // Make sure job_id is also required
    location: PropTypes.string,
    title: PropTypes.string.isRequired, // Assuming title is required
    description: PropTypes.string,
    position: PropTypes.number,
    jobType: PropTypes.string,
    salary: PropTypes.number,
    createdAt: PropTypes.string,
    isBookmarked: PropTypes.bool, // Add this line
  }).isRequired,
};

export default Job;
