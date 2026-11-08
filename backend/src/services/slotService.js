import holidays from '../config/holidays.json' with { type: 'json' };
import { getDoctorById } from './hospitalService.js';
import { appointmentStore } from '../routes/appointmentRoutes.js';

export function isHoliday(dateString) {
  const normalized = new Date(dateString + 'T00:00:00').toISOString().slice(0, 10);
  return holidays.includes(normalized);
}

export function getDoctorSlotsForDate(doctorId, dateString) {
  const doctor = getDoctorById(doctorId);
  if (!doctor) return [];

  if (!dateString || isHoliday(dateString)) return [];

  const schedule = doctor.schedule || { start: '09:00', end: '17:00', slotMinutes: 30 };
  const startMinutes = timeToMinutes(schedule.start);
  const endMinutes = timeToMinutes(schedule.end);
  const slotDuration = schedule.slotMinutes || 30;

  const openSlots = [];
  for (let cursor = startMinutes; cursor + slotDuration <= endMinutes; cursor += slotDuration) {
    const time = minutesToTime(cursor);
    const isBooked = appointmentStore.some(
      (appointment) =>
        appointment.doctorId === doctorId &&
        appointment.date === dateString &&
        appointment.time === time &&
        appointment.status === 'BOOKED'
    );

    if (!isBooked) {
      openSlots.push({ date: dateString, time });
    }
  }

  return openSlots;
}

function timeToMinutes(value) {
  const [hour, minute] = value.split(':').map(Number);
  return hour * 60 + minute;
}

function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
