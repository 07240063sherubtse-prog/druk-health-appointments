import holidays from '../config/holidays.json' with { type: 'json' };
import { getDoctorById } from './hospitalService.js';
import { prisma } from '../config/db.js';

export function isHoliday(dateString) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
  const parsed = new Date(`${dateString}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== dateString) return false;
  const normalized = parsed.toISOString().slice(0, 10);
  return holidays.includes(normalized);
}

export async function getDoctorSlotsForDate(doctorId, dateString) {
  const directoryDoctor = getDoctorById(doctorId);
  if (!directoryDoctor) return [];

  const doctor = await prisma.doctor.findFirst({
    where: { name: directoryDoctor.name, hospitalId: directoryDoctor.hospitalId },
    select: { id: true },
  }) || await prisma.doctor.findFirst({
    where: { name: directoryDoctor.name },
    select: { id: true },
  });
  if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString) || isHoliday(dateString)) return [];

  const dateStart = new Date(`${dateString}T00:00:00.000Z`);
  if (Number.isNaN(dateStart.getTime()) || dateStart.toISOString().slice(0, 10) !== dateString) return [];
  const dateEnd = new Date(dateStart.getTime() + 24 * 60 * 60 * 1000);
  const bookedAppointments = doctor ? await prisma.appointment.findMany({
    where: {
      doctorId: doctor.id,
      date: { gte: dateStart, lt: dateEnd },
      status: 'BOOKED',
    },
    select: { startTime: true },
  }) : [];
  const bookedTimes = new Set(bookedAppointments.map(({ startTime }) => startTime));

  const schedule = directoryDoctor.schedule || { start: '09:00', end: '17:00', slotMinutes: 30 };
  const startMinutes = timeToMinutes(schedule.start);
  const endMinutes = timeToMinutes(schedule.end);
  const slotDuration = schedule.slotMinutes || 30;

  const openSlots = [];
  for (let cursor = startMinutes; cursor + slotDuration <= endMinutes; cursor += slotDuration) {
    const time = minutesToTime(cursor);
    const isBooked = bookedTimes.has(time);

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
