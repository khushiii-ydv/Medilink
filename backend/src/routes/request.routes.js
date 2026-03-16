import express from "express";
import {
  createAdmissionRequest,
  getMyAdmissionRequests,
  updateAdmissionRequestStatus,
  getHospitalAdmissionRequests,
  createAmbulanceRequest,
  getMyAmbulanceRequests,
  updateAmbulanceRequestStatus,
  createHospitalTransferRequest,
  getMySentTransferRequests,
  getMyReceivedTransferRequests,
  updateHospitalTransferRequestStatus,
} from "../controllers/request.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/admission",
  protect,
  allowRoles("PATIENT"),
  createAdmissionRequest
);

router.get(
  "/my-admissions",
  protect,
  allowRoles("PATIENT"),
  getMyAdmissionRequests
);

router.patch(
  "/admission/:requestId/status",
  protect,
  allowRoles("HOSPITAL_ADMIN"),
  updateAdmissionRequestStatus
);

router.get(
  "/hospital-admissions",
  protect,
  allowRoles("HOSPITAL_ADMIN"),
  getHospitalAdmissionRequests
);

router.post(
  "/ambulance",
  protect,
  allowRoles("PATIENT"),
  createAmbulanceRequest
);

router.get(
  "/my-ambulance-requests",
  protect,
  allowRoles("PATIENT"),
  getMyAmbulanceRequests
);

router.patch(
  "/ambulance/:requestId/status",
  protect,
  allowRoles("AMBULANCE_DRIVER"),
  updateAmbulanceRequestStatus
);

router.post(
  "/hospital-transfer",
  protect,
  allowRoles("HOSPITAL_ADMIN"),
  createHospitalTransferRequest
);

router.get(
  "/my-sent-transfers",
  protect,
  allowRoles("HOSPITAL_ADMIN"),
  getMySentTransferRequests
);

router.get(
  "/my-received-transfers",
  protect,
  allowRoles("HOSPITAL_ADMIN"),
  getMyReceivedTransferRequests
);

router.patch(
  "/hospital-transfer/:requestId/status",
  protect,
  allowRoles("HOSPITAL_ADMIN"),
  updateHospitalTransferRequestStatus
);

export default router;