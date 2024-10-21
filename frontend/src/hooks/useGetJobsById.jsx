import axios from "axios"
import { useEffect } from "react"
import { JOB_ALL_API } from "../components/utils/constant"
import { useDispatch } from "react-redux";
import { setSingleJob } from "@/redux/jobSlice";

const useGetJobsById = (jobId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchJobById = async () => {
      try {
        const res = await axios.get(`${JOB_ALL_API}/getjob/${jobId}`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job))
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      }
    }
    if (jobId) {
      fetchJobById()
    }
  }, [dispatch, jobId])
}

export default useGetJobsById