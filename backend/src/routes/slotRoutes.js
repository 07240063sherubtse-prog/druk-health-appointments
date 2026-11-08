import express from 'express';
import { getDoctorSlotsForDate } from '../services/slotService.js';

const router = express.Router();

router.get('/:doctorId', async (req, res, next) => {
  const { doctorId } = req.params;
  const { date } = req.query;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(String(date))) {
    return res.status(400).json({ message: 'A valid appointment date is required.' });
  }

  try {
    const slots = await getDoctorSlotsForDate(doctorId, String(date));
    return res.json({ slots });
  } catch (error) {
    return next(error);
  }
});

export default router;
