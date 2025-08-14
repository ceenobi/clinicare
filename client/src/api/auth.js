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
