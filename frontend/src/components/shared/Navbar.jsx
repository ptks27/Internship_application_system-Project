import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../../assets/logo.png";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { LogOut, User2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { setUser } from "@/redux/authSlice";
import { resetJobs } from "@/redux/jobSlice";
import { changeLanguage } from "@/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

function Navbar() {
  const { t, i18n } = useTranslation();
  const { user } = useSelector((store) => store.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        dispatch(resetJobs());
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const [activeLink, setActiveLink] = useState("Home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case "/home":
        setActiveLink("Home");
        break;
      case "/jobs":
        setActiveLink("Jobs");
        break;
      case "/history":
        setActiveLink("History");
        break;
      case "/admin/companies":
        setActiveLink("Companies");
        break;
      case "/admin/jobs":
        setActiveLink("Jobs");
        break;
      default:
        setActiveLink("");
    }
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLanguageChange = (value) => {
    changeLanguage(value);
  };

  return (
    <div className="bg-[#f4f4f4] my-3">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 md:px-8">
        {/* Logo */}
        <div className="-ml-4">
          <Link to="/home">
            <img
              src={logo}
              alt="JobPortal Logo"
              className="h-8 w-auto md:h-10"
            />
          </Link>
        </div>

        {/* Centered Navigation Links */}
        <div className="flex-1 hidden md:flex justify-center">
          <ul className="flex font-medium items-center gap-6 md:gap-10">
            {user && user.role === "agent" ? (
              <>
                <li>
                  <Link to="/admin/companies">
                    <button
                      className={`relative ${
                        activeLink === "Companies"
                          ? "text-purple-700 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-purple-700 font-bold"
                          : "text-black font-bold"
                      }`}
                    >
                      {t("companies")}
                    </button>
                  </Link>
                </li>

                <li>
                  <Link to="/admin/jobs">
                    <button
                      className={`relative ${
                        activeLink === "Jobs"
                          ? "text-purple-700 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-purple-700 font-bold"
                          : "text-black font-bold"
                      }`}
                    >
                      {t("jobs")}
                    </button>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/home">
                    <button
                      className={`relative ${
                        activeLink === "Home"
                          ? "text-purple-700 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-purple-700 font-bold"
                          : "text-black font-bold"
                      }`}
                    >
                      {t("home")}
                    </button>
                  </Link>
                </li>

                <li>
                  <Link to="/jobs">
                    <button
                      className={`relative ${
                        activeLink === "Jobs"
                          ? "text-purple-700 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-purple-700 font-bold"
                          : "text-black font-bold"
                      }`}
                    >
                      {t("jobs")}
                    </button>
                  </Link>
                </li>

                <li>
                  <Link to="/history">
                    <button
                      className={`relative ${
                        activeLink === "History"
                          ? "text-purple-700 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-purple-700 font-bold"
                          : "text-black font-bold"
                      }`}
                    >
                      {t("history")}
                    </button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-black text-2xl">
            ☰
          </button>
        </div>

        {/* Mobile Menu Content */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-[#f4f4f4] z-50">
            <ul className="flex flex-col font-medium items-center gap-4 p-4">
              {user && user.role === "agent" ? (
                <>
                  <li>
                    <Link to="/admin/companies">
                      <button
                        className={`relative ${
                          activeLink === "Companies"
                            ? "text-purple-700 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-purple-700 font-bold"
                            : "text-black font-bold"
                        }`}
                      >
                        {t("companies")}
                      </button>
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/jobs">
                      <button
                        className={`relative ${
                          activeLink === "Jobs"
                            ? "text-purple-700 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-purple-700 font-bold"
                            : "text-black font-bold"
                        }`}
                      >
                        {t("jobs")}
                      </button>
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/home">
                      <button
                        className={`relative ${
                          activeLink === "Home"
                            ? "text-purple-700 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-purple-700 font-bold"
                            : "text-black font-bold"
                        }`}
                      >
                        {t("home")}
                      </button>
                    </Link>
                  </li>
                  <li>
                    <Link to="/jobs">
                      <button
                        className={`relative ${
                          activeLink === "Jobs"
                            ? "text-purple-700 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-purple-700 font-bold"
                            : "text-black font-bold"
                        }`}
                      >
                        {t("jobs")}
                      </button>
                    </Link>
                  </li>
                  <li>
                    <Link to="/history">
                      <button
                        className={`relative ${
                          activeLink === "History"
                            ? "text-purple-700 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-purple-700 font-bold"
                            : "text-black font-bold"
                        }`}
                      >
                        {t("history")}
                      </button>
                    </Link>
                  </li>
                </>
              )}

              {/* Add new mobile menu items for logged-in users */}
              {user && (
                <>
                  <li className="w-full max-w-[250px]">
                    <div className="flex flex-col items-center justify-center gap-2 mb-4">
                      <Avatar className="h-12 w-12 my-5">
                        <AvatarImage
                          src={user?.profile.profilePhoto}
                          alt={user?.fullname}
                        />
                      </Avatar>
                      <span className="font-bold text-sm">
                        {user?.fullname}
                      </span>
                      <span className="text-sm text-gray-600">
                        {user?.email}
                      </span>
                    </div>
                  </li>
                  {user.role === "student" && (
                    <li className="w-full max-w-[250px]">
                      <Link
                        to="/profile"
                        className="block text-center py-2 px-4 bg-gray-200 rounded-md text-sm"
                      >
                        {t("viewProfile")}
                      </Link>
                    </li>
                  )}
                  <li className="w-full max-w-[250px]">
                    <button
                      onClick={logoutHandler}
                      className="w-full text-center py-1.5 px-3 bg-red-500 text-white rounded-md text-sm"
                    >
                      {t("logout")}
                    </button>
                  </li>
                </>
              )}

              {/* Add login button for non-logged in users */}
              {!user && (
                <li className="w-full max-w-[250px]">
                  <Link
                    to="/login"
                    className="block text-center py-2 px-4 bg-black text-white rounded-md text-sm"
                  >
                    Login
                  </Link>
                </li>
              )}

              {/* Add Language Select to mobile menu */}
              <li className="w-full max-w-[250px]">
                <Select
                  onValueChange={handleLanguageChange}
                  defaultValue={i18n.language}
                >
                  <SelectTrigger className="w-full border-none bg-transparent focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder={i18n.language.toUpperCase()} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">EN</SelectItem>
                    <SelectItem value="th">TH</SelectItem>
                  </SelectContent>
                </Select>
              </li>
            </ul>
          </div>
        )}

        {/* Language Select Dropdown (desktop) */}
        <div className="hidden md:block">
          <Select
            onValueChange={handleLanguageChange}
            defaultValue={i18n.language}
          >
            <SelectTrigger className="w-[70px] border-none bg-transparent focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder={i18n.language.toUpperCase()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">EN</SelectItem>
              <SelectItem value="th">TH</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Login Button or User Avatar */}
        <div className="ml-auto hidden md:block">
          {!user ? (
            <Link to="/login">
              <Button className="rounded-full px-6 py-2 text-sm md:px-10 md:py-2 font-bold bg-black text-white hover:bg-[#5721d4]">
                {t("login")}
              </Button>
            </Link>
          ) : (
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user?.profile.profilePhoto} />
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-64 md:w-80 p-0 border-none shadow-lg">
                  <div className="p-4">
                    <div className="flex gap-4 space-y-2">
                      <Avatar className="cursor-pointer">
                        <AvatarImage src={user?.profile.profilePhoto} />
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{user?.fullname}</h4>
                        <p className="text-sm text-muted-foreground">
                          {user?.profile?.bio}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col text-gray-600 mt-4">
                      {user && user.role === "student" && (
                        <div className="flex items-center gap-2 cursor-pointer py-2">
                          <User2 size={18} />
                          <Link
                            to="/profile"
                            className="text-sm hover:underline"
                          >
                            {t("viewProfile")}
                          </Link>
                        </div>
                      )}

                      <div className="flex items-center gap-2 cursor-pointer py-2">
                        <LogOut size={18} />
                        <button
                          onClick={logoutHandler}
                          className="text-sm hover:underline"
                        >
                          {t("logout")}
                        </button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
