import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';
import api from '../api/axios';

const departmentAliases = {
  Dental: ['Dental Surgery'],
  'Eye (Ophthalmology)': ['Ophthalmology'],
  'General Medicine': ['Family Medicine'],
};

export default function HospitalDetails() {
  const { id } = useParams();
  const [hospital, setHospital] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('All doctors');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setSelectedDepartment('All doctors');
    api.get(`/hospitals/${id}`)
      .then((response) => {
        if (active) setHospital(response.data.hospital);
      })
      .catch((requestError) => {
        if (!active) return;
        setHospital(null);
        setError(requestError.response?.data?.message || 'Could not load this hospital. Please try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return <div className="rounded-3xl border border-maroon/10 bg-white p-8 text-center text-slate-600">Loading hospital details...</div>;
  }

  if (!hospital) {
    return <div className="rounded-3xl border border-red-200 bg-white p-8 text-center text-red-700">{error || 'Hospital not found.'}</div>;
  }

  const departments = hospital.departments || [];
  const doctors = hospital.doctors || [];
  const filteredDoctors = selectedDepartment === 'All doctors'
    ? doctors
    : doctors.filter((doctor) => matchesDepartment(doctor, selectedDepartment));
  const phoneLink = hospital.phone && /\d/.test(hospital.phone)
    ? `tel:${hospital.phone.replace(/[^\d+]/g, '')}`
    : null;

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-[32px] border border-maroon/10 bg-white shadow-soft">
        <img src={hospital.image || '/images/hospitals/hospital-placeholder.svg'} alt={hospital.name} className="h-64 w-full object-cover" />
        <div className="p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-saffron">{hospital.dzongkhag}</p>
              <h1 className="font-display text-4xl text-maroon">{hospital.name}</h1>
            </div>
            {phoneLink
              ? <a href={phoneLink} className="inline-flex rounded-full bg-maroon px-4 py-2 text-sm font-semibold text-white hover:bg-maroon/90">Call {hospital.phone}</a>
              : <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">{hospital.phone || 'Contact details unavailable'}</div>}
          </div>
          <p className="mt-4 text-slate-600">{hospital.address}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[32px] border border-maroon/10 bg-white p-6 shadow-soft">
          <h2 className="font-display text-2xl text-ink">Departments</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={selectedDepartment === 'All doctors'}
              onClick={() => setSelectedDepartment('All doctors')}
              className={`rounded-full px-3 py-2 text-sm font-medium transition ${selectedDepartment === 'All doctors' ? 'bg-maroon text-white' : 'bg-saffron/20 text-maroon hover:bg-saffron/40'}`}
            >
              All doctors
            </button>
            {departments.map((department) => (
              <button
                type="button"
                key={department}
                aria-pressed={selectedDepartment === department}
                onClick={() => setSelectedDepartment(department)}
                className={`rounded-full px-3 py-2 text-sm font-medium transition ${selectedDepartment === department ? 'bg-maroon text-white' : 'bg-saffron/20 text-maroon hover:bg-saffron/40'}`}
              >
                {department}
              </button>
            ))}
            {!departments.length && <p className="text-sm text-slate-500">No department information is listed for this hospital yet.</p>}
          </div>
        </div>
        <div className="rounded-[32px] border border-maroon/10 bg-white p-6 shadow-soft">
          <h2 className="font-display text-2xl text-ink">About</h2>
          <p className="mt-4 text-slate-600">{hospital.description || 'Comprehensive care and specialist support across hospital departments.'}</p>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl text-maroon">{selectedDepartment === 'All doctors' ? 'Doctors' : selectedDepartment}</h2>
            {doctors.length > 0 && <p className="mt-1 text-sm text-slate-500">Showing {filteredDoctors.length} of {doctors.length} doctors</p>}
          </div>
        </div>
        <div className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredDoctors.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}
          {!doctors.length && <p className="rounded-2xl bg-white p-5 text-slate-600 md:col-span-2 xl:col-span-3">Online appointment schedules are not available for this hospital yet. Please contact the hospital directly using the number above.</p>}
          {doctors.length > 0 && !filteredDoctors.length && <p className="rounded-2xl bg-white p-5 text-slate-600 md:col-span-2 xl:col-span-3">No doctors are currently listed in this department.</p>}
        </div>
      </div>
    </div>
  );
}

function matchesDepartment(doctor, department) {
  const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
  const target = normalize(department);
  const specialties = [doctor.department, doctor.specialization].filter(Boolean).map(normalize);
  const aliases = (departmentAliases[department] || []).map(normalize);
  return specialties.some((specialty) => specialty === target || aliases.includes(specialty));
}
