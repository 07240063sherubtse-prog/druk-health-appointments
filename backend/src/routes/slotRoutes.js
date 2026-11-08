import express from 'express';
import { getDoctorSlotsForDate } from '../services/slotService.js';

const router = express.Router();

router.get('/:doctorId', (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'A date is required.' });
  }

  const slots = getDoctorSlotsForDate(doctorId, String(date));
  return res.json({ slots });
});

export default router;
