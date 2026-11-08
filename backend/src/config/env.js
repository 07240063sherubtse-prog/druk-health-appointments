import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 3000),
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/druk_health?schema=public',
  JWT_SECRET: process.env.JWT_SECRET || 'druk-health-secret',
  FRONTEND_URL: process.env.FRONTEND_URL || process.env.RENDER_EXTERNAL_URL || 'http://localhost:5173',
  EMAIL_API_KEY: process.env.EMAIL_API_KEY || process.env.BREVO_API_KEY || '',
  EMAIL_FROM: process.env.EMAIL_FROM || '',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@drukhealth.app',
};
