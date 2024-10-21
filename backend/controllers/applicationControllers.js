import { Application } from "../models/application.js";
import { Job } from "../models/job.js";
import { Company } from "../models/company.js";
import { User } from "../models/user.js";

export const applyJob = async (req, res) => {
    try {
        const userId = Number(req.id); // Convert to number
        const jobId = Number(req.params.id); // Convert to number
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            });
        }

        // Check if the user has already applied for the job
        const existingApplication = await Application.findOne({ create_ByJobId: jobId, applicant: userId });
        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            });
        }

        // Check if the job exists
        const job = await Job.findOne({ job_id: jobId });
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        const applicationCount = await Application.countDocuments();

        // Create a new application
        const newApplication = await Application.create({
            application_id : applicationCount + 1,
            create_ByJobId: jobId,
            applicant: userId,
        });

        job.applications.push(newApplication.application_id); // ใช้ application_id
        await job.save();

        return res.status(201).json({
            message: "Job applied successfully.",
            success: true,
            jobTitle: job.title  // Include the job title in the response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while applying for the job.",
            success: false
        });
    }
};
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = Number(req.id); // Convert to number

        // Find all applications for the current user
        const applications = await Application.find({ applicant: userId }).sort({ createdAt: -1 });

        if (!applications.length) {
            return res.status(404).json({
                message: "No applications found.",
                success: false
            });
        }

        const applicationDetails = await Promise.all(applications.map(async (application) => {
            const job = await Job.findOne({ job_id: application.create_ByJobId });
            if (job) {
                const company = await Company.findOne({ company_id: job.company });
                return {
                    ...application._doc,
                    create_ByJobId: { 
                        ...job._doc, 
                        company: {
                            ...company._doc,
                            logo: company.logo // Include the company logo
                        } 
                    }
                };
            } else {
                return { ...application._doc, create_ByJobId: null };
            }
        }));

        return res.status(200).json({
            applications: applicationDetails,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
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
                message: 'Job not found.',
                success: false
            });
        }

        const applications = await Application.find({ create_ByJobId: jobId }).sort({ createdAt: -1 });

        if (!applications.length) {
            return res.status(404).json({
                message: "No applications found for this job.",
                success: false
            });
        }

        const applicantsDetails = await Promise.all(applications.map(async (application) => {
            const applicant = await User.findOne({ user_id: application.applicant });
            if (!applicant) {
                // If the user has been deleted, return a placeholder object
                return {
                    application_id: application.application_id,
                    status: application.status,
                    createdAt: application.createdAt,
                    applicant: {
                        fullname: 'Deleted User',
                        email: 'N/A',
                        phoneNumber: 'N/A',
                        profile: {
                            resume: null,
                            resumeOriginalName: null
                        }
                    }
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
                        resumeOriginalName: applicant.profile?.resumeOriginalName
                    }
                }
            };
        }));

        return res.status(200).json({
            create_ByJobId: {
                ...job._doc,
                applications: applicantsDetails
            },
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = Number(req.params.id); // Convert to number
        if (isNaN(applicationId)) { // Check if applicationId is NaN
            return res.status(400).json({
                message: 'Invalid application ID.',
                success: false
            });
        }
        if (!status) {
            return res.status(400).json({
                message: 'Status is required.',
                success: false
            });
        }

        // Find the application by application_id
        const application = await Application.findOne({ application_id: applicationId });
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        // Update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message: "Status updated successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};