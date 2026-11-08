import { z } from 'zod';

export const bookingSchema = z.object({
  doctorId: z.string().min(1, 'Doctor is required.'),
  hospitalId: z.string().min(1, 'Hospital is required.'),
  date: z.string().min(1, 'Date is required.'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format.'),
  reason: z.string().trim().min(3, 'Reason must be at least 3 characters long.'),
});
