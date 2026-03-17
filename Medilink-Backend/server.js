/**
 * server.js  —  MediLink Backend Entry Point
 * Express server with CORS, JSON parsing, and hospital API routes.
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import hospitalRoutes from './src/routes/hospitalRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import doctorRoutes from './src/routes/doctorRoutes.js';
import { errorHandler, notFound } from './src/middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Allow requests from the Vite dev server (and any localhost ports for flexibility)
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'MediLink Backend is running', timestamp: new Date() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api', hospitalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);

// ─── 404 & Error Handling ─────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ MediLink Backend running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

export default app;
