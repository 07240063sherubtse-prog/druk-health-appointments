import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters.')
  .max(72, 'Password must be no more than 72 characters.')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{12,72}$/, 'Password must include uppercase, lowercase, number, and symbol.')
  .refine((password) => Buffer.byteLength(password, 'utf8') <= 72, 'Password must be no more than 72 UTF-8 bytes.');

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters long.').max(100, 'Name must be no more than 100 characters.'),
  email: z.string().trim().email('Please provide a valid email address.'),
  phone: z.string().trim().min(8, 'Phone number is required.').regex(/^\+?975\d{7,8}$/, 'Phone must be a valid Bhutanese number.'),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required.'),
  password: passwordSchema,
});
