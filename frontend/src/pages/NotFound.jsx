import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-100/80 flex items-center justify-center px-6 py-16">
      <div className="page-card max-w-xl w-full p-10 text-center">
        <h1 className="text-[5rem] font-black tracking-tight text-slate-900">404</h1>
        <p className="mt-4 text-lg text-slate-600">Looks like this page went wandering. Let’s get you back on track.</p>
        <Link to="/dashboard" className="mt-8 inline-flex btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;