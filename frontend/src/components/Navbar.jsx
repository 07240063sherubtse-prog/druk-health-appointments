import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-maroon/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-maroon text-sm font-bold text-saffron">DHA</div>
          <div>
            <div className="font-display text-xl text-maroon">Druk Health Appointments</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Healthcare closer to every Dzongkhag</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          <NavLink to="/" className="hover:text-maroon">Home</NavLink>
          <NavLink to="/find-hospitals" className="hover:text-maroon">Find hospitals</NavLink>
          {user && <NavLink to="/my-appointments" className="hover:text-maroon">My appointments</NavLink>}
        </nav>

        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login" className="rounded-full border border-maroon px-4 py-2 text-sm font-semibold text-maroon">Login</Link>
              <Link to="/register" className="rounded-full bg-maroon px-4 py-2 text-sm font-semibold text-white">Register</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="text-sm font-semibold text-maroon">Profile</Link>
              <button onClick={logout} className="rounded-full bg-saffron px-4 py-2 text-sm font-semibold text-maroon">Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
