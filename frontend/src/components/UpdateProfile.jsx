import { useState, useEffect } from "react";
import Select from "react-select"; // นำเข้า React Select
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { USER_API_END_POINT } from "../components/utils/constant";
import { toast } from "sonner";
import { setLoading, setUser } from "@/redux/authSlice";
import PropTypes from "prop-types";
import { Camera, X, Image } from "lucide-react";
import { useTranslation } from "react-i18next"; // เพิ่มการ import นี้

const UpdateProfile = ({ open, setOpen }) => {
  const { t } = useTranslation(); // เพิ่มบรรทัดนี้เพื่อใช้งานฟังก์ชันแปลภาษา
  const { loading, user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills || [],
    file: null,
    profilePhoto: null,
  });

  const [fullnameError, setFullnameError] = useState(""); // State สำหรับเก็บ error message ของ fullname
  const [phoneError, setPhoneError] = useState(""); // State สำหรับเก็บ error message ของ phoneNumber

  const dispatch = useDispatch();

  const skillOptions = [
    // Programmer
    { value: "Python", label: "Python" },
    { value: "Java", label: "Java" },
    { value: "C++", label: "C++" },
    { value: "C#", label: "C#" },
    { value: "Ruby", label: "Ruby" },
    { value: "PHP", label: "PHP" },
    { value: "Data Structures", label: "Data Structures" },
    { value: "Algorithms", label: "Algorithms" },
    { value: "OOP", label: "Object-Oriented Programming (OOP)" },
    { value: "SQL", label: "SQL" },
    { value: "NoSQL", label: "NoSQL" },
    { value: "MongoDB", label: "MongoDB" },
    { value: "Git", label: "Git" },
    { value: "GitHub", label: "GitHub" },
    { value: "SDLC", label: "Software Development Life Cycle (SDLC)" },
    { value: "Agile", label: "Agile" },
    { value: "Scrum", label: "Scrum" },
    { value: "TDD", label: "Test-Driven Development (TDD)" },

    // Web Developer
    { value: "HTML", label: "HTML" },
    { value: "CSS", label: "CSS" },
    { value: "JavaScript", label: "JavaScript" },
    { value: "React", label: "React" },
    { value: "Angular", label: "Angular" },
    { value: "Vue.js", label: "Vue.js" },
    { value: "Node.js", label: "Node.js" },
    { value: "Express.js", label: "Express.js" },
    { value: "Django", label: "Django" },
    { value: "Flask", label: "Flask" },
    { value: "Ruby on Rails", label: "Ruby on Rails" },
    { value: "MySQL", label: "MySQL" },
    { value: "PostgreSQL", label: "PostgreSQL" },
    { value: "GraphQL", label: "GraphQL" },
    { value: "RESTful APIs", label: "RESTful APIs" },
    { value: "Bootstrap", label: "Bootstrap" },
    { value: "Tailwind CSS", label: "Tailwind CSS" },
    { value: "Web Security", label: "Web Security" },
    { value: "OWASP", label: "OWASP" },
    { value: "DevOps", label: "DevOps" },
    { value: "Docker", label: "Docker" },
    { value: "Kubernetes", label: "Kubernetes" },

    // UX/UI Designer
    { value: "Figma", label: "Figma" },
    { value: "Sketch", label: "Sketch" },
    { value: "Adobe XD", label: "Adobe XD" },
    { value: "InVision", label: "InVision" },
    { value: "User Research", label: "User Research" },
    { value: "Personas", label: "Personas" },
    {
      value: "Information Architecture",
      label: "Information Architecture (IA)",
    },
    { value: "Interaction Design", label: "Interaction Design (IxD)" },
    { value: "Typography", label: "Typography" },
    { value: "Color Theory", label: "Color Theory" },
    { value: "Layouts", label: "Layouts" },
    { value: "Usability Testing", label: "Usability Testing" },
    { value: "Material Design", label: "Material Design" },
    {
      value: "Human Interface Guidelines",
      label: "Human Interface Guidelines",
    },
    { value: "Accessibility", label: "Accessibility (WCAG)" },

    // Business Analyst (BA)
    { value: "Requirements Gathering", label: "Requirements Gathering" },
    {
      value: "Business Process Modeling",
      label: "Business Process Modeling (BPM)",
    },
    { value: "Stakeholder Management", label: "Stakeholder Management" },
    { value: "Use Case Diagrams", label: "Use Case Diagrams" },
    { value: "User Stories", label: "User Stories" },
    { value: "Data Analysis", label: "Data Analysis" },
    { value: "Power BI", label: "Power BI" },
    { value: "Tableau", label: "Tableau" },
    { value: "SWOT Analysis", label: "SWOT Analysis" },
    { value: "Risk Management", label: "Risk Management" },

    // System Analyst (SA)
    { value: "System Architecture", label: "System Architecture" },
    { value: "Database Design", label: "Database Design" },
    { value: "Data Flow Diagrams", label: "Data Flow Diagrams (DFD)" },
    {
      value: "Entity-Relationship Diagrams",
      label: "Entity-Relationship Diagrams (ERD)",
    },
    { value: "UML", label: "UML" },
    { value: "System Integration", label: "System Integration" },
    { value: "Validation & Testing", label: "Validation & Testing" },
    { value: "AWS", label: "AWS" },
    { value: "Azure", label: "Azure" },
    { value: "Jira", label: "Jira" },
    { value: "Trello", label: "Trello" },

    // Tester/QA
    { value: "Manual Testing", label: "Manual Testing" },
    { value: "Test Automation", label: "Test Automation" },
    { value: "Selenium", label: "Selenium" },
    { value: "Cypress", label: "Cypress" },
    { value: "JUnit", label: "JUnit" },
    { value: "TestNG", label: "TestNG" },
    { value: "Postman", label: "Postman" },
    { value: "JMeter", label: "JMeter" },
    { value: "Appium", label: "Appium" },
    { value: "Bug Tracking", label: "Bug Tracking" },
    { value: "Jira", label: "Jira" },
    { value: "Bugzilla", label: "Bugzilla" },
    { value: "Regression Testing", label: "Regression Testing" },
    { value: "Security Testing", label: "Security Testing" },

    // IT Support
    { value: "Hardware Troubleshooting", label: "Hardware Troubleshooting" },
    { value: "Software Troubleshooting", label: "Software Troubleshooting" },
    { value: "Network Configuration", label: "Network Configuration" },
    { value: "Windows OS", label: "Windows OS" },
    { value: "Linux OS", label: "Linux OS" },
    { value: "macOS", label: "macOS" },
    { value: "Help Desk", label: "Help Desk" },
    { value: "ServiceNow", label: "ServiceNow" },
    { value: "Remote Support", label: "Remote Support" },
    { value: "TeamViewer", label: "TeamViewer" },
    { value: "System Backup", label: "System Backup" },
    { value: "PowerShell", label: "PowerShell" },
    { value: "Customer Support", label: "Customer Support" },
  ];

  const bioOptions = [
    // Software Development
    { value: "Frontend Developer", label: "Frontend Developer" },
    { value: "Backend Developer", label: "Backend Developer" },
    { value: "Full Stack Developer", label: "Full Stack Developer" },
    { value: "Web Developer", label: "Web Developer" },
    { value: "Mobile App Developer", label: "Mobile App Developer" },
    { value: "Software Engineer", label: "Software Engineer" },
    { value: "Game Developer", label: "Game Developer" },
    {
      value: "Embedded Systems Developer",
      label: "Embedded Systems Developer",
    },

    // Data & Analytics
    { value: "Data Scientist", label: "Data Scientist" },
    { value: "Data Engineer", label: "Data Engineer" },
    {
      value: "Business Intelligence Analyst",
      label: "Business Intelligence Analyst",
    },
    { value: "Machine Learning Engineer", label: "Machine Learning Engineer" },
    { value: "Big Data Engineer", label: "Big Data Engineer" },

    // Infrastructure & Operations
    { value: "System Administrator", label: "System Administrator" },
    { value: "Network Engineer", label: "Network Engineer" },
    { value: "Cloud Engineer", label: "Cloud Engineer" },
    { value: "DevOps Engineer", label: "DevOps Engineer" },
    { value: "Site Reliability Engineer", label: "Site Reliability Engineer" },
    { value: "IT Support Technician", label: "IT Support Technician" },

    // Cybersecurity
    { value: "Cybersecurity Analyst", label: "Cybersecurity Analyst" },
    {
      value: "Information Security Specialist",
      label: "Information Security Specialist",
    },
    { value: "Penetration Tester", label: "Penetration Tester" },
    { value: "Security Engineer", label: "Security Engineer" },

    // Database
    { value: "Database Administrator", label: "Database Administrator" },
    { value: "Database Developer", label: "Database Developer" },

    // Design & UX
    { value: "UX/UI Designer", label: "UX/UI Designer" },
    { value: "Graphic Designer", label: "Graphic Designer" },
    { value: "Interaction Designer", label: "Interaction Designer" },

    // Project Management & Analysis
    { value: "IT Project Manager", label: "IT Project Manager" },
    { value: "Scrum Master", label: "Scrum Master" },
    { value: "Business Analyst", label: "Business Analyst" },
    { value: "System Analyst", label: "System Analyst" },

    // Emerging Technologies
    { value: "AI Specialist", label: "AI Specialist" },
    { value: "IoT Developer", label: "IoT Developer" },
    { value: "Blockchain Developer", label: "Blockchain Developer" },
    { value: "AR/VR Developer", label: "AR/VR Developer" },

    // Quality Assurance
    { value: "QA Engineer", label: "QA Engineer" },
    { value: "Test Automation Engineer", label: "Test Automation Engineer" },

    // IT Management
    { value: "IT Manager", label: "IT Manager" },
    {
      value: "Chief Information Officer (CIO)",
      label: "Chief Information Officer (CIO)",
    },
    {
      value: "Chief Technology Officer (CTO)",
      label: "Chief Technology Officer (CTO)",
    },
    { value: "Data Analyst", label: "Data Analyst" },
    { value: "Business Analyst", label: "Business Analyst" },
  ];
  const validateFullname = (value) => {
    const thaiEnglishRegex = /^[ก-๏a-zA-Z\s]+$/;
    if (value.length > 0 && value.length < 5) {
      setFullnameError(t("fullnameTooShort"));
    } else if (value.length > 30) {
      setFullnameError(t("fullnameTooLong"));
    } else if (!thaiEnglishRegex.test(value)) {
      setFullnameError(t("fullnameInvalidChars"));
    } else {
      setFullnameError("");
    }
  };

  const validatePhoneNumber = (value) => {
    const onlyNumbersRegex = /^[0-9]*$/;
    if (!onlyNumbersRegex.test(value)) {
      setPhoneError(t("phoneInvalidDigits"));
    } else if (value.length !== 10) {
      setPhoneError(t("phoneInvalidLength"));
    } else if (value[0] !== "0") {
      setPhoneError(t("phoneStartWithZero"));
    } else {
      setPhoneError("");
    }
  };

  const changeEventHandler = (e) => {
    const { name, value } = e.target;

    if (name === "fullname") {
      if (value.length <= 30) {
        // Check if length is less than or equal to 30
        validateFullname(value); // Validate input
        setInput({ ...input, [name]: value }); // Update state
      }
    } else if (name === "phoneNumber") {
      if (value.length <= 10) {
        // Limit input to 10 digits
        validatePhoneNumber(value); // Validate phone number
        setInput({ ...input, [name]: value }); // Update state
      }
    } else {
      setInput({ ...input, [name]: value }); // Update state for other fields
    }
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const profilePhotoChangeHandler = (e) => {
    const profilePhoto = e.target.files?.[0];
    setInput({ ...input, profilePhoto });
  };

  const skillsChangeHandler = (selectedOptions) => {
    setInput({
      ...input,
      skills: selectedOptions.map((option) => option.value),
    });
  };

  const bioChangeHandler = (selectedOptions) => {
    if (selectedOptions.length > 3) {
      toast.error(t("bioMaxSelection"));
      return;
    }

    const selectedValues = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setInput({ ...input, bio: selectedValues.join(", ") }); // เชื่อมค่าด้วยจุลภาคและเว้นวรรค
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (fullnameError || phoneError) {
      return;
    }

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);
    if (input.file) {
      formData.append("file", input.file);
    }
    if (input.profilePhoto) {
      formData.append("profilePhoto", input.profilePhoto);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(t("profileUpdateSuccess"));
        setOpen(false);
      }
    } catch (error) {
      if (
        error.response?.data?.message === "This phone number is already in use."
      ) {
        setPhoneError(t("phoneAlreadyInUse"));
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(t("unexpectedError"));
      }
      console.error("Error during profile update:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (input.profilePhoto) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(input.profilePhoto);
    } else {
      setPreviewUrl(null);
    }
  }, [input.profilePhoto]);

  return (
    <Dialog open={open}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] h-[90vh] sm:h-auto bg-white rounded-xl shadow-2xl overflow-y-auto">
        <DialogHeader className="top-0 z-50 p-4 bg-white relative">
          <DialogTitle className="text-[#723bcf]  font-bold text-2xl">
            {t("updateProfileTitle")}
          </DialogTitle>
          <Button
            onClick={() => setOpen(false)}
            variant="ghost"
            className="absolute right-2 top-2 rounded-full p-1 w-8 h-8 flex items-center justify-center"
          >
            <X className="h-6 w-6 text-gray-600" />
          </Button>
        </DialogHeader>
        <form onSubmit={submitHandler} className="p-4 space-y-6">
          <div className="flex flex-col gap-4">
            {/* Profile Photo Section */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#723bcf]">
                {previewUrl || user?.profilePhoto ? (
                  <img
                    src={previewUrl || user?.profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#d4d4d4] flex items-center justify-center">
                    <Image className="h-10 w-10 text-[#a6a6a6]" />
                  </div>
                )}
                <label
                  htmlFor="profilePhoto"
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                >
                  <Camera className="h-6 w-6 text-white" />
                </label>
                <Input
                  id="profilePhoto"
                  type="file"
                  name="profilePhoto"
                  onChange={profilePhotoChangeHandler}
                  className="hidden"
                />
              </div>
              <Button
                type="button"
                onClick={() => document.getElementById("profilePhoto").click()}
                className="w-full max-w-xs py-2 px-3 bg-gradient-to-r from-[#723bcf] to-[#723bcf] text-white rounded-md hover:from-[#723bcf] hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#723bcf] transition-colors duration-200 text-sm"
              >
                {t("uploadNewPhoto")}
              </Button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {[
                {
                  id: "fullname",
                  label: t("name"),
                  value: input.fullname,
                },
                {
                  id: "email",
                  label: t("email"),
                  value: input.email,
                  disabled: true,
                },
                {
                  id: "phoneNumber",
                  label: t("phone"),
                  value: input.phoneNumber,
                },
                {
                  id: "bio",
                  label: t("bio"),
                  value: input.bio,
                  isSelect: true,
                  options: bioOptions,
                },
                {
                  id: "skills",
                  label: t("skills"),
                  value: input.skills,
                  isSelect: true,
                  options: skillOptions,
                },
                {
                  id: "file",
                  label: t("resume"),
                  value: input.file,
                  isFile: true,
                },
              ].map(
                ({ id, label, value, disabled, isSelect, options, isFile }) => (
                  <div key={id} className="space-y-2">
                    <label
                      htmlFor={id}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {label}
                    </label>
                    <div className="w-full">
                      {isSelect ? (
                        <Select
                          id={id}
                          name={id}
                          isMulti
                          options={options}
                          value={options.filter((option) =>
                            value.includes(option.value)
                          )}
                          onChange={
                            id === "bio"
                              ? bioChangeHandler
                              : skillsChangeHandler
                          }
                          className="block w-full rounded-md border-gray-400 text-sm"
                          styles={{
                            control: (provided, state) => ({
                              ...provided,
                              borderColor: state.isFocused
                                ? "#723bcf"
                                : "#9CA3AF",
                              borderWidth: "1px",
                              boxShadow: state.isFocused
                                ? "0 0 0 2px rgba(114, 59, 207, 0.2)"
                                : "none",
                              "&:hover": {
                                borderColor: "#723bcf",
                              },
                              paddingLeft: "8px",
                            }),
                            multiValue: (provided) => ({
                              ...provided,
                              backgroundColor: "#f3f0ff",
                              borderRadius: "4px",
                            }),
                            multiValueLabel: (provided) => ({
                              ...provided,
                              color: "#000",
                            }),
                          }}
                        />
                      ) : isFile ? (
                        <Input
                          id={id}
                          type="file"
                          name={id}
                          onChange={fileChangeHandler}
                          className="block py-2 w-full rounded-md border-gray-400 focus:border-[#723bcf] text-sm px-4"
                        />
                      ) : (
                        <Input
                          id={id}
                          name={id}
                          value={value}
                          onChange={changeEventHandler}
                          disabled={disabled}
                          className="block w-full rounded-md border-gray-400 focus:ring-[#723bcf] text-sm px-4"
                        />
                      )}
                    </div>
                    {id === "fullname" && fullnameError && (
                      <p className="text-red-600 text-xs">{fullnameError}</p>
                    )}
                    {id === "phoneNumber" && phoneError && (
                      <p className="text-red-600 text-xs">{phoneError}</p>
                    )}
                  </div>
                )
              )}
            </div>

            <Button
              type="submit"
              className="w-full max-w-xs mx-auto py-2 px-3 bg-gradient-to-r from-[#723bcf] to-[#723bcf] text-white rounded-md hover:from-[#723bcf] hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#723bcf] transition-colors duration-200 text-sm"
              disabled={loading || !!fullnameError}
            >
              {loading ? (
                <Loader2 className="animate-spin h-4 w-4 mx-auto" />
              ) : (
                t("updateProfile")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

UpdateProfile.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default UpdateProfile;
