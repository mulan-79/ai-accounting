import { Link, useLocation } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const NavLink = ({ to, label }) => {
  const { pathname } = useLocation();
  const active = pathname === to || (to !== '/' && pathname.startsWith(to));
  return (
    <Link
      to={to}
      className={`px-4 py-2 text-sm font-medium rounded-md transition ${
        active ? 'text-blue-900 bg-blue-50' : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      {label}
    </Link>
  );
};

export default function Nav() {
  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-900 rounded flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight text-lg">
            회계<span className="text-blue-900">.AI</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/howto" label="How-to" />
          <NavLink to="/cases" label="Case Study" />
          <NavLink to="/submit" label="사례 제보" />
          <NavLink to="/about" label="소개" />
        </div>
        <button className="px-4 py-2 bg-blue-900 text-white text-sm font-medium rounded-md hover:bg-blue-800 transition">
          뉴스레터 구독
        </button>
      </div>
    </nav>
  );
}
