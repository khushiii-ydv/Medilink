/**
 * routes/hospitalRoutes.js
 * All Hospital Dashboard routes.
 * Base path: /api/hospital  (and /api/hospitals for listing)
 */
import { Router } from 'express';
import {
  listHospitals,
  createHospital,
  getHospital,
  updateHospital,
  getHospitalResources,
  updateHospitalResources,
  updateBloodBank,
  getDashboardSummary,
  addSpecialist,
  updateSpecialist,
  deleteSpecialist,
} from '../controllers/hospitalController.js';
import { login } from '../controllers/authController.js';
import { validateRequired } from '../middleware/validate.js';
import { verifyToken, verifyRole, verifyHospitalIdentity } from '../middleware/authMiddleware.js';

const router = Router();

// ─── Auth ─────────────────────────────────────────────────────────────────────
router.post('/login', login);
router.post('/hospital/login', login); // Alias for legacy/manual testing

// ─── Hospitals listing / creation ─────────────────────────────────────────────
router.get('/hospitals', listHospitals);
// For demo, allowing creation publicly, but could be restricted to admin
router.post('/hospital', validateRequired(['name', 'email']), createHospital);

// ─── Protected Middleware Stack ───────────────────────────────────────────────
// Only hospitals can edit their own profiles/resources
const protectHospitalRoute = [verifyToken, verifyRole(['hospital']), verifyHospitalIdentity];

// ─── Single hospital CRUD ─────────────────────────────────────────────────────
router.get('/hospital/:id', getHospital); // Public view
router.put('/hospital/:id', protectHospitalRoute, updateHospital);

// ─── Resources ────────────────────────────────────────────────────────────────
router.get('/hospital/:id/resources', getHospitalResources); // Public view
router.put('/hospital/:id/resources', protectHospitalRoute, updateHospitalResources);

// ─── Blood bank ───────────────────────────────────────────────────────────────
router.put('/hospital/:id/bloodbank', protectHospitalRoute, updateBloodBank);

// ─── Dashboard summary ────────────────────────────────────────────────────────
router.get('/hospital/:id/dashboard-summary', getDashboardSummary); // Public for dashboard

// ─── Specialists ──────────────────────────────────────────────────────────────
router.post('/hospital/:id/specialists', protectHospitalRoute, validateRequired(['name', 'specialty']), addSpecialist);
router.put('/hospital/:id/specialists/:specialistId', protectHospitalRoute, updateSpecialist);
router.delete('/hospital/:id/specialists/:specialistId', protectHospitalRoute, deleteSpecialist);

export default router;
