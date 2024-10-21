import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import logo from "../../assets/logo.png";
import { changeLanguage } from '@/i18n';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

function Navbar2() {
  const { i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLanguageChange = (value) => {
    changeLanguage(value);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="bg-[#f4f4f4] my-3">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 md:px-8">
        {/* Logo */}
        <div className="-ml-4">
          <Link to="/login">
            <img
              src={logo}
              alt="JobPortal Logo"
              className="h-8 w-auto md:h-10"
            />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-black text-2xl">
            ☰
          </button>
        </div>

        {/* Language Select Dropdown */}
        <div>
          <Select onValueChange={handleLanguageChange} defaultValue={i18n.language}>
            <SelectTrigger className="w-[70px] border-none bg-transparent focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder={i18n.language.toUpperCase()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">EN</SelectItem>
              <SelectItem value="th">TH</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[#f4f4f4] z-50">
          <ul className="flex flex-col font-medium items-center gap-4 p-4">
            <li className="w-full max-w-[250px]">
              <Select onValueChange={handleLanguageChange} defaultValue={i18n.language}>
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
    </div>
  );
}

export default Navbar2;
