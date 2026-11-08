import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    api.get('/appointments/my').then((response) => setAppointments(response.data.appointments || [])).catch(() => setAppointments([]));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-maroon">My appointments</h1>
      <div className="grid gap-4">
        {appointments.length ? appointments.map((appointment) => (
          <div key={appointment.id} className="rounded-[28px] border border-maroon/10 bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-display text-2xl text-ink">{appointment.reason}</div>
                <p className="text-slate-600">{appointment.doctorName || appointment.doctorId} • {appointment.date} at {appointment.time}</p>
              </div>
              <span className="rounded-full bg-saffron/20 px-3 py-1 text-sm font-semibold text-maroon">{appointment.status === 'BOOKED' ? 'Confirmed' : appointment.status}</span>
            </div>
          </div>
        )) : <div className="rounded-[28px] border border-maroon/10 bg-white p-8 text-slate-600">No appointments yet.</div>}
      </div>
    </div>
  );
}
