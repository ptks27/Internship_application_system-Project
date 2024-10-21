import { useEffect } from "react";
import Navbar from "../shared/Navbar";
import ApplicantsTable from "./ApplicantsTable";
import axios from "axios";
import { Application_API } from "../utils/constant";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants, resetApplicants } from "@/redux/applicantsSlice";
import { useTranslation } from 'react-i18next';

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { applicants } = useSelector((state) => state.application);
  const { t } = useTranslation();
  
  useEffect(() => {
    // Reset applicants when the component mounts
    dispatch(resetApplicants());

    const fetchAllApplicants = async () => {
      try {
        const res = await axios.get(
          `${Application_API}/${params.id}/applicants`,
          { withCredentials: true }
        );
        
        dispatch(setAllApplicants(res.data.create_ByJobId.applications));
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllApplicants();
  }, [dispatch, params.id]);

  return (
    <div className="bg-white min-h-screen">
      <Navbar className="bg-white" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#723bcf] mb-8">
          {t('traineeApply')} ({applicants ? applicants.length : 0})
        </h1>
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <ApplicantsTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applicants;
