import cron from 'node-cron';
import { emailService } from '../services/emailService.js';
import { appointmentStore } from '../routes/appointmentRoutes.js';

export function startReminderJob() {
  cron.schedule('* * * * *', async () => {
    const now = new Date();

    for (const appointment of appointmentStore) {
      if (appointment.status !== 'BOOKED') continue;

      const appointmentDate = new Date(`${appointment.date}T${appointment.time}:00`);
      const diffHours = (appointmentDate - now) / (1000 * 60 * 60);

      if (diffHours <= 24 && diffHours > 2 && !appointment.reminder24hSent) {
        await emailService.sendAppointmentEmail({
          email: appointment.patientEmail,
          title: 'Appointment reminder',
          text: `This is a reminder that your appointment with ${appointment.doctorName} is scheduled for ${appointment.date} at ${appointment.time}.`,
          html: `<p>This is a reminder that your appointment with <strong>${appointment.doctorName}</strong> is scheduled for ${appointment.date} at ${appointment.time}.</p>`,
        });

        appointment.reminder24hSent = true;
        continue;
      }

      if (diffHours <= 2 && diffHours > 0 && !appointment.reminder2hSent) {
        await emailService.sendAppointmentEmail({
          email: appointment.patientEmail,
          title: 'Upcoming appointment in 2 hours',
          text: `Your appointment with ${appointment.doctorName} starts in 2 hours on ${appointment.date} at ${appointment.time}.`,
          html: `<p>Your appointment with <strong>${appointment.doctorName}</strong> starts in 2 hours on ${appointment.date} at ${appointment.time}.</p>`,
        });

        appointment.reminder2hSent = true;
      }
    }
  });
}
