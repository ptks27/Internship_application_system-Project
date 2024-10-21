import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence'; // เพิ่ม mongoose-sequence

const AutoIncrement = mongooseSequence(mongoose); // เรียกใช้งานปลั๊กอิน

const jobSchema = new mongoose.Schema({
    job_id: {
        type: Number,
        unique: true // ให้ job_id ไม่ซ้ำกัน
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    experienceLevel: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Hybrid', 'Internship'], // Add enum for jobType
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    company: {
        type: Number,
        ref: 'Company',
        required: true
    },
    created_by_UserId: {
        type: Number,
        ref: 'User',
        required: true
    },
    applications: [
        {
            type: Number,
            ref: 'Application',
        }
    ],
    bookmarkedBy: [ // Add bookmarkedBy field
        {
            type: Number,
            ref: 'User'
        }
    ]
}, { timestamps: true });

// ใช้ปลั๊กอินเพื่อสร้าง auto-increment บนฟิลด์ `job_id`
jobSchema.plugin(AutoIncrement, { inc_field: 'job_id' });

export const Job = mongoose.model("Job", jobSchema);