import { env } from './env.js';

let databaseUrl;
try {
  databaseUrl = new URL(env.DATABASE_URL);
} catch {
  throw new Error('DATABASE_URL must be a valid PostgreSQL connection URL.');
}

if (!['postgres:', 'postgresql:'].includes(databaseUrl.protocol)) {
  throw new Error('DATABASE_URL must start with postgres:// or postgresql://.');
}

const localHosts = new Set(['localhost', '127.0.0.1', '::1']);
if (env.NODE_ENV === 'production' && localHosts.has(databaseUrl.hostname)) {
  throw new Error('Production DATABASE_URL points to localhost. Set it to the Render PostgreSQL Internal Database URL.');
}

console.log('DATABASE_URL configuration is valid.');
