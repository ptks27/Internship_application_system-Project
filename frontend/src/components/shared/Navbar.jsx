import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../../assets/logo.png";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  LogOut,
  User2,
  Bell,
  Trash2,
  MoreVertical,
  Pencil,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT, NOTIFICATION_API } from "../utils/constant";
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
import useNotifications from "../../hooks/useNotifications";
import {
  markAsRead,
  removeNotification,
  markAllAsRead,
} from "../../redux/notificationSlice";
import { format } from "date-fns";
import { th, enUS } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import i18n from "../../i18n"; // ปรับเส้นทางตามโครงสร้างโปรเจ็คของคุณ

function Navbar() {
  const { t } = useTranslation();
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

  useNotifications(); // Use the hook to fetch notifications
  const { notifications, unreadCount } = useSelector(
    (state) => state.notification
  );

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.put(
        `${NOTIFICATION_API}/${notificationId}/read`,
        {},
        { withCredentials: true }
      );
      dispatch(markAsRead(notificationId));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.type === "new_application") {
      navigate(`/admin/jobs`);
    } else if (notification.type === "job_application") {
      navigate(`/history`);
    }
    handleMarkAsRead(notification.notification_id);
  };

  const formatNotificationTime = (createdAt) => {
    const date = new Date(createdAt);
    const now = new Date();
    const locale = i18n.language === "th" ? th : enUS;

    if (i18n.language === "th") {
      // Thai format
      if (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      ) {
        return format(date, "'วันนี้' p", { locale });
      } else if (date.getFullYear() === now.getFullYear()) {
        return format(date, "d MMM p", { locale });
      } else {
        return format(date, "d MMM yyyy p", { locale });
      }
    } else {
      // English format
      if (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      ) {
        return format(date, "'Today at' p", { locale });
      } else if (date.getFullYear() === now.getFullYear()) {
        return format(date, "MMM d 'at' p", { locale });
      } else {
        return format(date, "MMM d, yyyy 'at' p", { locale });
      }
    }
  };

  const handleDeleteNotification = async (notificationId, event) => {
    event.stopPropagation();
    try {
      await axios.delete(`${NOTIFICATION_API}/${notificationId}`, {
        withCredentials: true,
      });
      dispatch(removeNotification(notificationId));
      toast.success(t("notificationDeleted"));
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error(t("errorDeletingNotification"));
    }
  };

  const renderNotificationMessage = (notification) => {
    const companyName = notification.companyName || t("unknownCompany");

    if (notification.type === "job_application") {
      return (
        <>
          <span className="text-black">{t("youHaveAppliedForTheJob")}</span>
          <span className="text-[#7038ff] font-semibold">
            {notification.jobTitle || notification.message.split(": ")[1]}
          </span>
          <span className="text-black"> {t("atCompany")} </span>
          <span className="text-[#ff914d] font-semibold">{companyName}</span>
        </>
      );
    } else if (notification.type === "new_application") {
      return (
        <>
          <span className="text-black">{t("newApplicationReceived")}</span>
          <span className="text-[#7038ff] font-semibold">
            {notification.jobTitle || notification.message.split(": ")[1]}
          </span>
        </>
      );
    } else if (notification.type === "application_status_update") {
      const [fullJobTitle, status] = notification.message.split(" has been ");
      const jobTitle = fullJobTitle
        .replace("Your application for ", "")
        .replace(" position", "")
        .replace(" at Unknown Company", "");
      return (
        <>
          <span className="text-black">{t("yourApplicationFor")} </span>
          <span className="text-[#7038ff] font-semibold">{jobTitle}</span>
          <span className="text-black"> {t("positionHasBeen")} </span>
          <span
            className={`font-semibold ${
              status.toLowerCase() === "accepted"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {t(status.toLowerCase())}
          </span>
        </>
      );
    } else {
      return <span>{notification.message}</span>;
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Call API to mark all notifications as read
      await axios.put(
        `${NOTIFICATION_API}/mark-all-read`,
        {},
        {
          withCredentials: true,
        }
      );

      // Update local state
      dispatch(markAllAsRead());
      toast.success(t("allNotificationsMarkedAsRead"));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error(t("errorMarkingNotificationsAsRead"));
    }
  };

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.fullname || "");

  const handleNameUpdate = async () => {
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        { fullname: newName },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser({ ...user, fullname: newName }));
        setIsEditingName(false);
        toast.success(t("nameUpdatedSuccessfully"));
      }
    } catch (error) {
      console.error(error);
      toast.error(t("errorUpdatingName"));
    }
  };

  return (
    <div className="bg-[#f4f4f4] my-3">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 md:px-8">
        {/* Logo - Updated classes */}
        <div className="ml-3 md:-ml-4">
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

              {/* Add Notifications to mobile menu */}
              {user && (
                <li className="w-full max-w-[250px]">
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="relative cursor-pointer flex items-center justify-center w-full py-2 px-4 bg-gray-200 rounded-md">
                        <Bell size={20} className="mr-2" />
                        <span>{t("notifications")}</span>
                        {unreadCount > 0 && (
                          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-full max-w-sm p-0">
                      <div className="max-h-[50vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-3 border-b">
                          <h3 className="font-semibold">
                            {t("notifications")}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            disabled={
                              notifications.length === 0 ||
                              notifications.every((n) => n.isRead)
                            }
                          >
                            {t("markAllAsRead")}
                          </Button>
                        </div>
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div
                              key={notification.notification_id}
                              className={`p-3 cursor-pointer hover:bg-gray-100 border-b ${
                                notification.isRead ? "bg-gray-50" : "bg-white"
                              } relative`}
                              onClick={() =>
                                handleNotificationClick(notification)
                              }
                            >
                              <div className="flex justify-between items-start space-x-2">
                                <div className="flex-grow">
                                  <p
                                    className={`text-sm ${
                                      notification.isRead
                                        ? "text-gray-600"
                                        : "text-black font-semibold"
                                    }`}
                                  >
                                    {renderNotificationMessage(notification)}
                                  </p>
                                  <div className="flex items-center justify-between mt-1">
                                    <p className="text-xs text-gray-500">
                                      {notification.type === "new_application"
                                        ? t("newApplicationNotification")
                                        : t("jobApplicationNotification")}
                                    </p>
                                    <span className="text-xs text-gray-500">
                                      {formatNotificationTime(
                                        notification.createdAt
                                      )}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-shrink-0">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger
                                      asChild
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <button className="focus:outline-none p-1 rounded-full hover:bg-gray-200">
                                        <MoreVertical size={16} />
                                      </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={(e) =>
                                          handleDeleteNotification(
                                            notification.notification_id,
                                            e
                                          )
                                        }
                                        className="text-red-500 focus:text-red-500 focus:bg-red-50"
                                      >
                                        <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                        <span>{t("deleteNotification")}</span>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-center text-gray-500">
                            {t("noNotifications")}
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </li>
              )}

              {/* Add Language Select to mobile menu */}
              <li className="w-full max-w-[250px]">
                <Select
                  onValueChange={handleLanguageChange}
                  defaultValue={i18n.language}
                >
                  <SelectTrigger className="w-full bg-gray-200 border-none focus:ring-0 focus:ring-offset-0">
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
        <div className="ml-auto hidden md:flex items-center space-x-4">
          {!user ? (
            <Link to="/login">
              <Button className="rounded-full px-6 py-2 text-sm md:px-10 md:py-2 font-bold bg-black text-white hover:bg-[#5721d4]">
                {t("login")}
              </Button>
            </Link>
          ) : (
            <>
              {/* Notifications */}
              <Popover>
                <PopoverTrigger asChild>
                  <div className="relative cursor-pointer">
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-full max-w-sm p-0 sm:w-96">
                  <div className="max-h-[70vh] overflow-y-auto">
                    <div className="flex justify-between items-center p-3 border-b">
                      <h3 className="font-semibold">{t("notifications")}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMarkAllAsRead}
                        disabled={
                          notifications.length === 0 ||
                          notifications.every((n) => n.isRead)
                        }
                      >
                        {t("markAllAsRead")}
                      </Button>
                    </div>
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.notification_id}
                          className={`p-3 cursor-pointer hover:bg-gray-100 border-b ${
                            notification.isRead ? "bg-gray-50" : "bg-white"
                          } relative`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex justify-between items-start space-x-2">
                            <div className="flex-grow">
                              <p
                                className={`text-sm ${
                                  notification.isRead
                                    ? "text-gray-600"
                                    : "text-black font-semibold"
                                }`}
                              >
                                {renderNotificationMessage(notification)}
                              </p>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-gray-500">
                                  {notification.type === "new_application"
                                    ? t("newApplicationNotification")
                                    : t("jobApplicationNotification")}
                                </p>
                                <span className="text-xs text-gray-500">
                                  {formatNotificationTime(
                                    notification.createdAt
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  asChild
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button className="focus:outline-none p-1 rounded-full hover:bg-gray-200">
                                    <MoreVertical size={16} />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={(e) =>
                                      handleDeleteNotification(
                                        notification.notification_id,
                                        e
                                      )
                                    }
                                    className="text-red-500 focus:text-red-500 focus:bg-red-50"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                    <span>{t("deleteNotification")}</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-gray-500">
                        {t("noNotifications")}
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {/* User Avatar */}
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user?.profile.profilePhoto} />
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-64 md:w-80 p-0 border-none shadow-lg">
                  <div className="p-4">
                    <div className="flex gap-4 items-start">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={user?.profile.profilePhoto} />
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          {isEditingName && user?.role === "agent" ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="font-semibold text-lg border rounded px-2 py-1 w-full"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleNameUpdate();
                                  } else if (e.key === "Escape") {
                                    setIsEditingName(false);
                                    setNewName(user?.fullname || "");
                                  }
                                }}
                                autoFocus
                              />
                              <button
                                onClick={handleNameUpdate}
                                className="text-green-500 hover:text-green-600"
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => {
                                  setIsEditingName(false);
                                  setNewName(user?.fullname || "");
                                }}
                                className="text-red-500 hover:text-red-600"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <>
                              <h4 className="font-semibold text-lg">
                                {user?.fullname}
                              </h4>
                              {user?.role === "agent" && (
                                <button
                                  onClick={() => setIsEditingName(true)}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  <Pencil size={16} />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col text-gray-600 mt-4">
                      {user && user.role === "student" && (
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded-md"
                        >
                          <User2 size={18} />
                          <span className="text-sm">{t("viewProfile")}</span>
                        </Link>
                      )}
                      <button
                        onClick={logoutHandler}
                        className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded-md text-red-500"
                      >
                        <LogOut size={18} />
                        <span className="text-sm">{t("logout")}</span>
                      </button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
