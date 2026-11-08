# Deployment Guide

## Local backend

Set environment variables in `backend/.env`:

- PORT=3000
- NODE_ENV=development
- DATABASE_URL=your PostgreSQL connection string
- JWT_SECRET=replace-with-a-long-random-secret
- BREVO_API_KEY=your-Brevo-API-key
- EMAIL_FROM=your-verified-sender-address
- ADMIN_EMAIL=admin@drukhealth.app
- ADMIN_PASSWORD=set-a-unique-password-before-seeding

`EMAIL_FROM` must be a sender address verified in Brevo. Without a Brevo API key, development mode prints verification links to the backend console instead of sending email.

Then run:

```text
npm run install-all
npm --prefix backend run build
cd backend && npx prisma migrate dev
cd .. && npm --prefix backend run seed
npm run dev
```

## Production

The root `render.yaml` defines a Render web service and PostgreSQL database. Push the project to a Git provider, create a Render Blueprint from the repository, and set `ADMIN_EMAIL` to an address you control. Render generates `JWT_SECRET` and `ADMIN_PASSWORD`; set `BREVO_API_KEY` (or `EMAIL_API_KEY`) and a sender address verified in Brevo as `EMAIL_FROM` to enable registration, verification, and password-reset email flows. Production deliberately fails registration if email delivery is not configured; it never logs verification tokens. Verification links use Render's `RENDER_EXTERNAL_URL` unless `FRONTEND_URL` is set. If a verification delivery fails, the unverified user can submit the registration form again after correcting the email configuration.

The build generates Prisma Client. Each service start applies database migrations before launching Express. After the first deploy, run `npm --prefix backend run seed` once from the service shell or a trusted machine configured with the database's external URL to create the initial sample data and administrator. **Only run the seed against an empty database:** it deletes existing users, appointments, hospitals, departments, and doctors.

For production data, select a paid PostgreSQL plan and configure backups; the free plan is not suitable for durable production data.
