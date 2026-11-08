import { Link } from 'react-router-dom';
import BhutanPattern from '../components/BhutanPattern';

const highlights = [
  { label: '7 hospitals', detail: 'Across Bhutan' },
  { label: '24/7', detail: 'Support' },
  { label: 'Free', detail: 'Appointments' },
];

export default function Landing() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[32px] border border-maroon/10 bg-gradient-to-r from-maroon via-[#8d2b2b] to-[#b74040] px-6 py-14 text-white shadow-soft md:px-10">
        <BhutanPattern />
        <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-saffron">Druk Health</p>
            <h1 className="font-display text-5xl leading-tight">Healthcare in Bhutan</h1>
            <p className="mt-4 max-w-lg text-lg text-white/90">Healthcare closer to every Dzongkhag</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/find-hospitals" className="rounded-full bg-saffron px-6 py-3 font-semibold text-maroon">Book an appointment</Link>
              <Link to="/register" className="rounded-full border border-white/40 px-6 py-3 font-semibold text-white">Find a hospital</Link>
            </div>
          </div>
          <div className="rounded-[28px] bg-white/10 p-6 backdrop-blur-sm">
            <div className="rounded-[20px] border border-white/20 bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.25em] text-saffron">Quick actions</p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {highlights.map((item) => (
                  <div key={item.label} className="rounded-2xl bg-white/10 p-3 text-center">
                    <div className="font-display text-2xl text-saffron">{item.label}</div>
                    <div className="text-xs text-white/80">{item.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-maroon/10 bg-white p-6 shadow-soft">
          <div className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-saffron">Find</div>
          <h3 className="font-display text-2xl text-ink">Nearby hospitals</h3>
          <p className="mt-3 text-slate-600">Locate the nearest care facility by GPS or by Dzongkhag and hospital name.</p>
        </div>
        <div className="rounded-3xl border border-maroon/10 bg-white p-6 shadow-soft">
          <div className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-saffron">Book</div>
          <h3 className="font-display text-2xl text-ink">Doctor appointments</h3>
          <p className="mt-3 text-slate-600">Choose a department, select a doctor, confirm a date, and receive reminders.</p>
        </div>
        <div className="rounded-3xl border border-maroon/10 bg-white p-6 shadow-soft">
          <div className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-saffron">Manage</div>
          <h3 className="font-display text-2xl text-ink">Your care journey</h3>
          <p className="mt-3 text-slate-600">Track bookings and manage patient profiles securely with role-aware access.</p>
        </div>
      </section>
    </div>
  );
}
