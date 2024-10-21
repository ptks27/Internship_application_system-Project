import mongoose from "mongoose";
import mongooseSequence from 'mongoose-sequence'; // Import the plugin

const AutoIncrement = mongooseSequence(mongoose); // Initialize the auto-increment plugin

const companySchema = new mongoose.Schema({
    company_id: {
        type: Number,
        unique: true // Ensuring the company_id is unique
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    agent_fullname: {
        type: String,
        
    },
    email: {
        type: String,
        
    },
    phoneNumber: {
        type: String,
        
    },
    description: {
        type: String,
        
    },
    website: {
        type: String
    },
    location: {
        type: String,
        
    },
    logo: {
        type: String // URL to company logo
    },
    create_ByUserId: {
        type: Number,
        ref: 'User',
        required: true
    },
}, { timestamps: true });

// Apply the auto-increment plugin to the companySchema for the `company_id` field
companySchema.plugin(AutoIncrement, { inc_field: 'company_id' });

export const Company = mongoose.model("Company", companySchema);
