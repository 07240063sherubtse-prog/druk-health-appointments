import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';
import api from '../api/axios';

export default function HospitalDetails() {
  const { id } = useParams();
  const [hospital, setHospital] = useState(null);

  useEffect(() => {
    api.get(`/hospitals/${id}`).then((response) => setHospital(response.data.hospital)).catch(() => setHospital(null));
  }, [id]);

  if (!hospital) {
    return <div className="rounded-3xl border border-maroon/10 bg-white p-8 text-center text-slate-600">Loading hospital details...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-[32px] border border-maroon/10 bg-white shadow-soft">
        <img src={hospital.image} alt={hospital.name} className="h-64 w-full object-cover" />
        <div className="p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-saffron">{hospital.dzongkhag}</p>
              <h1 className="font-display text-4xl text-maroon">{hospital.name}</h1>
            </div>
            <div className="rounded-full bg-maroon px-4 py-2 text-sm font-semibold text-white">{hospital.phone}</div>
          </div>
          <p className="mt-4 text-slate-600">{hospital.address}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[32px] border border-maroon/10 bg-white p-6 shadow-soft">
          <h2 className="font-display text-2xl text-ink">Departments</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {hospital.departments?.map((department) => (
              <span key={department} className="rounded-full bg-saffron/20 px-3 py-2 text-sm font-medium text-maroon">{department}</span>
            ))}
          </div>
        </div>
        <div className="rounded-[32px] border border-maroon/10 bg-white p-6 shadow-soft">
          <h2 className="font-display text-2xl text-ink">About</h2>
          <p className="mt-4 text-slate-600">{hospital.description || 'Comprehensive care and specialist support across hospital departments.'}</p>
        </div>
      </div>

      <div>
        <h2 className="font-display text-3xl text-maroon">Doctors</h2>
        <div className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {hospital.doctors?.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}
        </div>
      </div>
    </div>
  );
}
