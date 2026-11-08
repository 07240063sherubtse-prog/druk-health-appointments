import { haversineDistanceKm } from '../utils/haversine.js';

export const hospitalSeed = [
  {
    id: 'h1',
    name: 'Jigme Dorji Wangchuck National Referral Hospital',
    dzongkhag: 'Thimphu',
    address: 'Thimphu, Bhutan',
    phone: '+975-2-328000',
    latitude: 27.4728,
    longitude: 89.639,
    image: '/images/hospitals/jdwnrh-thimphu.svg',
    description: 'National referral hospital in Thimphu.',
    departments: ['General Medicine', 'Cardiology', 'Dermatology', 'Traditional Medicine'],
    doctors: [
      { id: 'd1', name: 'Dr. Tshering Dorji', specialization: 'General Medicine', experienceYears: 12, fee: 450, bio: 'Provides primary care and chronic disease follow-up.', photoUrl: '/images/avatars/tshering-dorji.svg', schedule: { day: 'Monday', start: '09:00', end: '17:00', slotMinutes: 30 } },
      { id: 'd2', name: 'Dr. Karma Wangmo', specialization: 'Cardiology', experienceYears: 10, fee: 650, bio: 'Cardiac prevention and treatment services.', photoUrl: '/images/avatars/karma-wangmo.svg', schedule: { day: 'Wednesday', start: '10:00', end: '18:00', slotMinutes: 30 } }
    ]
  },
  {
    id: 'h2',
    name: 'Phuentsholing General Hospital',
    dzongkhag: 'Chhukha',
    address: 'Phuentsholing, Chhukha',
    phone: '+975-5-291104',
    latitude: 26.8517,
    longitude: 89.388,
    image: '/images/hospitals/phuentsholing-general-hospital.svg',
    description: 'Regional hospital serving the south.',
    departments: ['Paediatrics', 'Orthopaedics', 'General Medicine'],
    doctors: [
      { id: 'd3', name: 'Dr. Pema Lhamo', specialization: 'Paediatrics', experienceYears: 8, fee: 400, bio: 'Infant and child wellness care.', photoUrl: '/images/avatars/pema-lhamo.svg', schedule: { day: 'Tuesday', start: '09:00', end: '16:00', slotMinutes: 30 } },
      { id: 'd4', name: 'Dr. Sonam Tenzin', specialization: 'Orthopaedics', experienceYears: 11, fee: 550, bio: 'Fracture and joint care.', photoUrl: '/images/avatars/sonam-tenzin.svg', schedule: { day: 'Thursday', start: '09:00', end: '17:00', slotMinutes: 30 } }
    ]
  },
  {
    id: 'h3',
    name: 'Eastern Regional Referral Hospital',
    dzongkhag: 'Mongar',
    address: 'Mongar, Bhutan',
    phone: '+975-4-632346',
    latitude: 27.2749,
    longitude: 91.2391,
    image: '/images/hospitals/eastern-regional-referral-hospital.svg',
    description: 'Regional referral center for eastern Bhutan.',
    departments: ['Gynaecology and Obstetrics', 'Dental'],
    doctors: [
      { id: 'd5', name: 'Dr. Kinley Penjor', specialization: 'Gynaecology and Obstetrics', experienceYears: 9, fee: 500, bio: 'Maternal and women’s health services.', photoUrl: '/images/avatars/kinley-penjor.svg', schedule: { day: 'Monday', start: '08:30', end: '15:30', slotMinutes: 30 } },
      { id: 'd6', name: 'Dr. Dechen Zangmo', specialization: 'Dental Surgery', experienceYears: 7, fee: 350, bio: 'Dental care and restorative treatment.', photoUrl: '/images/avatars/dechen-zangmo.svg', schedule: { day: 'Friday', start: '09:00', end: '17:00', slotMinutes: 30 } }
    ]
  },
  {
    id: 'h4',
    name: 'Central Regional Referral Hospital',
    dzongkhag: 'Sarpang',
    address: 'Gelephu, Sarpang',
    phone: '+975-6-260500',
    latitude: 26.8685,
    longitude: 90.4837,
    image: '/images/hospitals/central-regional-referral-hospital.svg',
    description: 'Central Bhutan referral and emergency care hospital.',
    departments: ['Eye (Ophthalmology)', 'ENT'],
    doctors: [
      { id: 'd7', name: 'Dr. Ugyen Namgay', specialization: 'Ophthalmology', experienceYears: 13, fee: 600, bio: 'Eye care and vision screening.', photoUrl: '/images/avatars/ugyen-namgay.svg', schedule: { day: 'Tuesday', start: '09:00', end: '17:00', slotMinutes: 30 } },
      { id: 'd8', name: 'Dr. Choki Dema', specialization: 'ENT', experienceYears: 6, fee: 480, bio: 'Ear, nose, and throat assessment.', photoUrl: '/images/avatars/choki-dema.svg', schedule: { day: 'Wednesday', start: '08:00', end: '15:00', slotMinutes: 30 } }
    ]
  },
  {
    id: 'h5',
    name: 'Paro Hospital',
    dzongkhag: 'Paro',
    address: 'Paro, Bhutan',
    phone: '+975-8-271132',
    latitude: 27.4305,
    longitude: 89.4131,
    image: '/images/hospitals/paro-hospital.svg',
    description: 'District hospital serving Paro and nearby valleys.',
    departments: ['Dermatology', 'Traditional Medicine'],
    doctors: [
      { id: 'd9', name: 'Dr. Tandin Wangchuk', specialization: 'Dermatology', experienceYears: 9, fee: 420, bio: 'Skin conditions and allergy management.', photoUrl: '/images/avatars/tandin-wangchuk.svg', schedule: { day: 'Thursday', start: '09:00', end: '17:00', slotMinutes: 30 } },
      { id: 'd10', name: 'Dr. Yeshey Choden', specialization: 'Traditional Medicine', experienceYears: 15, fee: 380, bio: 'Bhutanese integrative healing services.', photoUrl: '/images/avatars/yeshey-choden.svg', schedule: { day: 'Friday', start: '09:00', end: '15:00', slotMinutes: 30 } }
    ]
  },
  {
    id: 'h6',
    name: 'Trashigang Hospital',
    dzongkhag: 'Trashigang',
    address: 'Trashigang, Bhutan',
    phone: '+975-4-531260',
    latitude: 27.322,
    longitude: 91.5556,
    image: '/images/hospitals/trashigang-hospital.svg',
    description: 'Hospital for eastern dzongkhags and emergency care.',
    departments: ['General Medicine'],
    doctors: [
      { id: 'd11', name: 'Dr. Namgay Om', specialization: 'General Medicine', experienceYears: 10, fee: 440, bio: 'Primary care and referral support.', photoUrl: '/images/avatars/namgay-om.svg', schedule: { day: 'Monday', start: '09:00', end: '16:00', slotMinutes: 30 } }
    ]
  },
  {
    id: 'h7',
    name: 'Punakha (Khuruthang) Hospital',
    dzongkhag: 'Punakha',
    address: 'Khuruthang, Punakha',
    phone: '+975-2-784010',
    latitude: 27.5813,
    longitude: 89.8758,
    image: '/images/hospitals/punakha-hospital.svg',
    description: 'District hospital serving Punakha and nearby villages.',
    departments: ['General Medicine'],
    doctors: [
      { id: 'd12', name: 'Dr. Rinzin Wangdi', specialization: 'Family Medicine', experienceYears: 8, fee: 430, bio: 'Family health and preventive medicine.', photoUrl: '/images/avatars/rinzin-wangdi.svg', schedule: { day: 'Tuesday', start: '10:00', end: '18:00', slotMinutes: 30 } }
    ]
  }
];

export function getNearbyHospitals({ lat, lng, radiusKm = 50, search = '' }) {
  let matches = [...hospitalSeed];

  if (lat && lng) {
    matches = matches
      .map((hospital) => ({
        ...hospital,
        distanceKm: haversineDistanceKm(lat, lng, hospital.latitude, hospital.longitude),
      }))
      .filter((hospital) => hospital.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  if (search) {
    const query = search.toLowerCase();
    matches = matches.filter(
      (hospital) =>
        hospital.name.toLowerCase().includes(query) ||
        hospital.dzongkhag.toLowerCase().includes(query)
    );
  }

  return matches.map(({ distanceKm, ...hospital }) => hospital);
}

export function getHospitalById(id) {
  return hospitalSeed.find((hospital) => hospital.id === id) || null;
}

export function getDoctorById(id) {
  let doctor = null;
  for (const hospital of hospitalSeed) {
    const found = hospital.doctors.find((item) => item.id === id);
    if (found) {
      doctor = { ...found, hospitalId: hospital.id, hospitalName: hospital.name, dzongkhag: hospital.dzongkhag };
      break;
    }
  }
  return doctor;
}

export function getAllDoctors() {
  return hospitalSeed.flatMap((hospital) =>
    hospital.doctors.map((doctor) => ({
      ...doctor,
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      dzongkhag: hospital.dzongkhag,
    }))
  );
}

export function getAvailableSlots(doctorId, dateString) {
  const doctor = getDoctorById(doctorId);
  if (!doctor) return [];

  const date = new Date(dateString + 'T00:00:00');
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[date.getDay()];

  const schedule = { start: '09:00', end: '17:00', slotMinutes: 30 };
  if (doctor.schedule && doctor.schedule.day === dayName) {
    schedule.start = doctor.schedule.start;
    schedule.end = doctor.schedule.end;
    schedule.slotMinutes = doctor.schedule.slotMinutes;
  }

  const startMinutes = timeToMinutes(schedule.start);
  const endMinutes = timeToMinutes(schedule.end);
  const slots = [];
  for (let cursor = startMinutes; cursor + schedule.slotMinutes <= endMinutes; cursor += schedule.slotMinutes) {
    slots.push(minutesToTime(cursor));
  }
  return slots;
}

function timeToMinutes(value) {
  const [hour, minute] = value.split(':').map(Number);
  return hour * 60 + minute;
}

function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  return `${paddedHours}:${paddedMinutes}`;
}
