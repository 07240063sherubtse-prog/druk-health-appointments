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
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsMessage, setSlotsMessage] = useState('');
  const [message, setMessage] = useState('');
  const [bookingError, setBookingError] = useState(false);

  useEffect(() => {
    let active = true;
    api.get('/hospitals/doctors').then((response) => {
      const match = response.data.doctors.find((item) => item.id === doctorId);
      if (active) setDoctor(match || null);
    }).catch(() => {
      if (active) setMessage('Could not load this doctor. Please return to the hospital page and choose a doctor again.');
    });
    return () => { active = false; };
  }, [doctorId]);

  useEffect(() => {
    let active = true;
    if (!doctor || !date) {
      setSlots([]);
      setTime('');
      setSlotsMessage('Choose an appointment date to see available times.');
      return () => { active = false; };
    }

    setSlotsLoading(true);
    setSlotsMessage('');
    setTime('');
    api.get(`/slots/${doctorId}?date=${date}`)
      .then((response) => {
        const nextSlots = response.data.slots || [];
        if (!active) return;
        const times = nextSlots.map((slot) => slot.time);
        setSlots(times);
        setTime(times[0] || '');
        setSlotsMessage(times.length ? '' : 'No appointment times are available for this date. Choose another date.');
      })
      .catch((error) => {
        if (!active) return;
        setSlots([]);
        setTime('');
        setSlotsMessage(error.response?.data?.message || 'Could not load appointment times. Please try again.');
      })
      .finally(() => {
        if (active) setSlotsLoading(false);
      });
    return () => { active = false; };
  }, [doctor, doctorId, date]);

  async function handleBooking() {
    setBookingError(false);
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
      const response = error.response?.data;
      const fieldErrors = response?.details?.map(({ path, message: detail }) => `${path}: ${detail}`) || [];
      setMessage([response?.message || 'Could not book this appointment.', ...fieldErrors].join(' '));
      setBookingError(true);
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
          <input type="date" min={todayInBhutan()} value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-maroon" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Preferred time</label>
          <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-maroon" disabled={!date || slotsLoading || !slots.length}>
            <option value="">{slotsLoading ? 'Loading available times…' : slots.length ? 'Choose a time' : 'Select a date'}</option>
            {slots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
          </select>
        </div>
      </div>
      {slotsMessage && <p className="mt-2 text-sm text-slate-600" role="status">{slotsMessage}</p>}
      <div className="mt-4">
        <label className="mb-1 block text-sm font-medium">Reason for visit</label>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows="4" minLength={3} maxLength={1000} required className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-maroon" placeholder="Please share your symptoms or reason for consultation." />
      </div>
      <button onClick={handleBooking} disabled={!date || !time || !reason.trim() || slotsLoading || !slots.includes(time)} className="mt-6 rounded-full bg-maroon px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">Confirm booking</button>
      {message && <p className={`mt-4 rounded-xl p-3 text-sm ${bookingError ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-700'}`}>{message}</p>}
    </div>
  );
}

function todayInBhutan() {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Thimphu',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}
