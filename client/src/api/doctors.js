import axiosInstance from "@/utils/axiosInstance";
import { headers } from "@/utils/constants";

export const getAllDoctors = async (searchParams, accessToken) => {
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const specialization = searchParams.get("specialization") || "";
  const availability = searchParams.get("availability") || "";
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (query) params.append("query", query);
  if (specialization) params.append("specialization", specialization);
  if (availability) params.append("roomStatus", availability);
  return await axiosInstance.get(
    `/doctors/all?${params.toString()}`,
    headers(accessToken)
  );
};

export const updateDoctor = async ({ doctorId, formData, accessToken }) => {
  return await axiosInstance.patch(
    `/doctors/${doctorId}/update`,
    formData,
    headers(accessToken)
  );
};
