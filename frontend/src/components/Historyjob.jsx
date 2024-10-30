import { useState } from "react";
import { useSelector } from "react-redux";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

const Historyjob = () => {
  const { allAppliedJobs } = useSelector((state) => state.job);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const { t, i18n } = useTranslation();

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-gray-500 text-white hover:bg-gray-600";
      case "accepted":
        return "bg-green-500 text-white hover:bg-green-600";
      case "rejected":
        return "bg-red-500 text-white hover:bg-red-600";
      default:
        return "bg-gray-500 text-white hover:bg-gray-600";
    }
  };

  const formatDate = (dateString, language) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = date.getDate();

    // Define month names for both English and Thai
    const monthNames = {
      en: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      th: [
        "ม.ค.",
        "ก.พ.",
        "มี.ค.",
        "เม.ย.",
        "พ.ค.",
        "มิ.ย.",
        "ก.ค.",
        "ส.ค.",
        "ก.ย.",
        "ต.ค.",
        "พ.ย.",
        "ธ.ค.",
      ],
    };

    // Select the appropriate month name based on the provided language
    const month = monthNames[language][date.getMonth()];

    // Adjust the year based on the language
    const year =
      language === "th" ? date.getFullYear() + 543 : date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allAppliedJobs.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(allAppliedJobs.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <Table className="w-full">
        <TableCaption className="text-lg font-semibold mb-4">
          {t("appliedJobs")}
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-[#723bcf] hover:bg-[#5f31ad]">
            <TableHead className="text-white font-bold px-4 py-3 text-left">
              {t("logo")}
            </TableHead>
            <TableHead className="text-white font-bold px-9 py-4 text-left">
              {t("company")}
            </TableHead>
            <TableHead className="text-white font-bold px-4 py-3 text-left">
              {t("jobPosition")}
            </TableHead>
            <TableHead className="text-white font-bold px-4 py-3 text-left">
              {t("date")}
            </TableHead>
            <TableHead className="text-white font-bold px-4 py-3 text-left">
              {t("status")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.length <= 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                {t("youHaveNotAppliedForAnyJobs")}
              </TableCell>
            </TableRow>
          ) : (
            currentItems.map((appliedJob, index) => (
              <TableRow
                key={`${appliedJob.job_id}-${index}`}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell className="px-4 py-3">
                  <div className="flex items-center h-full">
                    {appliedJob.create_ByJobId?.company?.logo ? (
                      <img
                        src={appliedJob.create_ByJobId.company.logo}
                        alt={`${appliedJob.create_ByJobId?.company?.name} logo`}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">{t("noLogo")}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-9 py-3">
                  <div className="flex items-center h-full">
                    {appliedJob.create_ByJobId?.company?.name || "N/A"}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3">
                  {appliedJob.create_ByJobId?.title || "N/A"}
                </TableCell>
                <TableCell className="px-4 py-3">
                  {formatDate(appliedJob?.createdAt, i18n.language)}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <div className="flex justify-center">
                    <Badge
                      className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(
                        appliedJob.status
                      )}`}
                    >
                      {t(appliedJob.status)}
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          className="px-4 py-2 text-gray-600 bg-gray-200 rounded"
        >
          {t("previous")}
        </Button>
        <span className="text-gray-600">
          {t("page")} {currentPage} {t("of")} {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          className="px-4 py-2 text-gray-600 bg-gray-200 rounded"
        >
          {t("next")}
        </Button>
      </div>
    </div>
  );
};

export default Historyjob;
