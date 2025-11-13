import axiosInstance from "./axiosConfig";
import toast from "react-hot-toast";

export const GroupServices = {
  groupList: _groupList,
  groupCreate: _groupCreate,
  groupUpdate: _groupUpdate,
  groupDelete: _groupDelete,
  groupDetail: _groupDetail,
};

const BASE_URL = "groups";

/**
 * Fetch all groups
 */
async function _groupList(callBackFun) {
  try {
    const res = await axiosInstance.get(`${BASE_URL}/list`);
    console.log(res?.data?.data || res?.data || []);
    callBackFun(res?.data?.data || []);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to fetch groups",{position:"top-right"});
    callBackFun(false);
  }
}

/**
 * Create a new group
 */
async function _groupCreate(payload, callBackFun) {
  try {
    const res = await axiosInstance.post(`${BASE_URL}/create`, payload);
    callBackFun(res?.data);
    toast.success("Group created successfully",{position:"top-right"});
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to create group",{position:"top-right"});
    callBackFun(false);
  }
}

/**
 * Update group
 */
async function _groupUpdate(id, payload, callBackFun) {
  try {
    const { id, created_at, updated_at, ...cleanPayload } = payload;
    const res = await axiosInstance.put(`${BASE_URL}/${id}`, cleanPayload);
    callBackFun(res?.data);
    toast.success("Group updated successfully",{position:"top-right"});
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to update group",{position:"top-right"});
    callBackFun(false);
  }
}

/**
 * Delete group
 */
async function _groupDelete(id, callBackFun) {
  try {
    const res = await axiosInstance.delete(`${BASE_URL}/delete/${id}`);
    callBackFun(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to delete group",{position:"top-right"});
    callBackFun(false);
  }
}

/**
 * Get group details
 */
async function _groupDetail(id, callBackFun) {
  try {
    const res = await axiosInstance.get(`${BASE_URL}/detail/${id}`);
    callBackFun(res?.data);
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to fetch group details",{position:"top-right"});
    callBackFun(false);
  }
}
