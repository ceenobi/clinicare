import axiosInstance from "@/utils/axiosInstance";
import { headers } from "@/utils/constants";

export const registerUser = async (formData) => {
  return await axiosInstance.post("/auth/create", formData);
};
export const loginUser = async (formData) => {
  return await axiosInstance.post("/auth/login", formData);
};

export const getAuthenticatedUser = async (accessToken) => {
  return await axiosInstance.get("/auth/user", headers(accessToken));
};

export const refreshAccessToken = async () => {
  return await axiosInstance.post("/auth/refresh-token", {
    withCredentials: true, //inject cookie value automatically to the server
  });
};

export const verifyAccount = async ({ verificationToken, accessToken }) => {
  return await axiosInstance.patch(
    "/auth/verify-account",
    { verificationToken },
    headers(accessToken)
  );
};

export const resendVerificationCode = async (accessToken) => {
  return await axiosInstance.post(
    "/auth/resend/verify-token",
    {},
    headers(accessToken)
  );
};

export const forgotPassword = async (email) => {
  return await axiosInstance.post("/auth/forgot-password", email);
};

export const resetPassword = async (userData) => {
  return await axiosInstance.patch(
    `/auth/reset-password?email=${userData.email}&token=${userData.token}`,
    userData
  );
};

export const logout = async (accessToken) => {
  return await axiosInstance.post("/auth/logout", {}, headers(accessToken), {
    withCredentials: true,
  });
};

export const uploadAvatar = async ({ formData, accessToken }) => {
  return await axiosInstance.patch(
    "/auth/upload-avatar",
    formData,
    headers(accessToken)
  );
};

export const updateUserPassword = async ({ userData, accessToken }) => {
  return await axiosInstance.patch(
    "/auth/update-password",
    userData,
    headers(accessToken)
  );
};

export const updateUserProfile = async ({ userData, accessToken }) => {
  return await axiosInstance.patch(
    "/auth/update-user",
    userData,
    headers(accessToken)
  );
};

export const deleteAccount = async (accessToken) => {
  return await axiosInstance.delete(
    "/auth/delete-account",
    headers(accessToken)
  );
};

export const getAllUsers = async (searchParams, accessToken) => {
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const role = searchParams.get("role") || "";
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (query) params.append("query", query);
  if (role) params.append("role", role);
  return await axiosInstance.get(
    `/auth/all?${params.toString()}`,
    headers(accessToken)
  );
};

export const deleteAccountAdmins = async ({ userId, accessToken }) => {
  return await axiosInstance.delete(
    `/auth/${userId}/delete-account`,
    headers(accessToken)
  );
};

export const updateUserRole = async ({ userId, role, accessToken }) => {
  const response = await axiosInstance.patch(
    `/auth/${userId}/update`,
    role,
    headers(accessToken)
  );
  return response.data;
};

export const createUserAdmins = async ({ userData, accessToken }) => {
  return await axiosInstance.post(
    "/auth/create-user",
    userData,
    headers(accessToken)
  );
};
