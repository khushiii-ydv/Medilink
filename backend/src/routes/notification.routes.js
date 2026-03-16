import express from "express";
import {
  getMyNotifications,
  markNotificationAsRead,
} from "../controllers/notification.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  allowRoles("PATIENT", "HOSPITAL_ADMIN", "AMBULANCE_DRIVER"),
  getMyNotifications
);

router.patch(
  "/:notificationId/read",
  protect,
  allowRoles("PATIENT", "HOSPITAL_ADMIN", "AMBULANCE_DRIVER"),
  markNotificationAsRead
);

export default router;