import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { NOTIFICATION_API } from "../components/utils/constant";
import { setNotifications } from "../redux/notificationSlice";

const useNotifications = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          const response = await axios.get(NOTIFICATION_API, {
            withCredentials: true,
          });
          if (response.data.success) {
            dispatch(setNotifications(response.data.notifications || []));
          } else {
            console.error(
              "Failed to fetch notifications:",
              response.data.message
            );
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
          // If there's an error (like 404), set notifications to an empty array
          dispatch(setNotifications([]));
        }
      }
    };

    fetchNotifications();
    // You can add a polling mechanism here if you want to fetch notifications periodically
  }, [dispatch, user]);
};

export default useNotifications;
