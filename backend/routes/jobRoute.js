import express from "express";
import isAuth from "../middlewares/Auth.js";
import {
  deleteJob,
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
  updateJob,
  toggleBookmark,
  getJobSuggestions,
} from "../controllers/jobControllers.js";

const router = express.Router();

router.route("/post").post(isAuth, postJob);
router.route("/getall").get(isAuth, getAllJobs);
router.route("/getjob/:id").get(isAuth, getJobById);
router.route("/getadmin").get(isAuth, getAdminJobs);
router.route("/updatejob/:id").put(isAuth, updateJob);
router.route("/deletejob/:id").delete(isAuth, deleteJob);
router.route("/toggle-bookmark/:id").post(isAuth, toggleBookmark);
router.route("/suggestions").get(isAuth, getJobSuggestions);

export default router;
