import mongoose from "mongoose";
import mongooseSequence from 'mongoose-sequence'; // Import the auto-increment plugin

const AutoIncrement = mongooseSequence(mongoose);

const applicationSchema = new mongoose.Schema({
    application_id: {
        type: Number,
        unique: true
    },
    create_ByJobId: {
        type: Number,
        ref: 'Job', // Referencing the job_id field in Job schema
        required: true
    },
    jobTitle: {  // Add this field
        type: String
    },
    applicant: {
        type: Number,
        ref: 'User', // Referencing the user_id field in User schema
        required: true
    },
    applicantName: {  // Add this field
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

// Apply auto-increment for the application_id
applicationSchema.plugin(AutoIncrement, { inc_field: 'application_id' });

export const Application = mongoose.model("Application", applicationSchema);
