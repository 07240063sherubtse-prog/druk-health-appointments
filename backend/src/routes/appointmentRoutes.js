import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { getDoctorById, getHospitalById } from '../services/hospitalService.js';
import { emailService } from '../services/emailService.js';
import { validate } from '../middleware/validate.js';
import { bookingSchema } from '../validators/appointment.js';
import { prisma } from '../config/db.js';

const router = express.Router();
const appointments = [];
const appointmentStore = appointments;

function normalizeAppointment(appointment) {
  if (!appointment) return appointment;

  const doctorName = appointment.doctor?.name ?? appointment.doctorName ?? null;
  const hospitalName = appointment.doctor?.hospital?.name ?? appointment.hospitalName ?? null;
  const patientName = appointment.patient?.name ?? appointment.patientName ?? null;

  return {
    ...appointment,
    doctorName,
    hospitalName,
    patientName,
    time: appointment.startTime ?? appointment.time ?? null,
  };
}

router.use(authenticate);

router.get('/my', async (req, res) => {
  const patientAppointments = await prisma.appointment.findMany({
    where: { patientId: req.user.id },
    include: { doctor: { include: { hospital: true } } },
    orderBy: { date: 'asc' },
  });

  res.json({ appointments: patientAppointments.map(normalizeAppointment) });
});

router.get('/doctor-dashboard', authorize('DOCTOR', 'ADMIN'), async (req, res) => {
  if (req.user.role === 'ADMIN') {
    const items = await prisma.appointment.findMany({
      orderBy: { date: 'asc' },
      include: { doctor: { include: { hospital: true } }, patient: true },
    });
    return res.json({ appointments: items.map(normalizeAppointment) });
  }

  const doctor = await prisma.doctor.findFirst({ where: { name: req.user.name } });
  const items = doctor
    ? await prisma.appointment.findMany({
        where: { doctorId: doctor.id },
        include: { doctor: { include: { hospital: true } }, patient: true },
        orderBy: { date: 'asc' },
      })
    : [];
  return res.json({ appointments: items.map(normalizeAppointment) });
});

router.get('/admin-dashboard', authorize('ADMIN'), async (req, res) => {
  const items = await prisma.appointment.findMany({
    include: { doctor: { include: { hospital: true } }, patient: true },
    orderBy: { date: 'asc' },
  });
  res.json({ appointments: items.map(normalizeAppointment) });
});

router.post('/', validate(bookingSchema), async (req, res, next) => {
  try {
    const payload = req.body;
    const directoryDoctor = getDoctorById(payload.doctorId);
    const doctor = directoryDoctor
      ? await prisma.doctor.findFirst({
          where: { name: directoryDoctor.name, hospitalId: directoryDoctor.hospitalId },
          include: { hospital: true },
        })
      : await prisma.doctor.findUnique({ where: { id: payload.doctorId }, include: { hospital: true } });
    const hospital = doctor?.hospital || getHospitalById(payload.hospitalId);

    if (!doctor || !hospital) {
      return res.status(404).json({ message: 'Doctor or hospital not found.' });
    }

    if (payload.hospitalId !== hospital.id && payload.hospitalId !== directoryDoctor?.hospitalId) {
      return res.status(400).json({ message: 'The selected doctor does not belong to this hospital.' });
    }

    const appointmentDate = new Date(`${payload.date}T00:00:00.000Z`);
    const existingBooking = await prisma.appointment.findFirst({
      where: {
        doctorId: doctor.id,
        date: appointmentDate,
        startTime: payload.time,
        status: 'BOOKED',
      },
      select: { id: true },
    });
    if (existingBooking) {
      return res.status(409).json({ message: 'That appointment time has already been booked. Please choose another time.' });
    }
    const storedAppointment = {
      id: `apt-${Date.now()}`,
      patientId: req.user.id,
      patientEmail: req.user.email,
      doctorId: payload.doctorId,
      doctorName: doctor.name,
      hospitalId: payload.hospitalId,
      hospitalName: hospital.name,
      date: payload.date,
      time: payload.time,
      reason: payload.reason,
      status: 'BOOKED',
      reminder24hSent: false,
      reminder2hSent: false,
      createdAt: new Date().toISOString(),
    };

    const created = await prisma.appointment.create({
      data: {
        patient: { connect: { id: req.user.id } },
        doctor: { connect: { id: doctor.id } },
        hospitalId: hospital.id,
        date: appointmentDate,
        startTime: payload.time,
        endTime: addMinutes(payload.time, 30),
        reason: payload.reason,
        status: 'BOOKED',
      },
      include: { doctor: { include: { hospital: true } }, patient: true },
    });

    appointments.push(storedAppointment);

    try {
      await emailService.sendAppointmentEmail({
        email: req.user.email,
        title: 'Appointment confirmed',
        text: `Your appointment at ${hospital.name} with ${doctor.name} is booked for ${payload.date} at ${payload.time}.`,
        html: `<p>Your appointment at <strong>${hospital.name}</strong> with <strong>${doctor.name}</strong> is booked for ${payload.date} at ${payload.time}.</p>`,
      });
    } catch (emailError) {
      console.error('Appointment confirmation email could not be sent.', emailError);
    }

    return res.status(201).json({ appointment: normalizeAppointment(created) });
  } catch (error) {
    return next(error);
  }
});

router.patch('/:id/cancel', async (req, res) => {
  const appointment = await prisma.appointment.findUnique({ where: { id: req.params.id } });
  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found.' });
  }

  if (appointment.patientId !== req.user.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'You cannot cancel this appointment.' });
  }

  const updated = await prisma.appointment.update({
    where: { id: req.params.id },
    data: {
      status: 'CANCELLED',
      cancellationReason: req.body?.reason || 'Cancelled by patient',
    },
    include: { doctor: { include: { hospital: true } }, patient: true },
  });

  return res.json({ appointment: normalizeAppointment(updated) });
});

function addMinutes(time, amount) {
  const [hours, minutes] = time.split(':').map(Number);
  const total = hours * 60 + minutes + amount;
  const nextHours = Math.floor(total / 60) % 24;
  const nextMinutes = total % 60;
  return `${String(nextHours).padStart(2, '0')}:${String(nextMinutes).padStart(2, '0')}`;
}

export { router as appointmentRoutes, appointments, appointmentStore };
