import { Application_API } from "@/components/utils/constant";
import { setAllAppliedJobs } from "@/redux/jobSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get(`${Application_API}/get`, {withCredentials: true})
               
                if (res.data.success) {
                    dispatch(setAllAppliedJobs(res.data.applications));
                }

            } catch (error) {
                console.log(error);
            }
        }
        fetchAppliedJobs();
    },[dispatch])
}

export default useGetAppliedJobs;