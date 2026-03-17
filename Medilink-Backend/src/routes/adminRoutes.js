/**
 * routes/adminRoutes.js
 */
import { Router } from 'express';
import { getHospitals, getSystemDoctors, getPatientRequests, assignRequest } from '../controllers/adminController.js';
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';

const router = Router();

// All routes here require ADMIN role
router.use(verifyToken, verifyRole(['admin']));

router.get('/hospitals', getHospitals);
router.get('/system-doctors', getSystemDoctors);
router.get('/patient-requests', getPatientRequests);
router.post('/requests/:requestId/assign', assignRequest);

export default router;
