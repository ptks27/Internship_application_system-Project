import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import FilterCard from "./FilterCard";
import Job from "./Job";
import Navbar from "./shared/Navbar";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const Jobs = () => {
  const { t } = useTranslation();
  const { allJobs, searchQuery, salaryRange } = useSelector(
    (state) => state.job
  );
  const { user } = useSelector((store) => store.auth);
  const [filterJobs, setFilterJobs] = useState([]);
  const navigate = useNavigate(); // ใช้ navigate เพื่อเปลี่ยนเส้นทาง

  // ถ้ายังไม่ได้ login ให้เปลี่ยนเส้นทางไปหน้า login
  useEffect(() => {
    if (!user) {
      navigate("/login"); // เปลี่ยนเส้นทางไปหน้า login
    }
  }, [user, navigate]);

  useEffect(() => {
    let filteredJobs = allJobs;

    if (searchQuery) {
      const queries = searchQuery.toLowerCase().split(" ");
      filteredJobs = filteredJobs.filter((job) => {
        return queries.some(
          (query) =>
            job.title.toLowerCase().includes(query) ||
            job.description.toLowerCase().includes(query) ||
            job.location.toLowerCase().includes(query) ||
            job.jobType.toLowerCase().includes(query) ||
            job.salary.toString().toLowerCase().includes(query)
        );
      });
    }

    if (salaryRange && salaryRange.length > 0) {
      filteredJobs = filteredJobs.filter((job) => {
        const jobSalary = parseFloat(job.salary);
        return salaryRange.some(
          (range) =>
            range &&
            range.min !== null &&
            range.max !== null &&
            jobSalary >= range.min &&
            jobSalary <= range.max
        );
      });
    }

    setFilterJobs(filteredJobs);
  }, [allJobs, searchQuery, salaryRange]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f4]">
      <Navbar />

      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/4 mb-6 lg:mb-0">
            <FilterCard />
          </div>

          <div className="flex-1 overflow-y-auto pb-5">
            {filterJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filterJobs.map((job) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    key={job?.job_id}
                    className="h-auto flex flex-col"
                  >
                    <Job job={job} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col justify-center items-center h-[calc(100vh-200px)]"
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  <FaSearch className="text-6xl text-gray-400 mb-4" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-700 mb-2">
                  {t("noJobFound")}
                </h2>
                <p className="text-xl text-gray-500 text-center">
                  {t("tryAdjusting")}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
