import { v2 as cloudinary } from "cloudinary";

// ตั้งค่าตัวแปรตรง ๆ แทนการใช้ dotenv
const cloudinaryConfig = {
  cloud_name: "dj0edatgb", // กรอกค่า cloud_name
  api_key: "222133532625922", // กรอกค่า api_key
  api_secret: "fF_s_bkVVw7xrkjO_c8gz3a_fQ8", // กรอกค่า api_secret
};

cloudinary.config(cloudinaryConfig);

export default cloudinary;
