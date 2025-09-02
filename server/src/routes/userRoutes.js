import express from "express";
import {
  register,
  login,
  authenticateUser,
  refreshAccessToken,
  verifyUserAccount,
  resendVerificationToken,
  forgotPassword,
  resetPassword,
  logout,
  uploadAvatar,
  updateUserPassword,
  updateUser,
  deleteAccount,
  getAllUsers,
  deleteAccountAdmins,
  updateUserRole,
  createUserAdmins,
} from "../controllers/userController.js";
import { validateFormData } from "../middlewares/validateForm.js";
import {
  validateSignUpSchema,
  validateSignInSchema,
  validateAccountSchema,
  forgotPasswordSchema,
  validateResetPasswordSchema,
  updatePasswordSchema,
  validateUserSchema,
  validateUpdateUserRoleSchema,
} from "../utils/dataSchema.js";
import { verifyAuth, authorizedRoles } from "../middlewares/authenticate.js";
import { rateLimiter, refreshTokenLimit } from "../middlewares/rateLimit.js";
import { cacheMiddleware, clearCache } from "../middlewares/cache.js";

const router = express.Router();

router.post("/create", validateFormData(validateSignUpSchema), register);
router.post(
  "/login",
  rateLimiter,
  validateFormData(validateSignInSchema),
  login
);

router.get(
  "/user",
  verifyAuth,
  cacheMiddleware("auth_user", 3600),
  authenticateUser
);

router.post("/refresh-token", refreshAccessToken);

router.patch(
  "/verify-account",
  rateLimiter,
  verifyAuth,
  validateFormData(validateAccountSchema),
  clearCache("auth_user"),
  verifyUserAccount
);

router.post(
  "/resend/verify-token",
  rateLimiter,
  verifyAuth,
  resendVerificationToken
);

router.post(
  "/forgot-password",
  rateLimiter,
  validateFormData(forgotPasswordSchema),
  forgotPassword
);

router.patch(
  "/reset-password",
  rateLimiter,
  validateFormData(validateResetPasswordSchema),
  resetPassword
);

router.post("/logout", verifyAuth, clearCache("auth_user"), logout);
router.patch(
  "/upload-avatar",
  verifyAuth,
  clearCache("auth_user"),
  uploadAvatar
);

router.patch(
  "/update-password",
  rateLimiter,
  verifyAuth,
  validateFormData(updatePasswordSchema),
  clearCache("auth_user"),
  updateUserPassword
);

router.patch(
  "/update-user",
  verifyAuth,
  validateFormData(validateUserSchema),
  clearCache("auth_user"),
  updateUser
);

router.delete(
  "/delete-account",
  verifyAuth,
  clearCache("auth_user"),
  deleteAccount
);

router.get(
  "/all",
  verifyAuth,
  authorizedRoles("admin", "doctor", "staff", "nurse"),
  cacheMiddleware("users", 3600),
  getAllUsers
);

router.delete(
  "/:id/delete-account",
  verifyAuth,
  authorizedRoles("admin"),
  clearCache("users"),
  deleteAccountAdmins
);

router.patch(
  "/:id/update",
  verifyAuth,
  authorizedRoles("admin"),
  validateFormData(validateUpdateUserRoleSchema),
  clearCache("users"),
  updateUserRole
);

router.post(
  "/create-user",
  verifyAuth,
  authorizedRoles("admin"),
  validateFormData(validateSignUpSchema),
  clearCache("users"),
  createUserAdmins
);

export default router;
