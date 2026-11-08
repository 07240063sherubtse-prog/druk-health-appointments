import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';

export default function DoctorProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    api.get('/hospitals/doctors').then((response) => {
      const match = response.data.doctors.find((item) => item.id === id);
      setDoctor(match || null);
    });
  }, [id]);

  if (!doctor) {
    return <div className="rounded-3xl border border-maroon/10 bg-white p-8 text-center text-slate-600">Loading profile...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl rounded-[32px] border border-maroon/10 bg-white p-8 shadow-soft">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-saffron text-2xl font-bold text-maroon">{doctor.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
        <div>
          <h1 className="font-display text-3xl text-maroon">{doctor.name}</h1>
          <p className="text-slate-600">{doctor.specialization} • {doctor.hospitalName}</p>
        </div>
      </div>
      <p className="text-slate-600">{doctor.bio}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-cream p-4"><div className="text-sm uppercase tracking-[0.2em] text-saffron">Experience</div><div className="mt-2 font-display text-2xl text-maroon">{doctor.experienceYears}+</div></div>
        <div className="rounded-2xl bg-cream p-4"><div className="text-sm uppercase tracking-[0.2em] text-saffron">Dzongkhag</div><div className="mt-2 font-display text-2xl text-maroon">{doctor.dzongkhag}</div></div>
      </div>
      <Link to={`/book-appointment/${doctor.id}`} className="mt-8 inline-flex rounded-full bg-maroon px-6 py-3 font-semibold text-white">Book appointment</Link>
    </div>
  );
}
