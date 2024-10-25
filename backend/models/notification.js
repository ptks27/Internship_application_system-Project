import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const AutoIncrement = mongooseSequence(mongoose);

const notificationSchema = new mongoose.Schema({
  notification_id: {
    type: Number,
    unique: true
  },
  user_id: {
    type: Number,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  relatedId: {
    type: Number
  },
  isRead: {
    type: Boolean,
    default: false
  },
  companyName: {
    type: String
  },
  jobTitle: {
    type: String
  },
  companyLogo: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

notificationSchema.plugin(AutoIncrement, { inc_field: 'notification_id' });

export const Notification = mongoose.model('Notification', notificationSchema);
