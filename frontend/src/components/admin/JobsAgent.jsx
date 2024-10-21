import { useNavigate } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';

import JobsAgentTable from "./JobsAgentTable";
import useGetAllJobsAgent from "@/hooks/useGetAllJobsAgent";
import { setSearchJobByText } from "@/redux/jobSlice";

const JobsAgent = () => {
  const { t } = useTranslation();
  useGetAllJobsAgent()
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchJobByText(input))
  },[input, dispatch])

  return (
    <div className="bg-white min-h-screen">
      <Navbar className="bg-white" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#723bcf] mb-8">{t('jobPositions')}</h1>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Input
              className="w-full sm:w-64 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#723bcf] focus:border-transparent"
              placeholder={t('filterByCompanyAndRole')}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              onClick={() => navigate("/admin/jobs/new")}
              className="w-full sm:w-auto bg-[#723bcf] text-white hover:bg-[#5f31ad] transition-colors"
            >
              {t('newJob')}
            </Button>
          </div>
          <div className="overflow-x-auto">
            <JobsAgentTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsAgent;
