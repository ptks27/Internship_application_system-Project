import { Application } from "../models/application.js";
import { Job } from "../models/job.js";
import { Company } from "../models/company.js";
import { User } from "../models/user.js";
import { Notification } from "../models/notification.js";

export const applyJob = async (req, res) => {
  try {
    const userId = Number(req.id); // Convert to number
    const jobId = Number(req.params.id); // Convert to number
    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required.",
        success: false,
      });
    }

    // Check if the user has already applied for the job
    const existingApplication = await Application.findOne({
      create_ByJobId: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    // Check if the job exists
    const job = await Job.findOne({ job_id: jobId });
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    const applicationCount = await Application.countDocuments();

    // Create a new application
    const newApplication = await Application.create({
      application_id: applicationCount + 1,
      create_ByJobId: jobId,
      applicant: userId,
    });

    job.applications.push(newApplication.application_id);
    await job.save();

    // สร้างการแจ้งเตือนใหม่สำหรับผู้สมัคร
    const notificationForApplicant = await Notification.create({
      user_id: userId,
      message: `You have applied for the job: ${job.title}`,
      type: "job_application",
      relatedId: job.job_id,
    });

    // เพิ่มการแจ้งเตือนให้กับผู้สมัคร
    await User.findOneAndUpdate(
      { user_id: userId },
      { $push: { notifications: notificationForApplicant.notification_id } }
    );

    // สร้างการแจ้งเตือนใหม่สำหรับ agent
    const company = await Company.findOne({ company_id: job.company });
    if (company) {
      const agent = await User.findOne({
        user_id: company.create_ByUserId,
        role: "agent",
      });
      if (agent) {
        const notificationForAgent = await Notification.create({
          user_id: agent.user_id,
          message: `A new application has been received for the job: ${job.title}`,
          type: "new_application",
          relatedId: newApplication.application_id,
        });

        // เพิ่มการแจ้งเตือนให้กับ agent
        await User.findOneAndUpdate(
          { user_id: agent.user_id },
          { $push: { notifications: notificationForAgent.notification_id } }
        );
      }
    }

    return res.status(201).json({
      message: "Job applied successfully.",
      success: true,
      jobTitle: job.title,
      notification: notificationForApplicant, // ส่งกลับข้อมูลการแจ้งเตือนสำหรับผู้สมัคร
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while applying for the job.",
      success: false,
    });
  }
};
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = Number(req.id); // Convert to number

    // Find all applications for the current user
    const applications = await Application.find({ applicant: userId }).sort({
      createdAt: -1,
    });

    if (!applications.length) {
      return res.status(404).json({
        message: "No applications found.",
        success: false,
      });
    }

    const applicationDetails = await Promise.all(
      applications.map(async (application) => {
        const job = await Job.findOne({ job_id: application.create_ByJobId });
        if (job) {
          const company = await Company.findOne({ company_id: job.company });
          return {
            ...application._doc,
            create_ByJobId: {
              ...job._doc,
              company: {
                ...company._doc,
                logo: company.logo, // Include the company logo
              },
            },
          };
        } else {
          return { ...application._doc, create_ByJobId: null };
        }
      })
    );

    return res.status(200).json({
      applications: applicationDetails,
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

// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req, res) => {
  try {
    const jobId = Number(req.params.id);

    const job = await Job.findOne({ job_id: jobId });
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    const applications = await Application.find({ create_ByJobId: jobId }).sort(
      { createdAt: -1 }
    );

    if (!applications.length) {
      return res.status(404).json({
        message: "No applications found for this job.",
        success: false,
      });
    }

    const applicantsDetails = await Promise.all(
      applications.map(async (application) => {
        const applicant = await User.findOne({
          user_id: application.applicant,
        });
        if (!applicant) {
          // If the user has been deleted, return a placeholder object
          return {
            application_id: application.application_id,
            status: application.status,
            createdAt: application.createdAt,
            applicant: {
              fullname: "Deleted User",
              email: "N/A",
              phoneNumber: "N/A",
              profile: {
                resume: null,
                resumeOriginalName: null,
              },
            },
          };
        }
        return {
          application_id: application.application_id,
          status: application.status,
          createdAt: application.createdAt,
          applicant: {
            fullname: applicant.fullname,
            email: applicant.email,
            phoneNumber: applicant.phoneNumber,
            profile: {
              resume: applicant.profile?.resume,
              resumeOriginalName: applicant.profile?.resumeOriginalName,
            },
          },
        };
      })
    );

    return res.status(200).json({
      create_ByJobId: {
        ...job._doc,
        applications: applicantsDetails,
      },
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

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = Number(req.params.id);
    if (isNaN(applicationId)) {
      return res.status(400).json({
        message: "Invalid application ID.",
        success: false,
      });
    }
    if (!status) {
      return res.status(400).json({
        message: "Status is required.",
        success: false,
      });
    }

    // Find the application by application_id
    const application = await Application.findOne({
      application_id: applicationId,
    });
    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    // Update the status
    application.status = status.toLowerCase();
    await application.save();

    // Find the related job
    const job = await Job.findOne({ job_id: application.create_ByJobId });

    // Create a notification for the applicant
    const notificationForApplicant = await Notification.create({
      user_id: application.applicant,
      message: `${job.title} position has been ${status}`,
      type: "application_status_update",
      relatedId: application.application_id,
    });

    // Add the notification to the applicant's notifications
    await User.findOneAndUpdate(
      { user_id: application.applicant },
      { $push: { notifications: notificationForApplicant.notification_id } }
    );

    return res.status(200).json({
      message: "Status updated successfully.",
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

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id: applicationId } = req.params;

    // Find the application
    const application = await Application.findOne({
      application_id: applicationId,
    });
    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    // Update the status
    application.status = status.toLowerCase();
    await application.save();

    // Find the related job
    const job = await Job.findOne({ job_id: application.create_ByJobId });
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false,
      });
    }

    // Find the company
    const company = await Company.findOne({ company_id: job.company });
    const companyName = company ? company.name : "Unknown Company";

    // Get the next notification_id
    const lastNotification = await Notification.findOne().sort(
      "-notification_id"
    );
    const nextNotificationId = lastNotification
      ? lastNotification.notification_id + 1
      : 1;

    // Create a notification for the applicant
    const notificationForApplicant = await Notification.create({
      notification_id: nextNotificationId,
      user_id: application.applicant,
      message: `Your application for ${job.title} position has been ${status}`,
      type: "application_status_update",
      relatedId: application.application_id,
      companyName: companyName, // Ensure companyName is included
      jobTitle: job.title,
    });

    // Add the notification to the applicant's notifications
    await User.findOneAndUpdate(
      { user_id: application.applicant },
      { $push: { notifications: notificationForApplicant.notification_id } }
    );

    return res.status(200).json({
      message: "Status updated successfully.",
      success: true,
      notification: notificationForApplicant,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};
