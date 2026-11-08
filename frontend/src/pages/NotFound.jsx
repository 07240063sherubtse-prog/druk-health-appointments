import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="rounded-[32px] border border-maroon/10 bg-white p-12 text-center shadow-soft">
      <h1 className="font-display text-5xl text-maroon">404</h1>
      <p className="mt-4 text-slate-600">This page could not be found.</p>
      <Link to="/" className="mt-6 inline-flex rounded-full bg-maroon px-6 py-3 font-semibold text-white">Return home</Link>
    </div>
  );
}
