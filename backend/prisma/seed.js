import '../src/config/env.js';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const hospitals = [
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
  },
];

const departments = [
  'General Medicine',
  'Paediatrics',
  'Gynaecology and Obstetrics',
  'Orthopaedics',
  'Dental',
  'Eye (Ophthalmology)',
  'ENT',
  'Cardiology',
  'Dermatology',
  'Traditional Medicine',
];

const doctors = [
  { name: 'Dr. Tshering Dorji', hospitalId: 'h1', department: 'General Medicine', specialization: 'General Medicine', experienceYears: 12, fee: 450, bio: 'Provides primary care and follow-up support for adult patients.', photoUrl: '/images/avatars/tshering-dorji.svg' },
  { name: 'Dr. Karma Wangmo', hospitalId: 'h1', department: 'Cardiology', specialization: 'Cardiology', experienceYears: 10, fee: 650, bio: 'Focuses on heart health, blood pressure management, and screening.', photoUrl: '/images/avatars/karma-wangmo.svg' },
  { name: 'Dr. Pema Lhamo', hospitalId: 'h2', department: 'Paediatrics', specialization: 'Paediatrics', experienceYears: 8, fee: 400, bio: 'Care for infants, children, and adolescent wellness services.', photoUrl: '/images/avatars/pema-lhamo.svg' },
  { name: 'Dr. Sonam Tenzin', hospitalId: 'h2', department: 'Orthopaedics', specialization: 'Orthopaedics', experienceYears: 11, fee: 550, bio: 'Handles fractures, joint pain, and mobility advice.', photoUrl: '/images/avatars/sonam-tenzin.svg' },
  { name: 'Dr. Kinley Penjor', hospitalId: 'h3', department: 'Gynaecology and Obstetrics', specialization: 'Gynaecology and Obstetrics', experienceYears: 9, fee: 500, bio: 'Maternal care, antenatal support, and women’s health management.', photoUrl: '/images/avatars/kinley-penjor.svg' },
  { name: 'Dr. Dechen Zangmo', hospitalId: 'h3', department: 'Dental', specialization: 'Dental Surgery', experienceYears: 7, fee: 350, bio: 'Preventive and restorative oral care.', photoUrl: '/images/avatars/dechen-zangmo.svg' },
  { name: 'Dr. Ugyen Namgay', hospitalId: 'h4', department: 'Eye (Ophthalmology)', specialization: 'Ophthalmology', experienceYears: 13, fee: 600, bio: 'Vision screening and eye disease follow-up.', photoUrl: '/images/avatars/ugyen-namgay.svg' },
  { name: 'Dr. Choki Dema', hospitalId: 'h4', department: 'ENT', specialization: 'ENT', experienceYears: 6, fee: 480, bio: 'Ear, nose, and throat assessment and care.', photoUrl: '/images/avatars/choki-dema.svg' },
  { name: 'Dr. Tandin Wangchuk', hospitalId: 'h5', department: 'Dermatology', specialization: 'Dermatology', experienceYears: 9, fee: 420, bio: 'Skin care and dermatological management.', photoUrl: '/images/avatars/tandin-wangchuk.svg' },
  { name: 'Dr. Yeshey Choden', hospitalId: 'h5', department: 'Traditional Medicine', specialization: 'Traditional Medicine', experienceYears: 15, fee: 380, bio: 'Integrates traditional Bhutanese healing approaches with support.', photoUrl: '/images/avatars/yeshey-choden.svg' },
  { name: 'Dr. Namgay Om', hospitalId: 'h6', department: 'General Medicine', specialization: 'General Medicine', experienceYears: 10, fee: 440, bio: 'Primary care and referral support for community health.', photoUrl: '/images/avatars/namgay-om.svg' },
  { name: 'Dr. Rinzin Wangdi', hospitalId: 'h7', department: 'General Medicine', specialization: 'Family Medicine', experienceYears: 8, fee: 430, bio: 'Family health and preventive medicine.', photoUrl: '/images/avatars/rinzin-wangdi.svg' },
];

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error('Set ADMIN_PASSWORD before seeding.');
  }

  await prisma.appointment.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.department.deleteMany();
  await prisma.hospital.deleteMany();
  await prisma.user.deleteMany();

  for (const entry of hospitals) {
    await prisma.hospital.create({ data: entry });
  }

  for (const deptName of departments) {
    for (const hospital of hospitals) {
      await prisma.department.create({
        data: {
          name: deptName,
          hospital: { connect: { id: hospital.id } },
        },
      });
    }
  }

  for (const doctor of doctors) {
    const department = await prisma.department.findFirst({
      where: {
        hospitalId: doctor.hospitalId,
        name: doctor.department,
      },
    });

    await prisma.doctor.create({
      data: {
        name: doctor.name,
        specialization: doctor.specialization,
        experienceYears: doctor.experienceYears,
        fee: doctor.fee,
        bio: doctor.bio,
        photoUrl: doctor.photoUrl,
        weeklyAvailability: JSON.stringify({ days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], start: '09:00', end: '17:00', slotMinutes: 30 }),
        hospital: { connect: { id: doctor.hospitalId } },
        department: { connect: { id: department.id } },
      },
    });
  }

  await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: (process.env.ADMIN_EMAIL || 'admin@drukhealth.app').toLowerCase(),
      phone: '+97517123456',
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: 'ADMIN',
      isVerified: true,
    },
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
