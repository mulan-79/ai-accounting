import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, requiredRole = 'admin' }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-blue-900/20 border-t-blue-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  const hierarchy = { reader: 0, editor: 1, admin: 2 };
  if ((hierarchy[role] ?? 0) < (hierarchy[requiredRole] ?? 2)) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-2xl font-bold text-slate-900 mb-3">접근 권한이 없습니다</p>
        <p className="text-slate-500">관리자 계정으로 로그인해주세요.</p>
      </div>
    );
  }

  return children;
}
