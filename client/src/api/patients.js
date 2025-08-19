import axiosInstance from "@/utils/axiosInstance";
import { headers } from "@/utils/constants";

export const registerPatient = async ({ formData, accessToken }) => {
  return await axiosInstance.post(
    "/patients/register",
    formData,
    headers(accessToken)
  );
};

export const getAllPatients = async (searchParams, accessToken) => {
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const gender = searchParams.get("gender") || "";
  const bloodGroup = searchParams.get("bloodGroup") || "";
  const response = await axiosInstance.get(
    `/patients/all?page=${page}&limit=${limit}&query=${query}&gender=${gender}&bloodGroup=${bloodGroup}`,
    headers(accessToken)
  );
  return response.data;
};
