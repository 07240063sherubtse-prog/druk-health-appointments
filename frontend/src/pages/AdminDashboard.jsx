import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    api.get('/appointments/admin-dashboard').then((response) => setAppointments(response.data.appointments || [])).catch(() => setAppointments([]));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-maroon">Admin dashboard</h1>
      {appointments.length ? appointments.map((appointment) => (
        <div key={appointment.id} className="rounded-[28px] border border-maroon/10 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="font-display text-2xl text-ink">{appointment.patientName || `Patient ${appointment.patientId}`}</div>
            <span className="rounded-full bg-saffron/20 px-3 py-1 text-sm font-semibold text-maroon">{appointment.status}</span>
          </div>
          <p className="mt-2 text-slate-600">{appointment.doctorName || `Doctor ${appointment.doctorId}`} • {appointment.date} • {appointment.time}</p>
        </div>
      )) : <div className="rounded-[28px] border border-maroon/10 bg-white p-8 text-slate-600">No appointment data yet.</div>}
    </div>
  );
}
