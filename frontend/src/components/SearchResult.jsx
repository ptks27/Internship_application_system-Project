import {  useSelector } from "react-redux";
import Job from "./Job";
import Navbar from "./shared/Navbar";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Import motion from framer-motion
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { FaSearch } from "react-icons/fa";
import styled, { keyframes } from "styled-components";
// เพิ่มการ import useTranslation
import { useTranslation } from 'react-i18next';
// Import the desired icon from lucide-react
import { ArrowLeft } from "lucide-react";

// Define animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const bounceIn = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-30px); }
  60% { transform: translateY(-15px); }
`;

// Styled components with animations
const AnimatedContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-out;
`;

const BouncingIcon = styled(FaSearch)`
  animation: ${bounceIn} 2s ease infinite;
`;

const SearchResult = () => {
  const { error } = useGetAllJobs();
  const { allJobs, isLoading, searchQuery } = useSelector((state) => state.job);

  const [showNoJobsMessage, setShowNoJobsMessage] = useState(false);
  // เพิ่มการใช้งาน useTranslation
  const { t } = useTranslation();

  useEffect(() => {
    setShowNoJobsMessage(!isLoading && !error && allJobs.length === 0);
  }, [isLoading, error, allJobs.length]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <AnimatedContainer className="max-w-7xl mx-auto my-5 px-4 sm:my-8 sm:px-6 lg:my-10">
        {/* Back Button */}
        <div className="flex items-center mb-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-[#723bcf] bg-transparent transition-colors duration-200 my-2"
          >
            <ArrowLeft size={20} className="mr-2" />
            {t('back')}
          </button>
        </div>
        
        <h1 className="font-bold text-lg sm:text-xl md:text-2xl my-3 sm:my-4 md:my-5">
          {searchQuery ? t('searchResults', { query: searchQuery }) : t('allWork')} (
          {allJobs.length})
        </h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center items-center h-64"
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
            <p className="text-center text-gray-500 text-xl">
              {t('noJobFound')}
            </p>
          </motion.div>
        ) : showNoJobsMessage ? (
          <div className="flex flex-col items-center justify-center h-64">
            <BouncingIcon className="text-6xl text-gray-400 mb-4" />
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center text-2xl text-gray-600"
            >
              {t('noJobFound')}
            </motion.p>
            <p className="text-center text-gray-500 mt-2">
              {t('tryAdjusting')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3 sm:mt-4 md:mt-5">
            {allJobs.map((job) => (
              <Job key={job.job_id} job={job} />
            ))}
          </div>
        )}
      </AnimatedContainer>
    </div>
  );
};

export default SearchResult;
