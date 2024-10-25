import express from 'express';
import isAuth from "../middlewares/Auth.js";
import {
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
  markAllNotificationsAsRead,
} from "../controllers/notificationControllers.js";

const router = express.Router();

router.get('/', isAuth, getUserNotifications);
router.put('/:notificationId/read', isAuth, markNotificationAsRead);
router.delete('/:notificationId', isAuth, deleteNotification);
router.put('/mark-all-read', isAuth, markAllNotificationsAsRead);

export default router;
