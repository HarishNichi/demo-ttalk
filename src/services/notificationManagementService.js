import axiosInstance from "./axiosConfig";
import toast from "react-hot-toast";

export const notificationManagementServices = {
  sendNotification: _sendNotification,
};

const BASE_URL = "notification";

/**
 * Send a notification
 */
async function _sendNotification(payload, callBackFun) {
  try {
    const res = await axiosInstance.post(`${BASE_URL}/send`, payload);
    callBackFun(res);
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message || "Failed to send notification",{position:"top-right"});
    callBackFun(false);
  }
}