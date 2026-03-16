import express from "express";
import {
  getMyAmbulanceProfile,
  getAvailableAmbulances,
  updateMyAmbulanceLocation,
} from "../controllers/ambulance.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get(
  "/profile/me",
  protect,
  allowRoles("AMBULANCE_DRIVER"),
  getMyAmbulanceProfile
);

router.get(
  "/available",
  protect,
  allowRoles("PATIENT", "HOSPITAL_ADMIN", "AMBULANCE_DRIVER"),
  getAvailableAmbulances
);

router.patch(
  "/location",
  protect,
  allowRoles("AMBULANCE_DRIVER"),
  updateMyAmbulanceLocation
);

export default router;