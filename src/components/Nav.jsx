import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X } from 'lucide-react';

const NavLink = ({ to, label, onClick }) => {
  const { pathname } = useLocation();
  const active = pathname === to || (to !== '/' && pathname.startsWith(to));
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-md transition ${
        active ? 'text-blue-900 bg-blue-50' : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      {label}
    </Link>
  );
};

const MobileNavLink = ({ to, label, onClick }) => {
  const { pathname } = useLocation();
  const active = pathname === to || (to !== '/' && pathname.startsWith(to));
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-4 py-3 text-base font-medium rounded-lg transition ${
        active
          ? 'text-blue-900 bg-blue-50'
          : 'text-slate-700 hover:bg-slate-50'
      }`}
    >
      {label}
    </Link>
  );
};

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = () => setMobileOpen(false);

  return (
    <>
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* 로고 */}
          <Link to="/" onClick={close} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-900 rounded flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-lg">
              회계<span className="text-blue-900">.AI</span>
            </span>
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/howto" label="How-to" />
            <NavLink to="/cases" label="Case Study" />
            <NavLink to="/submit" label="사례 제보" />
            <NavLink to="/about" label="소개" />
          </div>

          {/* 데스크톱 CTA */}
          <button className="hidden md:block px-4 py-2 bg-blue-900 text-white text-sm font-medium rounded-md hover:bg-blue-800 transition">
            뉴스레터 구독
          </button>

          {/* 모바일 햄버거 */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100 transition"
            aria-label="메뉴"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* 모바일 드롭다운 */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-white border-t border-slate-200">
          <div className="px-4 pt-4 pb-6 space-y-1">
            <MobileNavLink to="/howto" label="How-to 가이드" onClick={close} />
            <MobileNavLink to="/cases" label="Case Study" onClick={close} />
            <MobileNavLink to="/submit" label="사례 제보" onClick={close} />
            <MobileNavLink to="/about" label="소개" onClick={close} />
          </div>
          <div className="px-4 border-t border-slate-100 pt-4">
            <button
              onClick={close}
              className="w-full py-3 bg-blue-900 text-white text-sm font-medium rounded-md hover:bg-blue-800 transition"
            >
              뉴스레터 구독
            </button>
          </div>
        </div>
      )}
    </>
  );
}
