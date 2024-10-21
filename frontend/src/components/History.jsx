import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Historyjob from "./Historyjob"
import Navbar from "./shared/Navbar"
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs"
import { useTranslation } from 'react-i18next';

const History = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  useGetAppliedJobs();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 ">
      <Navbar/>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <h1 className="text-2xl md:text-3xl font-bold text-[#723bcf] p-6 md:p-10 border-b my-[-20px]">{t('appliedJobs')}</h1>
          <Historyjob/>
        </div>
      </div>
    </div>
  )
}

export default History
