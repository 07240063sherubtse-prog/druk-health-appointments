import { Link } from 'react-router-dom';

export default function HospitalCard({ hospital }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-maroon/10 bg-white shadow-soft">
      <img src={hospital.image || '/images/hospitals/placeholder.svg'} alt={hospital.name} className="h-44 w-full object-cover" />
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="font-display text-xl text-ink">{hospital.name}</h3>
          {hospital.distanceKm && <span className="rounded-full bg-saffron/20 px-2 py-1 text-xs font-semibold text-maroon">{hospital.distanceKm.toFixed(1)} km</span>}
        </div>
        <p className="mb-2 text-sm text-slate-600">{hospital.dzongkhag}</p>
        <p className="mb-4 text-sm text-slate-600">{hospital.address}</p>
        <Link to={`/hospitals/${hospital.id}`} className="inline-flex items-center rounded-full bg-maroon px-4 py-2 text-sm font-semibold text-white transition hover:bg-maroon/90">View hospital</Link>
      </div>
    </div>
  );
}
