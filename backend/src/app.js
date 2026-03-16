import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import hospitalRoutes from "./routes/hospital.routes.js";
import ambulanceRoutes from "./routes/ambulance.routes.js";
import requestRoutes from "./routes/request.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "MediLink backend running",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/patients", patientRoutes);
app.use("/api/v1/hospitals", hospitalRoutes);
app.use("/api/v1/ambulances", ambulanceRoutes);
app.use("/api/v1/requests", requestRoutes);
app.use("/api/v1/notifications", notificationRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;