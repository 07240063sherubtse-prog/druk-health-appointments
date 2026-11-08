import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to log in.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-[32px] border border-maroon/10 bg-white p-8 shadow-soft">
      <h1 className="font-display text-3xl text-maroon">Welcome back</h1>
      <p className="mt-2 text-slate-600">Log in to manage appointments and care plans.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-maroon" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-maroon" required />
        </div>
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={loading} className="w-full rounded-full bg-maroon px-4 py-3 font-semibold text-white disabled:opacity-70">{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      <div className="mt-5 flex items-center justify-between text-sm text-slate-600">
        <Link to="/forgot-password" className="text-maroon">Forgot password?</Link>
        <Link to="/register" className="text-maroon">Create an account</Link>
      </div>
    </div>
  );
}
