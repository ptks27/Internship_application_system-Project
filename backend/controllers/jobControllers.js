import { Job } from "../models/job.js";
import { Company } from "../models/company.js";
import { User } from "../models/user.js";
import { Application } from "../models/application.js";
const allowedJobTypes = ["Full-time", "Part-time", "Hybrid", "Internship"];

export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    const userId = Number(req.id); // Convert req.id to a number

    // Check for missing or invalid fields
    if (
      !title ||
      !description ||
      !salary ||
      !location ||
      !jobType ||
      experience == null ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "FILL_INFORMATION_COMPLETELY",
        success: false,
      });
    }

    // Check if userId is a valid number
    if (isNaN(userId)) {
      return res.status(400).json({
        message: "INVALID_USER_ID",
        success: false,
      });
    }

    // Check if companyId is a valid number
    const companyIdNumber = Number(companyId);
    if (isNaN(companyIdNumber)) {
      return res.status(400).json({
        message: "INVALID_COMPANY_ID",
        success: false,
      });
    }

    // Validate jobType
    if (!allowedJobTypes.includes(jobType)) {
      return res.status(400).json({
        message: "INVALID_JOB_TYPE",
        success: false,
      });
    }

    const JobCount = await Job.countDocuments();

    const job = await Job.create({
      job_id: JobCount + 1,
      title,
      description,
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: Number(experience),
      position: Number(position),
      company: companyIdNumber, // Use the converted number
      created_by_UserId: userId, // Ensure userId is a number
    });

    return res.status(201).json({
      message: "JOB_CREATED_SUCCESSFULLY",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    // Build query based on keyword
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    // Fetch jobs from the database and sort by creation date
    const jobs = await Job.find(query).sort({ createdAt: -1 });

    if (jobs.length === 0) {
      return res.status(200).json({
        message: "No jobs found",
        jobs: [],
        success: true,
      });
    }

    // Check if the user is authenticated (req.id will only be available if logged in)
    const userId = req.id ? Number(req.id) : null;

    const jobsWithCompany = await Promise.all(
      jobs.map(async (job) => {
        const company = await Company.findOne({ company_id: job.company });

        // If user is logged in, check for bookmark status, otherwise skip it
        return {
          ...job.toObject(),
          company: company || null,
          isBookmarked: userId ? job.bookmarkedBy.includes(userId) : false, // false if not logged in
        };
      })
    );

    // If the user is logged in, sort jobs to show bookmarked jobs first
    if (userId) {
      jobsWithCompany.sort(
        (a, b) => (b.isBookmarked ? 1 : 0) - (a.isBookmarked ? 1 : 0)
      );
    }

    return res.status(200).json({
      jobs: jobsWithCompany,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์.",
      success: false,
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const jobId = Number(req.params.id); // ให้แน่ใจว่า jobId เป็นหมายเลข
    const userId = Number(req.id); // ดึง user id จาก token ที่ authenticate

    // ดึงงานโดย job_id
    const job = await Job.findOne({ job_id: jobId });

    if (!job) {
      return res.status(404).json({
        message: "ไม่พบงาน.",
        success: false,
      });
    }

    // ใช้ Promise.all เพื่อดึงข้อมูลใบสมัครและบริษัทพร้อมกัน
    const [applications, company] = await Promise.all([
      Application.find({ create_ByJobId: jobId }),
      Company.findOne({ company_id: job.company }),
    ]);

    // ตรวจสอบว่าผู้ใช้สมัครงานนี้แล้วหรือไม่
    const userHasApplied = applications.some(
      (application) => application.applicant === userId
    );

    return res.status(200).json({
      job: {
        ...job.toObject(),
        applications: applications, // รวมใบสมัครที่นี่
        company: company || null, // หากไม่พบ ให้ตั้งค่าเป็น null
        userHasApplied: userHasApplied, // ส่งค่ากลับไปว่า user สมัครแล้วหรือยัง
      },
      success: true,
    });
  } catch (error) {
    console.error(error); // ใช้ console.error สำหรับการล็อกข้อผิดพลาด
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์.",
      success: false,
    });
  }
};

export const getAdminJobs = async (req, res) => {
  try {
    const adminId = Number(req.id);

    const jobs = await Job.find({ created_by_UserId: adminId }).sort({
      createdAt: -1,
    });

    if (!jobs.length) {
      return res.status(404).json({
        message: "No jobs found.",
        success: false,
      });
    }

    const companyIds = jobs.map((job) => job.company);
    const companies = await Company.find({ company_id: { $in: companyIds } });

    const jobsWithCompanyDetails = jobs.map((job) => {
      const company = companies.find((comp) => comp.company_id === job.company);
      return {
        ...job.toObject(),
        company: company
          ? {
              name: company.name,
              logo: company.logo,
            }
          : { name: "Unknown Company", logo: null },
      };
    });

    return res.status(200).json({
      jobs: jobsWithCompanyDetails,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

// Update job details without ObjectId
export const updateJob = async (req, res) => {
  try {
    const jobId = Number(req.params.id);
    const updates = req.body;
    const userId = Number(req.id);

    if (updates.experience !== undefined) {
      updates.experienceLevel = Number(updates.experience);
      delete updates.experience;
    }

    const job = await Job.findOneAndUpdate(
      { job_id: jobId, created_by_UserId: userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({
        message: "JOB_NOT_FOUND_OR_NO_PERMISSION",
        success: false,
      });
    }

    return res.status(200).json({
      message: "JOB_UPDATED_SUCCESSFULLY",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "INTERNAL_SERVER_ERROR",
      success: false,
    });
  }
};

// Delete a job without ObjectId
export const deleteJob = async (req, res) => {
  try {
    const jobId = Number(req.params.id);
    const userId = Number(req.id);

    const job = await Job.findOneAndDelete({
      job_id: jobId,
      created_by_UserId: userId,
    });

    if (!job) {
      return res.status(404).json({
        message: "JOB_NOT_FOUND_OR_NO_PERMISSION",
        success: false,
      });
    }

    return res.status(200).json({
      message: "JOB_DELETED_SUCCESSFULLY",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "INTERNAL_SERVER_ERROR",
      success: false,
    });
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const jobId = Number(req.params.id);
    const userId = Number(req.id);

    const job = await Job.findOne({ job_id: jobId });

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    const isBookmarked = job.bookmarkedBy.includes(userId);

    if (isBookmarked) {
      job.bookmarkedBy = job.bookmarkedBy.filter((id) => id !== userId);
    } else {
      job.bookmarkedBy.push(userId);
    }

    await job.save();

    return res.status(200).json({
      message: isBookmarked ? "Bookmark removed." : "Job bookmarked.",
      isBookmarked: !isBookmarked,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

export const getJobSuggestions = async (req, res) => {
  try {
    const query = req.query.query || "";

    // Fetch job titles that match the query
    const suggestions = await Job.find(
      { title: { $regex: query, $options: "i" } },
      { title: 1, _id: 0 } // Only return the title field
    ).limit(10); // Limit the number of suggestions

    const suggestionTitles = suggestions.map((job) => job.title);

    return res.status(200).json({
      success: true,
      suggestions: suggestionTitles,
    });
  } catch (error) {
    console.error("Error fetching job suggestions:", error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};
