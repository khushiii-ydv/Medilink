/**
 * routes/doctorRoutes.js
 */
import { Router } from 'express';
import { getAssignedRequests, resolveRequest } from '../controllers/doctorController.js';
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';

const router = Router();

// All routes here require DOCTOR role
router.use(verifyToken, verifyRole(['doctor']));

router.get('/assigned-requests', getAssignedRequests);
router.put('/requests/:requestId/resolve', resolveRequest);

export default router;
