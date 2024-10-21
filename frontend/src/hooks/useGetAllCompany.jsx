import axios from "axios"
import { useEffect } from "react"
import {COMPANY_ALL_API} from "../components/utils/constant"
import { useDispatch } from "react-redux";
import { setAllCompany } from "@/redux/companySlice";

const useGetAllCompany = () => {
  const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllCompany =async () => {
            try {
                const res = await axios.get(`${COMPANY_ALL_API}/get`,{withCredentials:true});
                if (res.data.success) {
                    dispatch(setAllCompany(res.data.companies))
                }
            } catch (error) {
                console.log(error);
                
            }
        }
        fetchAllCompany()
    },[dispatch])

  
}

export default useGetAllCompany