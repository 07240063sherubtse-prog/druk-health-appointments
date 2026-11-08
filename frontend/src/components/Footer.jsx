export default function Footer() {
  return (
    <footer className="border-t border-maroon/10 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <div>© {new Date().getFullYear()} Druk Health Appointments</div>
        <div>Trusted healthcare access across Bhutan</div>
      </div>
    </footer>
  );
}
