import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSearchQuery, setAllJobs } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import { JOB_ALL_API } from "../components/utils/constant";
import { FaSpinner } from "react-icons/fa"; // Import spinner icon

const MainSection = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    // Reset search query and fetch all jobs when MainSection mounts
    dispatch(setSearchQuery(""));
    const fetchAllJobs = async () => {
      try {
        const res = await axios.get(`${JOB_ALL_API}/getall`, { withCredentials: true });
        if (res.data.success && Array.isArray(res.data.jobs)) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.error("Error fetching all jobs:", error);
      }
    };
    fetchAllJobs();
  }, [dispatch]);

  const searchJobHandler = () => {
    setLoading(true); // Set loading to true
    dispatch(setSearchQuery(query));
    dispatch(setAllJobs([])); // Reset jobs before new search
    setTimeout(() => {
      setLoading(false); // Set loading to false after delay
      navigate("/search");
    }, 700); // 1.5 seconds delay
  };

  return (
    <div className="text-center px-4 sm:px-6 lg:px-8 bg-[#f4f4f4]">
      <div className="flex flex-col gap-5 my-10 sm:my-16 md:my-20 py-6 sm:py-8 md:py-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold px-2 sm:px-4 py-2 rounded-full">
        {t('search')}, {t('apply')} & <br />
         <span className="text-[#723bcf]">{t('getDreamJobs')}</span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          {t('platformDescription')}
          <br className="hidden sm:inline" /> {t('forYou')}
        </p>
        <div className="flex w-full bg-[#ffffff] sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto">
          <input
            type="text"
            placeholder={t('findDreamJobs')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="outline-none border-none w-full my-4 sm:my-6"
          />
          <Button
            onClick={searchJobHandler}
            className="bg-[#723bcf] hover:bg-[#5f31ad] rounded-r-full"
          >
            {loading ? (
              <FaSpinner className="animate-spin h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
