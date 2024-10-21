import express from "express";
import isAuth from "../middlewares/Auth.js";
import { deleteCompany, getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/companyControllers.js";
import { singleUpload } from "../middlewares/Multer.js";

const router = express.Router()

router.route("/register").post(isAuth,registerCompany);
router.route("/get").get(isAuth,getCompany);
router.route("/get/:id").get(isAuth,getCompanyById)
router.route("/update/:id").put(isAuth ,singleUpload,updateCompany);
router.route("/delete/:id").delete(isAuth ,deleteCompany);

export default router;