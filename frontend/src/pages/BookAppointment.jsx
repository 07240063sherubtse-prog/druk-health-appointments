import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function BookAppointment() {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/hospitals/doctors').then((response) => {
      const match = response.data.doctors.find((item) => item.id === doctorId);
      setDoctor(match || null);
    });
  }, [doctorId]);

  useEffect(() => {
    if (!doctor || !date) {
      setSlots([]);
      setTime('');
      return;
    }

    api.get(`/slots/${doctorId}?date=${date}`)
      .then((response) => {
        const nextSlots = response.data.slots || [];
        setSlots(nextSlots.map((slot) => slot.time));
        setTime(nextSlots[0]?.time || '');
      })
      .catch(() => {
        setSlots([]);
        setTime('');
      });
  }, [doctor, doctorId, date]);

  async function handleBooking() {
    try {
      const response = await api.post('/appointments', {
        doctorId,
        hospitalId: doctor.hospitalId,
        date,
        time,
        reason,
      });
      setMessage(`Appointment booked successfully. ID: ${response.data.appointment.id}`);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not book this appointment.');
    }
  }

  if (!doctor) {
    return <div className="rounded-3xl border border-maroon/10 bg-white p-8 text-center text-slate-600">Loading doctor details...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl rounded-[32px] border border-maroon/10 bg-white p-8 shadow-soft">
      <h1 className="font-display text-3xl text-maroon">Book appointment</h1>
      <div className="mt-5 rounded-2xl bg-cream p-5">
        <div className="font-display text-2xl text-ink">{doctor.name}</div>
        <p className="text-slate-600">{doctor.specialization} • {doctor.hospitalName}</p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Appointment date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-maroon" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Preferred time</label>
          <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-maroon" disabled={!slots.length}>
            {slots.length ? slots.map((slot) => <option key={slot} value={slot}>{slot}</option>) : <option value="">Select a date</option>}
          </select>
        </div>
      </div>
      <div className="mt-4">
        <label className="mb-1 block text-sm font-medium">Reason for visit</label>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows="4" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-maroon" placeholder="Please share your symptoms or reason for consultation." />
      </div>
      <button onClick={handleBooking} disabled={!date || !time || !reason} className="mt-6 rounded-full bg-maroon px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">Confirm booking</button>
      {message && <p className="mt-4 rounded-xl bg-slate-100 p-3 text-sm text-slate-700">{message}</p>}
    </div>
  );
}
