import express from "express";
import {
  getMyHospitalProfile,
  getAllHospitals,
  updateMyHospitalResources,
  getHospitalBloodBank,
  updateMyHospitalBloodBank,
} from "../controllers/hospital.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  allowRoles("PATIENT", "HOSPITAL_ADMIN", "AMBULANCE_DRIVER"),
  getAllHospitals
);

router.get(
  "/profile/me",
  protect,
  allowRoles("HOSPITAL_ADMIN"),
  getMyHospitalProfile
);

router.put(
  "/resources",
  protect,
  allowRoles("HOSPITAL_ADMIN"),
  updateMyHospitalResources
);

router.get(
  "/:hospitalId/blood-bank",
  protect,
  allowRoles("PATIENT", "HOSPITAL_ADMIN", "AMBULANCE_DRIVER"),
  getHospitalBloodBank
);

router.put(
  "/blood-bank",
  protect,
  allowRoles("HOSPITAL_ADMIN"),
  updateMyHospitalBloodBank
);

export default router;