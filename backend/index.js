import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/userRoute.js";
import companyRoute from "./routes/companyRoute.js";
import jobRoute from "./routes/jobRoute.js";
import applicationRoute from "./routes/applicationRoute.js";
import notificationRoute from "./routes/notificationRoute.js";

dotenv.config({});

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? "https://thetraineepj.in.th"
    : "http://localhost:5173",
  credentials: true,
  secure: process.env.NODE_ENV === 'production'
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 4000;

// api
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/notifications", notificationRoute); // Note the plural 'notifications'

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running at port ${PORT}`);
});
