import express from "express";
import { verifyAuth, authorizedRoles } from "../middlewares/authenticate.js";
import { validateFormData } from "../middlewares/validateForm.js";
import { cacheMiddleware, clearCache } from "../middlewares/cache.js";
import {
  getAllDoctors,
  updateDoctor,
} from "../controllers/doctorController.js";
import { validateDoctorAvailabilitySchema } from "../utils/dataSchema.js";

const router = express.Router();

router.get(
  "/all",
  verifyAuth,
  authorizedRoles("admin", "doctor", "nurse", "staff"),
  cacheMiddleware("doctors", 3600),
  getAllDoctors
);

router.patch(
  "/:id/update",
  verifyAuth,
  authorizedRoles("admin"),
  validateFormData(validateDoctorAvailabilitySchema),
  clearCache("doctors"),
  updateDoctor
);

export default router;
