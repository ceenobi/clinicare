import axiosInstance from "@/utils/axiosInstance";
import { headers } from "@/utils/constants";

export const getPatientStats = async (accessToken) => {
  return await axiosInstance.get("/dashboard/patient", headers(accessToken));
};

export const getAllStats = async (accessToken) => {
  return await axiosInstance.get("/dashboard/stats", headers(accessToken));
};
