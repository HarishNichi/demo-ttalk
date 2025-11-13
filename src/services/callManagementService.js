import axiosInstance from "./axiosConfig";
import toast from "react-hot-toast";

export const CallManagementServices = {
  initiateCall: _initiateCall,
};

const BASE_URL = "calls";

/**
 * Initiate a call
 */
async function _initiateCall(payload, callBackFun) {
  try {
    const res = await axiosInstance.post(`${BASE_URL}/initiate`, payload);
    callBackFun(res);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to initiate call",{position:"top-right"});
    callBackFun(false);
  }
}