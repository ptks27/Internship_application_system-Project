import { Avatar, AvatarImage } from "../ui/avatar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { JOB_ALL_API } from "../utils/constant";
import { setAllJobs } from "@/redux/jobSlice";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const JobsAgentTable = () => {
  const { allJobsAgent, searchJobByText } = useSelector((state) => state.job);
  const [filterJobs, setFilterJobs] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!allJobsAgent) {
      setFilterJobs([]);
      return;
    }

    const filteredJobs = allJobsAgent.filter((job) => {
      if (!searchJobByText) {
        return true;
      }
      const searchText = searchJobByText.toLowerCase();
      return (
        job?.title?.toLowerCase().includes(searchText) ||
        job?.company?.name?.toLowerCase().includes(searchText)
      );
    });
    setFilterJobs(filteredJobs);
  }, [allJobsAgent, searchJobByText]);

  const deleteJob = async (jobId) => {
    const result = await Swal.fire({
      title: t("areYouSure"),
      text: t("wantToDeleteJob"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#723bcf",
      cancelButtonColor: "#d33",
      confirmButtonText: t("yesDelete"),
      cancelButtonText: t("cancel"),
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(`${JOB_ALL_API}/deletejob/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          toast.success(t(res.data.message));

          const updatedJobs = allJobsAgent.filter(
            (job) => job.job_id !== jobId
          );
          const updatedFilterJobs = filterJobs.filter(
            (job) => job.job_id !== jobId
          );

          dispatch(setAllJobs(updatedJobs));
          setFilterJobs(updatedFilterJobs);
        }
      } catch (error) {
        console.log(error);
        toast.error(
          t(error.response?.data?.message) || t("somethingWentWrong")
        );
      }
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

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <Table>
        <TableCaption>{t("recentlyPostedJobs")}</TableCaption>
        <TableHeader>
          <TableRow className="bg-[#723bcf] hover:bg-[#5f31ad]">
            <TableHead className="bg-purple-700 text-white">
              {t("logo")}
            </TableHead>
            <TableHead className="bg-purple-700 text-white">
              {t("companyName")}
            </TableHead>
            <TableHead className="bg-purple-700 text-white">
              {t("position1")}
            </TableHead>
            <TableHead className="bg-purple-700 text-white hidden sm:table-cell">
              {t("date")}
            </TableHead>
            <TableHead className="bg-purple-700 text-white text-right">
              {t("action")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                {t("noJobsPostedYet")}
              </TableCell>
            </TableRow>
          ) : (
            filterJobs?.map((job) => (
              <TableRow key={job.job_id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage
                      src={job.company?.logo || "/default-logo.png"}
                      alt={job.company?.name}
                    />
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">
                  {job.company?.name}
                </TableCell>
                <TableCell>{job.title}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {formatDate(job.createdAt, i18n.language)}
                </TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-0">
                      <div
                        onClick={() => navigate(`/admin/jobs/${job.job_id}`)}
                        className="flex w-full items-center px-3 py-2 text-sm hover:bg-gray-100 text-gray-700 cursor-pointer"
                      >
                        <Edit2 className="mr-2 h-4 w-4 text-blue-500" />
                        {t("edit")}
                      </div>
                      <div
                        onClick={() => deleteJob(job.job_id)}
                        className="flex w-full items-center px-3 py-2 text-sm hover:bg-gray-100 text-red-600 cursor-pointer"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("delete")}
                      </div>
                      <div
                        onClick={() =>
                          navigate(`/admin/jobs/${job.job_id}/applicants`)
                        }
                        className="flex w-full items-center px-3 py-2 text-sm hover:bg-gray-100 text-green-500 cursor-pointer"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        {t("applicants")}
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default JobsAgentTable;
