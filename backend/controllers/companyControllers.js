import { Company } from "../models/company.js";
import { User } from "../models/user.js"; // Import the User model
import getDataUri from "../utils/datauri.js"
import cloudinary from "../utils/cloudinary.js";
// Register a new company
export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;

        // Validate the required fields
        if (!companyName) {
            return res.status(400).json({
                message: "Company name are required.",
                success: false
            });
        }

        // Find the user by user_id (assuming user_id is a number, not ObjectId)
        const userId = Number(req.id); // Convert req.id to number
        const user = await User.findOne({ user_id: userId });
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        // Check if the company name already exists
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register the same company.",
                success: false
            });
        }

        const companyCount = await Company.countDocuments();

        // Create a new company
        company = await Company.create({
            company_id: companyCount + 1, // Incremental company_id
            name: companyName,
            create_ByUserId: user.user_id, // Use user_id (number) instead of ObjectId
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while registering the company.",
            success: false
        });
    }
};


// Get all companies for the logged-in user
export const getCompany = async (req, res) => {
    try {
        // Convert req.id to a number
        const userId = Number(req.id); // Assuming req.id is a number

        // Find the user by user_id (since user_id is a number, not ObjectId)
        const user = await User.findOne({ user_id: userId });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        // Find companies associated with the userId
        const companies = await Company.find({ create_ByUserId: user.user_id });

        // If no companies found
        if (!companies || companies.length === 0) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            });
        }

        return res.status(200).json({
            companies,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while retrieving companies.",
            success: false
        });
    }
};

// Get company by ID
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        // Find company by company_id, not by _id
        const company = await Company.findOne({ company_id: companyId });
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }
        return res.status(200).json({
            company,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred.",
            success: false
        });
    }
};

// Update company information
export const updateCompany = async (req, res) => {
    try {
        const { name, agent_fullname, email, phoneNumber, description, website, location } = req.body;
        
        let updateData = { name, agent_fullname, email, phoneNumber, description, website, location };

        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            updateData.logo = cloudResponse.secure_url;
        }

        const company = await Company.findOneAndUpdate(
            { company_id: req.params.id },
            updateData,
            { new: true }
        );

        if (!company) {
            return res.status(404).json({
                message: "COMPANY_NOT_FOUND",
                success: false
            });
        }

        return res.status(200).json({
            message: "COMPANY_UPDATED_SUCCESSFULLY",
            company,
            success: true
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "INTERNAL_SERVER_ERROR",
            success: false
        });
    }
};

// Delete company by company_id
export const deleteCompany = async (req, res) => {
    try {
        const companyId = req.params.id;

        const company = await Company.findOneAndDelete({ company_id: companyId });

        if (!company) {
            return res.status(404).json({
                message: "COMPANY_NOT_FOUND",
                success: false
            });
        }

        return res.status(200).json({
            message: "COMPANY_DELETED_SUCCESSFULLY",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "ERROR_DELETING_COMPANY",
            success: false
        });
    }
};



