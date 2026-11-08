import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Verifying...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('Verification token is missing.');
      return;
    }

    api.post('/auth/verify-email', { token })
      .then(() => setStatus('Email verified successfully. You can now log in.'))
      .catch(() => setStatus('Verification failed. The link may be invalid or expired.'));
  }, [searchParams]);

  return <div className="rounded-[32px] border border-maroon/10 bg-white p-8 text-center shadow-soft"><h1 className="font-display text-3xl text-maroon">Email verification</h1><p className="mt-4 text-slate-600">{status}</p></div>;
}
