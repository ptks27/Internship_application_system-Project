import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { MoreHorizontal, CheckCircle, XCircle } from "lucide-react"; // Import icons
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { Application_API } from "../utils/constant";
import { updateApplicantStatus } from "@/redux/applicantsSlice";
import { Badge } from "../ui/badge";

// Define status list with icons and colors
const statusList = [
  {
    status: "accepted",
    color: "text-green-500",
    icon: <CheckCircle className="mr-2" />,
  },
  {
    status: "rejected",
    color: "text-red-500",
    icon: <XCircle className="mr-2" />,
  },
];
const ITEMS_PER_PAGE = 10; // จำนวนผู้สมัครต่อหน้า

const ApplicantsTable = () => {
  const { applicants } = useSelector((state) => state.application);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const { t, i18n } = useTranslation();

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentApplicants = applicants?.slice(startIndex, endIndex);

  const totalPages = Math.ceil((applicants?.length || 0) / ITEMS_PER_PAGE);

  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${Application_API}/status/${id}/update`, // Ensure id is a number
        { status }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        // Dispatch the updateApplicantStatus action to update the state
        dispatch(updateApplicantStatus({ id, status }));
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

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
      en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      th: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."]
    };

    // Select the appropriate month name based on the provided language
    const month = monthNames[language][date.getMonth()];

    // Adjust the year based on the language
    const year = language === 'th' ? date.getFullYear() + 543 : date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <Table>
        <TableCaption>{t('recentAppliedUsers')}</TableCaption>
        <TableHeader>
          <TableRow className="bg-[#723bcf] hover:bg-[#5f31ad]">
            <TableHead className="bg-purple-700 text-white">{t('name')}</TableHead>
            <TableHead className="bg-purple-700 text-white hidden sm:table-cell">{t('email')}</TableHead>
            <TableHead className="bg-purple-700 text-white hidden md:table-cell">{t('phoneNumber')}</TableHead>
            <TableHead className="bg-purple-700 text-white hidden lg:table-cell">{t('resume')}</TableHead>
            <TableHead className="bg-purple-700 text-white hidden xl:table-cell">{t('date')}</TableHead>
            <TableHead className="bg-purple-700 text-white">{t('status')}</TableHead>
            <TableHead className="bg-purple-700 text-white text-right">{t('action')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentApplicants &&
            currentApplicants.map((item) => (
              <TableRow
                key={item.application_id}
                className="border-purple-500 border-2"
              >
                <TableCell className="font-bold">
                  {item?.applicant?.fullname || "N/A"}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {item?.applicant?.email || "N/A"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {item?.applicant?.phoneNumber || "N/A"}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {item.applicant?.profile?.resume ? (
                    <a
                      href={item?.applicant?.profile?.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#ff914d] font-bold cursor-pointer"
                    >
                      {item?.applicant?.profile?.resumeOriginalName || t('viewResume')}
                    </a>
                  ) : (
                    <span>N/A</span>
                  )}
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  {formatDate(item?.createdAt, i18n.language)}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(
                      item.status
                    )}`}
                  >
                    {t(item.status) || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="inline-block cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                        <MoreHorizontal className="h-5 w-5" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-32 p-2 bg-white shadow-lg rounded-md">
                      {statusList.map(({ status, color, icon }, index) => (
                        <div
                          onClick={() =>
                            statusHandler(status, item.application_id)
                          }
                          key={index}
                          className="flex w-full items-center my-2 cursor-pointer p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
                        >
                          {icon}
                          <span className={`text-sm font-medium ${color}`}>
                            {t(status)}
                          </span>
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4 px-4 py-2 bg-gray-100 rounded-b-lg">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-purple-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {t('previous')}
        </button>
        <span className="text-sm">
          {t('page')} {currentPage} {t('of')} {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-purple-600 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {t('next')}
        </button>
      </div>
    </div>
  );
};

export default ApplicantsTable;
