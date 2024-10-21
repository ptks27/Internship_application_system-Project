import axios from "axios";
import { useEffect, useState } from "react";
import { JOB_ALL_API } from "../components/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setAllJobs, setIsLoading } from "@/redux/jobSlice";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchQuery } = useSelector((state) => state.job);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        dispatch(setIsLoading(true));
        setError(null);
        const res = await axios.get(
          `${JOB_ALL_API}/getall?keyword=${encodeURIComponent(searchQuery)}`,
          { withCredentials: true }
        );
        if (res.data.success && Array.isArray(res.data.jobs)) {
          dispatch(setAllJobs(res.data.jobs));
          if (res.data.jobs.length === 0) {
            setError("No jobs found");
          }
        } else {
          setError("No jobs found");
          dispatch(setAllJobs([]));
        }
      } catch (error) {
        console.error(error);
        setError("An error occurred while fetching jobs");
        dispatch(setAllJobs([]));
      } finally {
        dispatch(setIsLoading(false));
      }
    };
    fetchAllJobs();
  }, [dispatch, searchQuery]);

  return { error };
};

export default useGetAllJobs;

JOB_ALL_API;
