import express from "express";
import {
  registerPatient,
  registerHospital,
  registerAmbulance,
  loginUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register/patient", registerPatient);
router.post("/register/hospital", registerHospital);
router.post("/register/ambulance", registerAmbulance);
router.post("/login", loginUser);

export default router;