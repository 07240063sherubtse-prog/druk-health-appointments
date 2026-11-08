import { Link } from 'react-router-dom';
import BhutanPattern from '../components/BhutanPattern';
import { useAuth } from '../context/AuthContext';

const highlights = [
  { label: '28', detail: 'mapped hospitals' },
  { label: 'Name', detail: 'hospital search' },
  { label: 'Dzongkhag', detail: 'location search' },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="space-y-12 pb-8">
      <section className="relative isolate overflow-hidden rounded-[32px] border border-maroon/10 bg-gradient-to-br from-[#641919] via-maroon to-[#a83b36] px-6 py-12 text-white shadow-soft md:px-12 md:py-16">
        <BhutanPattern />
        <div className="relative grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-saffron">
              <span className="h-2 w-2 rounded-full bg-saffron" /> Druk Health Appointments
            </p>
            <h1 className="font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">Care starts closer to home.</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/85">Explore hospitals across Bhutan, find a care location, and request an appointment with a listed doctor.</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link to="/find-hospitals" className="rounded-full bg-saffron px-6 py-3.5 font-semibold text-maroon shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#f5b52e]">Book an appointment <span aria-hidden="true">→</span></Link>
              {!user && <Link to="/login" className="text-sm font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">Already have an account? Log in</Link>}
            </div>
            <p className="mt-4 text-xs text-white/65">You can search hospitals without an account. Sign in is required when you book.</p>
          </div>
          <div className="rounded-[28px] border border-white/20 bg-white/10 p-5 shadow-xl shadow-black/10 backdrop-blur-sm sm:p-7">
            <div className="rounded-[22px] bg-white p-5 text-ink sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-maroon/70">Find care in Bhutan</p>
                  <h2 className="mt-2 font-display text-2xl text-maroon">One place to begin</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream text-2xl text-maroon" aria-hidden="true">✚</div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">Search by hospital name or Dzongkhag. Browse the directory first, then sign in when you are ready to book.</p>
              <div className="mt-6 grid grid-cols-3 gap-2 border-t border-maroon/10 pt-5">
                {highlights.map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="font-display text-lg font-semibold text-maroon sm:text-xl">{item.label}</div>
                    <div className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-xs">{item.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <Link to="/find-hospitals" className="group rounded-3xl border border-maroon/10 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lg">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-cream font-display text-xl text-maroon">01</div>
          <h3 className="font-display text-2xl text-ink">Find a hospital</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">Search hospital names and Dzongkhags across the directory, or filter by distance.</p>
          <span className="mt-5 inline-flex font-semibold text-maroon group-hover:underline">Explore hospitals <span className="ml-2" aria-hidden="true">→</span></span>
        </Link>
        <div className="rounded-3xl border border-maroon/10 bg-white p-6 shadow-soft">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-cream font-display text-xl text-maroon">02</div>
          <h3 className="font-display text-2xl text-ink">Request a booking</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">Choose a listed doctor and an available time. Sign in is requested only when you confirm.</p>
        </div>
        <div className="rounded-3xl border border-maroon/10 bg-white p-6 shadow-soft">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-cream font-display text-xl text-maroon">03</div>
          <h3 className="font-display text-2xl text-ink">Manage appointments</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">After signing in, review upcoming bookings and update your patient profile.</p>
          <Link to={user ? '/my-appointments' : '/login'} className="mt-5 inline-flex font-semibold text-maroon hover:underline">{user ? 'View appointments' : 'Log in'} <span className="ml-2" aria-hidden="true">→</span></Link>
        </div>
      </section>
    </div>
  );
}
