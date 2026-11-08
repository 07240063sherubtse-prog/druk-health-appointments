import express from 'express';
import { getDoctorSlotsForDate } from '../services/slotService.js';

const router = express.Router();

router.get('/:doctorId', async (req, res, next) => {
  const { doctorId } = req.params;
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'A date is required.' });
  }

  try {
    const slots = await getDoctorSlotsForDate(doctorId, String(date));
    return res.json({ slots });
  } catch (error) {
    return next(error);
  }
});

export default router;
