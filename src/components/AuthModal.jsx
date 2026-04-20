import { useState } from 'react';
import { X, Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';
import { signIn, signUp } from '../lib/auth';

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ email: '', password: '', displayName: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        await signIn(form.email, form.password);
      } else {
        if (!form.displayName.trim()) {
          setError('이름을 입력해주세요.');
          setLoading(false);
          return;
        }
        await signUp(form.email, form.password, form.displayName);
      }
      onClose();
    } catch (e) {
      setError(getErrorMessage(e.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* 모달 */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 헤더 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
            {mode === 'login' ? '로그인' : '회원가입'}
          </h2>
          <p className="text-sm text-slate-500">
            {mode === 'login'
              ? '사례 제보 및 커뮤니티 참여를 위해 로그인하세요.'
              : '가입 후 자동화 사례를 제보할 수 있습니다.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <Field
              icon={<User className="w-4 h-4" />}
              name="displayName"
              type="text"
              placeholder="이름 (닉네임)"
              value={form.displayName}
              onChange={handleChange}
            />
          )}
          <Field
            icon={<Mail className="w-4 h-4" />}
            name="email"
            type="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
          />
          <Field
            icon={<Lock className="w-4 h-4" />}
            name="password"
            type="password"
            placeholder="비밀번호 (6자 이상)"
            value={form.password}
            onChange={handleChange}
          />

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === 'login' ? '로그인' : '가입하기'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          {mode === 'login' ? (
            <>
              계정이 없으신가요?{' '}
              <button
                onClick={() => { setMode('signup'); setError(''); }}
                className="text-blue-900 font-medium hover:underline"
              >
                회원가입
              </button>
            </>
          ) : (
            <>
              이미 계정이 있으신가요?{' '}
              <button
                onClick={() => { setMode('login'); setError(''); }}
                className="text-blue-900 font-medium hover:underline"
              >
                로그인
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const Field = ({ icon, name, type, placeholder, value, onChange }) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
    />
  </div>
);

function getErrorMessage(code) {
  const map = {
    'auth/invalid-email': '이메일 형식이 올바르지 않습니다.',
    'auth/user-not-found': '등록되지 않은 이메일입니다.',
    'auth/wrong-password': '비밀번호가 틀렸습니다.',
    'auth/invalid-credential': '이메일 또는 비밀번호가 올바르지 않습니다.',
    'auth/email-already-in-use': '이미 사용 중인 이메일입니다.',
    'auth/weak-password': '비밀번호는 6자 이상이어야 합니다.',
    'auth/too-many-requests': '잠시 후 다시 시도해주세요.',
  };
  return map[code] || '오류가 발생했습니다. 다시 시도해주세요.';
}
