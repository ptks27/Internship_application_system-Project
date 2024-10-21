import Navbar from "./shared/Navbar";
import MainSection from "./MainSection";
import CategoryJobs from "./CategoryJobs";
import LatestJobs from "./LatestJobs";
import Footer from "./shared/Footer";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { // ตรวจสอบว่าผู้ใช้ล็อกอินหรือไม่
      navigate("/login"); // นำทางไปยังหน้าเข้าสู่ระบบ
    } else if (user.role === "agent") {
      navigate("/admin/companies");
    }
  }, [navigate, user]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f4f4]">
      <Navbar />
      <main className="flex-grow">
        <MainSection />
        <CategoryJobs />
        <LatestJobs />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
