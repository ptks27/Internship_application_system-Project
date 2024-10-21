import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";

import { Button } from "./ui/button";
import { Mail, PencilLine, Phone } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { useState } from "react";
import UpdateProfile from "./UpdateProfile";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useSelector((store) => store.auth);

  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto bg-[#723bcf] border border-[#723bcf] rounded-2xl my-4 md:my-20 p-4 md:p-20">
        <div className={`flex ${isMobile ? 'flex-col' : 'justify-between'} items-center mb-6`}>
          <div className={`flex ${isMobile ? 'flex-col' : 'items-center'} gap-4`}>
            <Avatar className={`h-24 w-24 ${isMobile ? 'mx-auto mb-4' : 'mr-4 mt-[-25px]'}`}>
              <AvatarImage src={user?.profile.profilePhoto} alt="profile" />
            </Avatar>
            <div className={`${isMobile ? 'text-center' : ''}`}>
              <h1 className="font-bold text-white text-xl my-2">
                {user?.fullname}
              </h1>
              <p className="font-bold text-yellow-500 text-lg">{user?.profile.bio}</p>
            </div>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className={`bg-black border border-black ${isMobile ? 'mt-4' : ''}`}
          >
            <PencilLine className="text-white mr-2" />
            {isMobile && <span className="text-white">{t('updateProfile')}</span>}
          </Button>
        </div>
        <div className="my-6 md:my-10">
          <div className="flex items-center gap-3 my-2">
            <Mail className="text-white" />
            <span className="text-white break-all">{user?.email}</span>
          </div>

          <div className="flex items-center gap-3 my-5">
            <Phone className="text-white" />
            <span className="text-white">{user?.phoneNumber}</span>
          </div>
        </div>
        <div className="my-6 md:my-10">
          <h5 className="text-xl font-bold text-white my-2">{t('skills')}</h5>
          <div className="flex flex-wrap items-center gap-2 my-4">
            {user?.profile.skills && user.profile.skills.length > 0 ? (
              user.profile.skills.map((item, index) => (
                <Badge className="bg-black" key={index}>
                  {item}
                </Badge>
              ))
            ) : (
              <span className="text-white">NA</span>
            )}
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5 my-6 md:my-10">
          <Label className="text-md font-bold text-white my-2">{t('resume')}</Label>
          {user?.profile?.resume ? (
            <a
              target="_blank"
              className="text-[#ff914d] font-medium w-full hover:underline cursor-pointer"
              href={user?.profile?.resume}
            >
              {user?.profile?.resumeOriginalName}
            </a>
          ) : (
            <span className="text-white">NA</span>
          )}
        </div>
        <UpdateProfile open={open} setOpen={setOpen} />
      </div>
    </div>
  );
};

export default Profile;
