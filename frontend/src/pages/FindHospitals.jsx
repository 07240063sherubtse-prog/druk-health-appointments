import { useEffect, useState } from 'react';
import HospitalCard from '../components/HospitalCard';
import api from '../api/axios';

export default function FindHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch] = useState('');
  const [radius, setRadius] = useState(50);
  const [loading, setLoading] = useState(true);

  async function loadHospitals(nextSearch = search) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('q', nextSearch);
      params.set('radius', String(radius));

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            params.set('lat', String(position.coords.latitude));
            params.set('lng', String(position.coords.longitude));
            const { data } = await api.get(`/hospitals?${params.toString()}`);
            setHospitals(data.hospitals || []);
            setLoading(false);
          },
          async () => {
            const { data } = await api.get(`/hospitals?${params.toString()}`);
            setHospitals(data.hospitals || []);
            setLoading(false);
          }
        );
      } else {
        const { data } = await api.get(`/hospitals?${params.toString()}`);
        setHospitals(data.hospitals || []);
        setLoading(false);
      }
    } catch (error) {
      setHospitals([]);
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHospitals();
  }, [radius]);

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-maroon/10 bg-white p-6 shadow-soft">
        <h1 className="font-display text-3xl text-maroon">Find hospitals near you</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_180px_auto]">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by hospital or Dzongkhag" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-maroon" />
          <select value={radius} onChange={(e) => setRadius(e.target.value)} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-maroon">
            <option value="10">10 km</option>
            <option value="25">25 km</option>
            <option value="50">50 km</option>
            <option value="100">100 km</option>
          </select>
          <button onClick={() => loadHospitals()} className="rounded-full bg-maroon px-5 py-3 font-semibold text-white">Search</button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-maroon/10 bg-white p-12 text-center text-slate-600">Loading hospitals...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {hospitals.length ? hospitals.map((hospital) => <HospitalCard key={hospital.id} hospital={hospital} />) : <div className="rounded-3xl border border-maroon/10 bg-white p-8 text-slate-600 md:col-span-2 xl:col-span-3">No hospitals found for your search.</div>}
        </div>
      )}
    </div>
  );
}
