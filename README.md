# Druk Health Appointments

A Bhutan-focused hospital appointment booking system built with React, Express, Prisma, and PostgreSQL.

## Features

- Bhutanese branding and UX
- English-language interface
- Hospital search by geolocation and location text
- Department and doctor browsing
- Appointment booking with slot validation
- Role-based patient, doctor, and admin access
- Secure authentication with JWT cookies
- Email-verified registration with password strength and request-rate limits
- Email verification and password reset flows
- Reminder scheduling via node-cron
- Responsive frontend with Tailwind CSS

## Local development

1. Configure the ignored `backend/.env` file with your local PostgreSQL `DATABASE_URL`, a strong `JWT_SECRET`, and `ADMIN_EMAIL`/`ADMIN_PASSWORD`. Set `EMAIL_API_KEY` (or `BREVO_API_KEY`) and a sender address verified in Brevo as `EMAIL_FROM` to enable email delivery. Without a Brevo API key, development mode prints verification links to the backend console. Never commit `.env` files or share their secrets.
2. Install dependencies:
   npm run install-all
3. Apply the database migration:
   cd backend && npx prisma migrate dev
4. Seed the data:
   npm --prefix backend run seed
5. Start the app:
   npm run dev

Frontend runs on http://localhost:5173 and the backend on http://localhost:3000.
The frontend uses `/api` by default; set `VITE_API_BASE_URL` in `frontend/.env` only when the API is hosted at a different URL.

## Production deployment

The included `render.yaml` defines a Render web service and PostgreSQL database, and wires the database connection string to `DATABASE_URL`. Connect this project to a Git repository, set `ADMIN_EMAIL` to an address you control, then create or sync a Render Blueprint from that repository. The build generates the Prisma client, and each service start applies checked-in database migrations and safely seeds the hospital directory and sample providers before starting Express. The seed preserves existing users and appointments and does not replace an existing administrator password. Verification and password-reset links use Render's service URL by default; set `FRONTEND_URL` if you use a custom domain. In the Render web service's Environment settings, `DATABASE_URL` must use the linked Render PostgreSQL connection string; a local `localhost` URL is only for development.

The additional hospital locations use records from Bhutan's [National Spatial Data Infrastructure hospital directory](https://nsdi.systems.gov.bt/server/rest/services/Hosted/Hospitals/FeatureServer/0). These listings do not include online provider schedules; only hospitals with configured doctors can accept online bookings.

Render generates the administrator password and JWT secret. Retrieve and store the administrator password securely from the service's environment settings before running the seed. Configure `BREVO_API_KEY` (or `EMAIL_API_KEY`) and `EMAIL_FROM` with a verified sender in the service environment to enable verification and password-reset emails. The free Render web service may sleep when idle, and the free PostgreSQL plan is not suitable for durable production data; choose a paid database plan for production.

## Notes

- Default timezone is Asia/Thimphu (UTC+6).
- Phone validation supports Bhutanese local and mobile formats.
