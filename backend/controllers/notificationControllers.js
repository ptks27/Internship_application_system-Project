import { Notification } from '../models/notification.js';
import { User } from '../models/user.js';
import { Job } from '../models/job.js'; // Import Job model
import { Company } from '../models/company.js'; // Import Company model

export const getUserNotifications = async (req, res) => {
  try {
    const userId = Number(req.id);
    const notifications = await Notification.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .lean();

    const formattedNotifications = await Promise.all(notifications.map(async (notification) => {
      let companyName = notification.companyName || null;
      let jobTitle = notification.jobTitle || null;
      if (notification.relatedId && !companyName) {
        const job = await Job.findOne({ job_id: notification.relatedId }).lean();
        if (job) {
          jobTitle = job.title;
          const company = await Company.findOne({ company_id: job.company }).lean();
          companyName = company ? company.name : 'Unknown Company';
        }
      }

      return {
        ...notification,
        companyName,
        jobTitle,
        applyDate: notification.createdAt,
      };
    }));

    return res.status(200).json({
      success: true,
      notifications: formattedNotifications,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = Number(req.id);

    const notification = await Notification.findOneAndUpdate(
      { notification_id: Number(notificationId), user_id: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
        success: false
      });
    }

    return res.status(200).json({
      message: "Notification marked as read",
      notification,
      success: true
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = Number(req.id);

    const notification = await Notification.findOneAndDelete({
      notification_id: Number(notificationId),
      user_id: userId
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
        success: false
      });
    }

    // Remove the notification from the user's notifications array
    await User.findOneAndUpdate(
      { user_id: userId },
      { $pull: { notifications: Number(notificationId) } }
    );

    return res.status(200).json({
      message: "Notification deleted successfully",
      success: true
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = Number(req.id);
    await Notification.updateMany(
      { user_id: userId, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({
      message: "All notifications marked as read",
      success: true
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({
      message: "An error occurred while marking all notifications as read",
      success: false
    });
  }
};
