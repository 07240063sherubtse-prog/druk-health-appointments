import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomToken, hashToken } from '../utils/tokens.js';
import { emailService } from '../services/emailService.js';
import { env } from '../config/env.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/auth.js';
import { prisma } from '../config/db.js';

const router = express.Router();

function setAuthCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 8,
  });
}

router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const data = req.body;
    const email = data.email.toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(201).json({ message: 'If registration is available for this email, a verification link will be sent.' });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const verificationToken = randomToken();
    const hashedVerificationToken = hashToken(verificationToken);
    try {
      const user = await prisma.user.create({
        data: {
          name: data.name,
          email,
          phone: data.phone,
          passwordHash,
          role: 'PATIENT',
          isVerified: false,
          verificationToken: hashedVerificationToken,
          verificationExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      });

      try {
        await emailService.sendVerificationEmail({ email: user.email, token: verificationToken });
      } catch (error) {
        await prisma.user.deleteMany({
          where: {
            id: user.id,
            isVerified: false,
            verificationToken: hashedVerificationToken,
          },
        });
        console.error('Registration verification email could not be sent.', error);
        return res.status(503).json({ message: 'Registration is temporarily unavailable because verification email could not be sent. Please try again later.' });
      }

      return res.status(201).json({ message: 'If registration is available for this email, a verification link will be sent.' });
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return res.status(201).json({ message: 'If registration is available for this email, a verification link will be sent.' });
      }
      throw error;
    }
  } catch (error) {
    return next(error);
  }
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, env.JWT_SECRET, { expiresIn: '8h' });
    setAuthCookie(res, token);
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    return next(error);
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'Logged out.' });
});

router.get('/me', authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      verified: user.isVerified,
    },
  });
});

router.post('/verify-email', async (req, res) => {
  const { token } = req.body || {};
  if (!token) {
    return res.status(400).json({ message: 'Verification token is required.' });
  }

  const hashed = hashToken(token);
  const user = await prisma.user.findFirst({ where: { verificationToken: hashed } });
  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired verification link.' });
  }

  if (!user.verificationExpiresAt || Date.now() > new Date(user.verificationExpiresAt).getTime()) {
    return res.status(400).json({ message: 'Verification link has expired.' });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
      verificationExpiresAt: null,
    },
  });

  return res.json({ message: 'Email verified successfully.' });
});

router.post('/forgot-password', validate(forgotPasswordSchema), async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) {
    return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
  }

  const resetToken = randomToken();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: hashToken(resetToken),
      resetTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 60),
    },
  });

  await emailService.sendPasswordResetEmail({ email: user.email, token: resetToken });
  return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
});

router.post('/reset-password', validate(resetPasswordSchema), async (req, res) => {
  const { token, password } = req.body;
  const hashed = hashToken(token);
  const user = await prisma.user.findFirst({ where: { resetToken: hashed } });
  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired reset token.' });
  }

  if (!user.resetTokenExpiresAt || Date.now() > new Date(user.resetTokenExpiresAt).getTime()) {
    return res.status(400).json({ message: 'Reset token has expired.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExpiresAt: null,
    },
  });

  return res.json({ message: 'Password reset successful.' });
});

export { router as authRoutes };
