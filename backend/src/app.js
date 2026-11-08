import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { authRoutes } from './routes/authRoutes.js';
import hospitalRoutes from './routes/hospitalRoutes.js';
import { appointmentRoutes } from './routes/appointmentRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { startReminderJob } from './jobs/reminderJob.js';
import slotRoutes from './routes/slotRoutes.js';

startReminderJob();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 80,
  standardHeaders: true,
  legacyHeaders: false,
});

const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => res.status(429).json({ message: 'Too many registration attempts. Please wait 15 minutes before trying again.' }),
});

app.use('/api/auth/register', registrationLimiter);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/appointments', appointmentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'druk-health-appointments' });
});

app.use(express.static(frontendDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  return res.sendFile(path.join(frontendDistPath, 'index.html'));
});

app.use(errorHandler);

export default app;
