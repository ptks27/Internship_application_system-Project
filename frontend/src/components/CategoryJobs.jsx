import { useDispatch } from "react-redux";
import { Button } from "./ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { useNavigate } from "react-router-dom";
import { setSearchQuery } from "@/redux/jobSlice";
import { useTranslation } from 'react-i18next'; // เพิ่มการ import นี้

const CategoryJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(); // เพิ่มการใช้ useTranslation

// Define static list of job positions
const jobPositions = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Software Engineer",
  "UX/UI Designer",
  "IT Project Manager",
  "Business Analyst",
  "System Analyst",
  "Tester",
  "DevOps Engineer",          // Added
  "Data Scientist",           // Added
  "Mobile App Developer",     // Added
  "Game Developer",           // Added
  "Database Administrator",   // Added
];

  const searchJobHandler = (query) => {
    dispatch(setSearchQuery(query));
    navigate("/search");
  };

  return (
    <div className="my-8 sm:my-12 md:my-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-4">
        <p className="text-lg leading-6 text-gray-500">
          {t('chooseJobInterest')} {/* ใช้ t() เพื่อแปลข้อความ */}
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {jobPositions.map((position) => (
              <CarouselItem
                key={position}
                className="pl-2 md:pl-2 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
              >
                <Button
                  onClick={() => searchJobHandler(position)}
                  variant="outline"
                  className="w-full h-12 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:bg-[#723bcf] hover:text-white"
                >
                  {position}
                </Button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex -left-4" />
          <CarouselNext className="hidden sm:flex -right-4" />
        </Carousel>
      </div>
    </div>
  );
};

export default CategoryJobs;
