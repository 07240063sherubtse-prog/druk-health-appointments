import { useEffect, useState } from 'react';
import HospitalCard from '../components/HospitalCard';
import api from '../api/axios';

export default function FindHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch] = useState('');
  const [radius, setRadius] = useState(50);
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadHospitals(nextSearch = search) {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.set('q', nextSearch);
      params.set('radius', String(radius));

      if (nearbyOnly && navigator.geolocation) {
        const position = await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(resolve, () => resolve(null), { timeout: 10000 });
        });
        if (position && !nextSearch.trim()) {
          params.set('lat', String(position.coords.latitude));
          params.set('lng', String(position.coords.longitude));
        }
      }

      const { data } = await api.get(`/hospitals?${params.toString()}`);
      setHospitals(data.hospitals || []);
    } catch (error) {
      setHospitals([]);
      setError(error.response?.data?.message || 'Could not load hospitals. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHospitals('');
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-maroon/10 bg-white p-6 shadow-soft">
        <h1 className="font-display text-3xl text-maroon">Find hospitals across Bhutan</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_180px_auto]">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by hospital or Dzongkhag" className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-maroon" />
          <select value={radius} onChange={(e) => setRadius(e.target.value)} disabled={!nearbyOnly} className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-maroon disabled:bg-slate-50 disabled:text-slate-400">
            <option value="10">10 km</option>
            <option value="25">25 km</option>
            <option value="50">50 km</option>
            <option value="100">100 km</option>
          </select>
          <button onClick={() => loadHospitals()} className="rounded-full bg-maroon px-5 py-3 font-semibold text-white">Search</button>
          <label className="flex items-center gap-2 text-sm text-slate-600 md:col-span-3">
            <input type="checkbox" checked={nearbyOnly} onChange={(event) => setNearbyOnly(event.target.checked)} />
            Limit to nearby hospitals (asks for location permission when searched)
          </label>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-maroon/10 bg-white p-12 text-center text-slate-600">Loading hospitals...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {error && <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-red-700 md:col-span-2 xl:col-span-3">{error}</div>}
          {hospitals.length ? hospitals.map((hospital) => <HospitalCard key={hospital.id} hospital={hospital} />) : <div className="rounded-3xl border border-maroon/10 bg-white p-8 text-slate-600 md:col-span-2 xl:col-span-3">No hospitals found for your search.</div>}
        </div>
      )}
    </div>
  );
}
