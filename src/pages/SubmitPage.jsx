import { useState } from 'react';
import { FileText, CheckCircle, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { submitCase } from '../hooks/useSubmissions';

const FormField = ({ label, placeholder, textarea, value, onChange, name, required }) => (
  <div>
    <label className="block text-sm font-medium text-slate-900 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {textarea ? (
      <textarea
        name={name}
        rows={4}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100 resize-none"
      />
    ) : (
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
      />
    )}
  </div>
);

const ProcessStep = ({ n, title, desc }) => (
  <div className="bg-white rounded p-3 border border-blue-100">
    <div className="text-blue-900 font-bold text-sm mb-1">{n}. {title}</div>
    <div className="text-slate-600 text-xs">{desc}</div>
  </div>
);

export default function SubmitPage() {
  const { user, loading } = useAuth();
  const [form, setForm] = useState({
    company: '', industry: '', title: '',
    tools: '', implementation: '', impact: '',
    submitterName: '', submitterEmail: '', submitterRole: '',
    isAnonymous: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError('');
    try {
      await submitCase({
        ...form,
        submitterEmail: form.submitterEmail || user.email,
      }, user);
      setSubmitted(true);
    } catch (e) {
      setError('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  // 비로그인 상태
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <LogIn className="w-7 h-7 text-blue-900" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">로그인이 필요합니다</h2>
        <p className="text-slate-600 mb-2">
          사례 제보는 스팸 방지를 위해 로그인 후 이용하실 수 있습니다.
        </p>
        <p className="text-sm text-slate-500">우측 상단 <strong>로그인</strong> 버튼을 눌러주세요.</p>
      </div>
    );
  }

  // 제출 완료
  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">제보가 접수되었습니다!</h2>
        <p className="text-slate-600 mb-8">
          3~5영업일 내에 검토 후 연락드리겠습니다.<br />
          공개 전 반드시 최종 확인 메일을 드립니다.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ company:'', industry:'', title:'', tools:'', implementation:'', impact:'', submitterName:'', submitterEmail:'', submitterRole:'', isAnonymous:false }); }}
          className="px-6 py-3 bg-blue-900 text-white font-medium rounded-md hover:bg-blue-800 transition"
        >
          다른 사례 제보하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-10">
        <div className="text-sm font-medium text-blue-900 mb-2">Share Your Case</div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
          우리 팀의 자동화 사례 제보
        </h1>
        <p className="text-lg text-slate-600">
          작은 자동화도 누군가에게는 큰 힌트가 됩니다. 제보하신 내용은 검수 후 공개되며,
          익명·가명 처리가 가능합니다.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 mb-8">
        <div className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4" /> 공개까지의 프로세스
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <ProcessStep n="1" title="제보" desc="폼 제출" />
          <ProcessStep n="2" title="검수" desc="3~5영업일 내 연락" />
          <ProcessStep n="3" title="공개" desc="익명 옵션 가능" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-slate-200 rounded-xl p-8">
        <FormField required name="company" label="회사명 (익명 처리 가능)"
          placeholder="예: **제약 또는 '익명 제약사'" value={form.company} onChange={handleChange} />
        <FormField required name="industry" label="산업군"
          placeholder="예: 제약, 제조, IT, 유통" value={form.industry} onChange={handleChange} />
        <FormField required name="title" label="자동화한 업무"
          placeholder="예: 월별 결산 체크리스트 관리" value={form.title} onChange={handleChange} />
        <FormField required name="tools" label="사용한 AI 도구"
          placeholder="예: ChatGPT, Claude, Notion AI, 자체 GPT 래퍼 등" value={form.tools} onChange={handleChange} />
        <FormField required name="implementation" label="구체적인 구현 방식"
          placeholder="프롬프트, 워크플로우, 연결한 도구 등 최대한 자세히"
          textarea value={form.implementation} onChange={handleChange} />
        <FormField name="impact" label="정량적 성과 (선택)"
          placeholder="예: 월 8시간 → 1시간, 오류율 40% 감소" value={form.impact} onChange={handleChange} />

        <div className="border-t border-slate-100 pt-6 space-y-4">
          <p className="text-sm font-medium text-slate-700">제보자 정보 (내부 확인용, 공개 안 됨)</p>
          <div className="grid grid-cols-2 gap-4">
            <FormField name="submitterName" label="이름" placeholder="홍길동"
              value={form.submitterName} onChange={handleChange} />
            <FormField name="submitterRole" label="직책" placeholder="재무팀 과장"
              value={form.submitterRole} onChange={handleChange} />
          </div>
          <FormField name="submitterEmail" label="이메일" placeholder="예: hong@company.com"
            value={form.submitterEmail} onChange={handleChange} />
        </div>

        <div className="flex items-start gap-2 pt-2">
          <input type="checkbox" id="anon" name="isAnonymous"
            checked={form.isAnonymous} onChange={handleChange} className="mt-1" />
          <label htmlFor="anon" className="text-sm text-slate-700">
            회사명·이름 공개 없이 <span className="font-medium">익명으로만 게시</span>하고 싶습니다
          </label>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">{error}</p>
        )}

        <button type="submit" disabled={submitting}
          className="w-full py-3 bg-blue-900 text-white font-medium rounded-md hover:bg-blue-800 transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {submitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          제보 제출하기
        </button>
        <p className="text-xs text-slate-500 text-center">
          제출 전 검수 과정이 진행되며, 공개 전 반드시 제보자께 최종 확인 메일을 드립니다.
        </p>
      </form>
    </div>
  );
}
