import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../lib/auth';
import AuthModal from './AuthModal';

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
        active ? 'text-blue-900 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'
      }`}
    >
      {label}
    </Link>
  );
};

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, role, loading } = useAuth();
  const close = () => setMobileOpen(false);

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || '사용자';

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
            {role === 'admin' && <NavLink to="/admin" label="관리자" />}
          </div>

          {/* 데스크톱 우측 */}
          <div className="hidden md:flex items-center gap-2">
            {!loading && (
              user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 transition text-sm font-medium text-slate-700"
                  >
                    <div className="w-7 h-7 bg-blue-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {displayName[0].toUpperCase()}
                    </div>
                    {displayName}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                      <div className="px-3 py-2 text-xs text-slate-400 border-b border-slate-100">
                        {user.email}
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                      >
                        <LogOut className="w-4 h-4" /> 로그아웃
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="px-4 py-2 bg-blue-900 text-white text-sm font-medium rounded-md hover:bg-blue-800 transition"
                >
                  로그인
                </button>
              )
            )}
          </div>

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
            {role === 'admin' && <MobileNavLink to="/admin" label="관리자" onClick={close} />}
          </div>
          <div className="px-4 border-t border-slate-100 pt-4 space-y-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600">
                  <div className="w-7 h-7 bg-blue-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {displayName[0].toUpperCase()}
                  </div>
                  {displayName}
                </div>
                <button
                  onClick={() => { handleSignOut(); close(); }}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-slate-300 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 transition"
                >
                  <LogOut className="w-4 h-4" /> 로그아웃
                </button>
              </>
            ) : (
              <button
                onClick={() => { setShowAuth(true); close(); }}
                className="w-full py-3 bg-blue-900 text-white text-sm font-medium rounded-md hover:bg-blue-800 transition"
              >
                로그인 / 회원가입
              </button>
            )}
          </div>
        </div>
      )}

      {/* 로그인 모달 */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
