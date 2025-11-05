import axiosInstance from "./axiosConfig";
import toast from "react-hot-toast";

export const ContactServices = {
  contactList: _contactList,
  contactCreate: _contactCreate,
  contactUpdate: _contactUpdate,
  contactDelete: _contactDelete,
  contactDetail: _contactDetail,
};

const BASE_URL = "contacts";

/**
 * Fetch all contacts
 */
async function _contactList(callBackFun) {
  try {
    const res = await axiosInstance.get(`${BASE_URL}`);
    callBackFun(res?.data);
    toast.success("Contacts fetched successfully");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to fetch contacts");
    callBackFun(false);
  }
}

/**
 * Create a new contact
 */
async function _contactCreate(payload, callBackFun) {
  try {
    const res = await axiosInstance.post(`${BASE_URL}`, payload);
    callBackFun(res?.data);
    toast.success("Contact created successfully");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to create contact");
    callBackFun(false);
  }
}

/**
 * Update contact
 */
async function _contactUpdate(id, payload, callBackFun) {
  try {
    const { id, created_at, updated_at, ...cleanPayload } = payload;
    const res = await axiosInstance.put(`${BASE_URL}/${id}`, cleanPayload);
    callBackFun(res?.data);
    toast.success("Contact updated successfully");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to update contact");
    callBackFun(false);
  }
}

/**
 * Delete contact
 */
async function _contactDelete(id, callBackFun) {
  try {
    const res = await axiosInstance.delete(`${BASE_URL}/delete/${id}`);
    callBackFun(res?.data);
    toast.success("Contact deleted successfully");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to delete contact");
    callBackFun(false);
  }
}

/**
 * Get contact details
 */
async function _contactDetail(id, callBackFun) {
  try {
    const res = await axiosInstance.get(`${BASE_URL}/detail/${id}`);
    callBackFun(res?.data);
    toast.success("Contact details fetched");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Failed to fetch contact details");
    callBackFun(false);
  }
}
