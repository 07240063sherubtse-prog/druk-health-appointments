import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await register(form);
      setMessage('Registration successful. Please check your email to verify your account.');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-[32px] border border-maroon/10 bg-white p-8 shadow-soft">
      <h1 className="font-display text-3xl text-maroon">Create your account</h1>
      <p className="mt-2 text-slate-600">Book appointments with trusted hospitals across Bhutan.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Full name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-maroon" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-maroon" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Bhutanese phone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-maroon" placeholder="e.g. +97517123456" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" autoComplete="new-password" minLength={12} maxLength={72} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-maroon" required />
        </div>
        <p className="-mt-2 text-xs text-slate-500">Use at least 12 characters with uppercase and lowercase letters, a number, and a symbol.</p>
        {message && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={loading} className="w-full rounded-full bg-maroon px-4 py-3 font-semibold text-white disabled:opacity-70">{loading ? 'Creating account...' : 'Register'}</button>
      </form>
      <p className="mt-5 text-sm text-slate-600">Already have an account? <Link to="/login" className="text-maroon">Login</Link></p>
    </div>
  );
}
