import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox"; // Import Checkbox component
import { Button } from "./ui/button"; // Import Button component
import { MapPin, Users, Landmark, ChevronDown, ChevronUp } from "lucide-react"; // นำเข้าไอคอนจาก lucide-react
import { useDispatch } from "react-redux";
import { setSearchQuery, setSalaryRange } from "@/redux/jobSlice"; // Import setSalaryRange
import { useTranslation } from 'react-i18next';

const filterData = [
  {
    filterType: "Location",
    icon: <MapPin size={20} className="mr-2" />,
    array: [
      { en: "Bangkok", th: "กรุงเทพ" },
      { en: "Nonthaburi", th: "นนทบุรี" },
      { en: "Nakornpathom", th: "นครปฐม" },
      { en: "Samutprakan", th: "สมุทรปราการ" },
      { en: "Samutsakhon", th: "สมุทรสาคร" },
      { en: "Chonburi", th: "ชลบุรี" },
      { en: "Chiang Mai", th: "เชียงใหม่" },
      { en: "Phuket", th: "ภูเก็ต" },
      { en: "Khon Kaen", th: "ขอนแก่น" },
      { en: "Nakhon Ratchasima", th: "นครราชสีมา" },
      { en: "Udon Thani", th: "อุดรธานี" }
    ],
  },
  {
    filterType: "Position",
    icon: <Users size={20} className="mr-2" />,
    array: [
      { en: "Frontend Developer", th: "นักพัฒนาฝั่งหน้า" },
      { en: "Backend Developer", th: "นักพัฒนาฝั่งหลัง" },
      { en: "UX/UI Designer", th: "นักออกแบบ UX/UI" },
      { en: "Business Analysis", th: "วิเคราะห์ธุรกิจ" },
      { en: "Software Engineer", th: "วิศวกรซอฟต์แวร์" },
      { en: "Mobile Developer", th: "นักพัฒนาแอปมือถือ" },
      { en: "Tester", th: "ผู้ทดสอบ" },
      { en: "Data Analyst", th: "นักวิเคราะห์ข้อมูล" }
    ],
  },
];

const salaryData = {
  filterType: "Salary",
  icon: <Landmark size={20} className="mr-2" />,
  array: [
    { label: "0-5,000 THB", min: 0, max: 5000 },
    { label: "5,000-15,000 THB", min: 5000, max: 15000 },
    { label: "15,000-30,000 THB", min: 15000, max: 30000 },
  ],
};

const FilterCard = () => {
  const { t, i18n } = useTranslation(); // Add i18n to access current language
  const [selectedFilters, setSelectedFilters] = useState({
    Location: [],
    Position: [],
    Salary: [],
  });
  const [expandedSections, setExpandedSections] = useState({
    Location: true,
    Position: true,
    Salary: true,
  });
  const dispatch = useDispatch();

  const handleFilterChange = (filterType, value) => {
    if (filterType === "Salary") {
      setSelectedFilters(prev => ({
        ...prev,
        [filterType]: prev[filterType].some(item => item.label === value.label)
          ? prev[filterType].filter(item => item.label !== value.label)
          : [...prev[filterType], value]
      }));
    } else {
      const valueKey = filterType === "Salary" ? "label" : "en";
      const selectedValue = value[valueKey] || value;

      setSelectedFilters(prev => ({
        ...prev,
        [filterType]: prev[filterType].some(item => item[valueKey] === selectedValue)
          ? prev[filterType].filter(item => item[valueKey] !== selectedValue)
          : [...prev[filterType], value]
      }));
    }
  };

  const handleClearAll = () => {
    setSelectedFilters({
      Location: [],
      Position: [],
      Salary: [],
    });
  };

  const toggleSection = (filterType) => {
    setExpandedSections(prev => ({
      ...prev,
      [filterType]: !prev[filterType]
    }));
  };

  useEffect(() => {
    const query = [
      ...selectedFilters.Location.map(item => `${item.en} ${item.th}`),
      ...selectedFilters.Position.map(item => `${item.en} ${item.th}`)
    ].join(' ');
    dispatch(setSearchQuery(query));

    // Handle salary range
    if (selectedFilters.Salary.length > 0) {
      dispatch(setSalaryRange(selectedFilters.Salary));
    } else {
      dispatch(setSalaryRange([]));
    }
  }, [selectedFilters, dispatch]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h1 className="text-xl font-bold text-white bg-[#723bcf] p-3 rounded-md mb-4">
        {t('filterJobs')}
      </h1>
      <Button onClick={handleClearAll} variant="outline" className="mb-4 w-full">
        {t('clearAllFilters')}
      </Button>
      <hr className="mb-4" />
      {[...filterData, salaryData].map((data) => (
        <div key={data.filterType} className="mb-6">
          <h2 
            className="font-bold text-lg flex items-center mb-3 cursor-pointer"
            onClick={() => toggleSection(data.filterType)}
          >
            {data.icon} {t(data.filterType.toLowerCase())}
            {expandedSections[data.filterType] ? <ChevronUp size={20} className="ml-auto" /> : <ChevronDown size={20} className="ml-auto" />}
          </h2>
          {expandedSections[data.filterType] && (
            <div className="space-y-2">
              {data.array.map((item, idx) => {
                const itemId = `${data.filterType}-${idx}`;
                const itemValue = data.filterType === "Location" && i18n.language === 'th' 
                  ? item.th 
                  : (data.filterType === "Salary" 
                      ? item.label.replace("THB", i18n.language === 'th' ? "บาท" : "THB") 
                      : item.en); // Use Thai for Location if language is Thai, otherwise use English
                const isChecked = data.filterType === "Salary"
                  ? selectedFilters[data.filterType].some(selectedItem => selectedItem.label === item.label)
                  : selectedFilters[data.filterType].some(selectedItem => selectedItem.en === item.en);
                return (
                  <div key={itemId} className="flex items-center space-x-3">
                    <Checkbox
                      id={itemId}
                      checked={isChecked}
                      onCheckedChange={() => handleFilterChange(data.filterType, item)}
                    />
                    <Label htmlFor={itemId} className="text-sm">{itemValue}</Label>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FilterCard;
