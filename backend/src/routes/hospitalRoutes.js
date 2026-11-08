import express from 'express';
import { getHospitalById, getNearbyHospitals, getAllDoctors } from '../services/hospitalService.js';

const router = express.Router();

router.get('/', (req, res) => {
  const { lat, lng, radius, q } = req.query;
  const radiusKm = Number(radius || 50);
  const hospitals = getNearbyHospitals({
    lat: Number(lat) || null,
    lng: Number(lng) || null,
    radiusKm,
    search: q ? String(q) : '',
  });
  res.json({ hospitals });
});

router.get('/doctors', (req, res) => {
  const doctors = getAllDoctors();
  res.json({ doctors });
});

router.get('/:id', (req, res) => {
  const hospital = getHospitalById(req.params.id);
  if (!hospital) {
    return res.status(404).json({ message: 'Hospital not found.' });
  }
  return res.json({ hospital });
});

export default router;
