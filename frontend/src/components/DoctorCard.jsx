import { Link } from 'react-router-dom';

export default function DoctorCard({ doctor }) {
  return (
    <div className="rounded-3xl border border-maroon/10 bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-saffron text-xl font-bold text-maroon">{doctor.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
        <div>
          <h3 className="font-display text-xl text-ink">{doctor.name}</h3>
          <p className="text-sm text-slate-600">{doctor.specialization}</p>
        </div>
      </div>
      <p className="mb-3 text-sm text-slate-600">{doctor.bio}</p>
      <div className="mb-4 flex items-center justify-between text-sm font-medium text-maroon">
        <span>{doctor.experienceYears}+ years</span>
        <span>Nu. {doctor.fee}</span>
      </div>
      <Link to={`/book-appointment/${doctor.id}`} className="inline-flex items-center rounded-full bg-saffron px-4 py-2 text-sm font-semibold text-maroon">Book now</Link>
    </div>
  );
}
