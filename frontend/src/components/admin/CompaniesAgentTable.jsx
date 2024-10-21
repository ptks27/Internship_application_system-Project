import { Avatar, AvatarImage } from "../ui/avatar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import google from "../../assets/google.png";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { COMPANY_ALL_API } from "../utils/constant";
import { setAllCompany, resetCompanyState } from "../../redux/companySlice";
import { toast } from "sonner";
import { Button } from "../ui/button";
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';

export const CompaniesAgentTable = () => {
  const { t, i18n } = useTranslation();
  const { companies, searchCompanyByText } = useSelector(
    (state) => state.company
  );
  const [filterCompany, setFilterCompany] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetCompanyState());
  }, [dispatch]);

  useEffect(() => {
    if (companies && Array.isArray(companies)) {
      const filteredCompany = companies.filter((company) => {
        if (!searchCompanyByText) {
          return true;
        }
        return company?.name
          ?.toLowerCase()
          .includes(searchCompanyByText.toLowerCase());
      });
      setFilterCompany(filteredCompany);
    } else {
      setFilterCompany([]);
    }
  }, [companies, searchCompanyByText]);

  const deleteCompany = async (companyId) => {
    const result = await Swal.fire({
      title: t('areYouSure'),
      text: t('cantRevert'),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#723bcf",
      cancelButtonColor: "#d33",
      confirmButtonText: t('yesDelete'),
      cancelButtonText: t('cancel'),
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(
          `${COMPANY_ALL_API}/delete/${companyId}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          toast.success(res.data.message);
          dispatch(
            setAllCompany(
              companies.filter((company) => company.company_id !== companyId)
            )
          );
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message || t('somethingWentWrong'));
      }
    }
  };

  const formatDate = (dateString, language) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = date.getDate();
    
    // Define month names for both English and Thai
    const monthNames = {
      en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      th: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."]
    };

    // Select the appropriate month name based on the provided language
    const month = monthNames[language][date.getMonth()];

    // Adjust the year based on the language
    const year = language === 'th' ? date.getFullYear() + 543 : date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <Table>
        <TableCaption>{t('recentlyRegisteredCompanies')}</TableCaption>
        <TableHeader>
          <TableRow className="bg-[#723bcf] hover:bg-[#5f31ad]">
            <TableHead className="bg-purple-700 text-white">{t('logo')}</TableHead>
            <TableHead className="bg-purple-700 text-white">
              {t('companyName')}
            </TableHead>
            <TableHead className="bg-purple-700 text-white">
              {t('agentName')}
            </TableHead>
            <TableHead className="bg-purple-700 text-white hidden sm:table-cell">
              {t('date')}
            </TableHead>
            <TableHead className="bg-purple-700 text-white text-right">
              {t('action')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterCompany.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                {t('noCompaniesFound')}
              </TableCell>
            </TableRow>
          ) : (
            filterCompany?.map((company) => (
              <TableRow key={company.company_id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage
                      src={company.logo || google}
                      alt={company.name}
                    />
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>{company.agent_fullname || t('notAvailable')}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {formatDate(company.createdAt, i18n.language)}
                </TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer">
                        <MoreHorizontal className="h-4 w-4" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-0">
                      <Button
                        onClick={() =>
                          navigate(
                            `/admin/companies/update/${company.company_id}`
                          )
                        }
                        variant="ghost"
                        className="flex w-full items-center justify-start px-3 py-2 text-sm hover:bg-gray-100 text-gray-700 border-0"
                      >
                        <Edit2 className="mr-2 h-4 w-4 text-blue-500" />
                        {t('edit')}
                      </Button>
                      <Button
                        onClick={() => deleteCompany(company.company_id)}
                        variant="ghost"
                        className="flex w-full items-center justify-start px-3 py-2 text-sm hover:bg-gray-100 text-red-600 border-0"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('delete')}
                      </Button>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
