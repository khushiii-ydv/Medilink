import express from "express";
import { getPatientProfile } from "../controllers/patient.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get(
  "/profile",
  protect,
  allowRoles("PATIENT"),
  getPatientProfile
);

export default router;