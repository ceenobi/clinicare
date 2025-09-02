import express from "express";
import { verifyAuth, authorizedRoles } from "../middlewares/authenticate.js";
import { validateFormData } from "../middlewares/validateForm.js";
import { validatePatientSchema } from "../utils/dataSchema.js";
import { clearCache, cacheMiddleware } from "../middlewares/cache.js";
import {
  register,
  getPatient,
  getAllPatients,
  updatePatient,
} from "../controllers/patientController.js";

const router = express.Router();

router.post(
  "/register",
  verifyAuth,
  authorizedRoles("admin", "patient"),
  validateFormData(validatePatientSchema),
  clearCache("auth_user"),
  register
);

router.get(
  "/all",
  verifyAuth,
  authorizedRoles("admin", "doctor", "staff", "nurse"),
  cacheMiddleware("patients", 3600),
  getAllPatients
);

router.get("/me", verifyAuth, cacheMiddleware("patient", 3600), getPatient);

router.patch(
  "/:id/update",
  verifyAuth,
  authorizedRoles("admin", "patient"),
  validateFormData(validatePatientSchema),
  clearCache("patient"),
  updatePatient
);

export default router;
