import axios from "axios"
import { useEffect } from "react"
import {JOB_ALL_API} from "../components/utils/constant"
import { useDispatch } from "react-redux";
import {  setAllJobsAgent } from "@/redux/jobSlice";


const useGetAllJobsAgent = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllJobsAgent =async () => {
            try {
                const res = await axios.get(`${JOB_ALL_API}/getadmin`,{withCredentials:true});
                if (res.data.success) {
                    dispatch(setAllJobsAgent(res.data.jobs))
                }
            } catch (error) {
                console.log(error);
                
            }
        }
        fetchAllJobsAgent()
    },[dispatch])


}

export default useGetAllJobsAgent