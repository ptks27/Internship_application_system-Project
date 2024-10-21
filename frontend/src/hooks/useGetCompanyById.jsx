import axios from "axios"
import { useEffect } from "react"
import { COMPANY_ALL_API } from "../components/utils/constant"
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice";

const useGetCompanyById = (companyId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCompanyById = async () => {
      try {
        const res = await axios.get(`${COMPANY_ALL_API}/get/${companyId}`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setSingleCompany(res.data.company))
        }
      } catch (error) {
        console.error("Error fetching company:", error);
      }
    }
    if (companyId) {
      fetchCompanyById()
    }
  }, [dispatch, companyId])
}

export default useGetCompanyById