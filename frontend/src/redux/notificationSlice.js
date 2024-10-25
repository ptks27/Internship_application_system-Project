import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.isRead).length;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.notification_id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount -= 1;
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.notification_id !== action.payload);
      state.unreadCount = state.notifications.filter(n => !n.isRead).length;
    },
    updateNotification: (state, action) => {
      const index = state.notifications.findIndex(n => n.notification_id === action.payload.notification_id);
      if (index !== -1) {
        state.notifications[index] = { ...state.notifications[index], ...action.payload };
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.isRead = true;
      });
      state.unreadCount = 0;
    },
  },
});

export const { setNotifications, addNotification, markAsRead, removeNotification, updateNotification, markAllAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;
