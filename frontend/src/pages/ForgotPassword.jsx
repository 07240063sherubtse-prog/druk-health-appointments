import { useState } from 'react';
import api from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to process your request.');
    }
  }

  return <div className="mx-auto max-w-xl rounded-[32px] border border-maroon/10 bg-white p-8 shadow-soft"><h1 className="font-display text-3xl text-maroon">Reset password</h1><form onSubmit={handleSubmit} className="mt-6 space-y-4"><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email address" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-maroon" required /><button className="w-full rounded-full bg-maroon px-4 py-3 font-semibold text-white">Send reset link</button></form>{message && <p className="mt-4 rounded-xl bg-slate-100 p-3 text-sm text-slate-700">{message}</p>}</div>;
}
