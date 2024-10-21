import { useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Function to truncate the description
  const truncateDescription = (description, maxLength) => {
    if (!description) return "";
    return description.length > maxLength
      ? description.substring(0, maxLength) + "..."
      : description;
  };

  // Function to format the job description
  const formatJobDescription = (description) => {
    if (!description) return [];
    return description.split('-').filter(item => item.trim() !== '').map(item => item.trim());
  };

  return (
    <div
      onClick={() =>
        navigate(`/details/${job.job_id}?companyId=${job.company?.company_id}`)
      }
      className="min-h-auto rounded-md shadow-xl bg-white border border-gray-200 cursor-pointer hover:shadow-2xl transition-shadow duration-300 p-4"
    >
      <div>
        <h1 className="font-medium text-base sm:text-lg">
          {job.company ? job.company.name : "Unknown Company"}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          {job.location ? job.location : "Location not specified"}
        </p>
      </div>
      <div className="my-2">
        <h1 className="font-bold text-xl sm:text-2xl text-[#723bcf]">
          {job?.title || "Untitled Job"}
        </h1>
        <div className="text-xs sm:text-sm text-gray-600 mt-1">
          {formatJobDescription(truncateDescription(job?.description, 150)).map((item, index) => (
            <p key={index} className="mb-1">- {item}</p>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <Badge
          className="text-black font-bold text-xs sm:text-sm"
          variant="outline"
        >
          {job.position
            ? `${job.position} ${t('positions')}`
            : "Position not specified"}
        </Badge>
        <Badge
          className="text-[#ff914d] font-bold text-xs sm:text-sm"
          variant="secondary"
        >
          {job.jobType || "Job type not specified"}
        </Badge>
        <Badge
          className="text-[#00bf63] font-bold text-xs sm:text-sm"
          variant="outline"
        >
          {job.salary ? `${job.salary} ${t('currency')}` : "Salary not specified"}
        </Badge>
      </div>
    </div>
  );
};

// กำหนด prop types
LatestJobCards.propTypes = {
  job: PropTypes.shape({
    job_id: PropTypes.number.isRequired, // เปลี่ยนจาก string เป็น number
    company: PropTypes.shape({
      name: PropTypes.string,
      company_id: PropTypes.number, // เพิ่ม company_id ใน PropTypes
    }),
    location: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    position: PropTypes.number,
    jobType: PropTypes.string,
    salary: PropTypes.number,
  }).isRequired, // ทำให้แน่ใจว่า job เป็น props ที่จำเป็น
};

export default LatestJobCards;
