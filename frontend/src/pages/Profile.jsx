import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-2xl rounded-[32px] border border-maroon/10 bg-white p-8 shadow-soft">
      <h1 className="font-display text-3xl text-maroon">Profile</h1>
      <div className="mt-6 space-y-4 text-slate-600">
        <div><span className="font-semibold text-ink">Name:</span> {user?.name}</div>
        <div><span className="font-semibold text-ink">Email:</span> {user?.email}</div>
        <div><span className="font-semibold text-ink">Phone:</span> {user?.phone || 'Not provided'}</div>
        <div><span className="font-semibold text-ink">Role:</span> {user?.role}</div>
      </div>
    </div>
  );
}
