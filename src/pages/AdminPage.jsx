import { useState, useEffect } from 'react';
import {
  collection, query, where, orderBy, getDocs,
  updateDoc, addDoc, doc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { formatDate } from '../lib/utils';
import {
  CheckCircle, XCircle, Clock, ChevronDown, ChevronUp,
  User, Building2, Wrench, TrendingUp, FileText, Loader2,
} from 'lucide-react';

const STATUS_TABS = [
  { key: 'pending',  label: '검토 대기', icon: Clock },
  { key: 'approved', label: '승인됨',    icon: CheckCircle },
  { key: 'rejected', label: '거부됨',    icon: XCircle },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [reviewNotes, setReviewNotes] = useState({});
  const [processing, setProcessing] = useState(null);

  const fetchSubmissions = async (status) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'submissions'),
        where('status', '==', status),
        orderBy('submittedAt', 'desc')
      );
      const snap = await getDocs(q);
      setSubmissions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions(activeTab);
    setExpandedId(null);
  }, [activeTab]);

  const handleApprove = async (sub) => {
    setProcessing(sub.id);
    try {
      // submissions 상태 업데이트
      await updateDoc(doc(db, 'submissions', sub.id), {
        status: 'approved',
        reviewNotes: reviewNotes[sub.id] || '',
        reviewedAt: serverTimestamp(),
      });
      // cases 컬렉션에 발행
      await addDoc(collection(db, 'cases'), {
        title: sub.title,
        slug: sub.title
          .toLowerCase()
          .replace(/[^a-z0-9가-힣\s]/g, '')
          .replace(/\s+/g, '-')
          .substring(0, 60),
        company: sub.isAnonymous ? `익명 ${sub.industry}사` : sub.company,
        industry: sub.industry,
        impact: sub.impact || '',
        content: `## 사용 도구\n\n${sub.tools}\n\n## 구현 방식\n\n${sub.implementation}`,
        tags: [],
        author: sub.isAnonymous
          ? `${sub.submitterRole || ''} (익명)`
          : `${sub.submitterName || ''} ${sub.submitterRole || ''}`.trim(),
        isAnonymous: sub.isAnonymous || false,
        publishedAt: serverTimestamp(),
        submissionId: sub.id,
      });
      setSubmissions((prev) => prev.filter((s) => s.id !== sub.id));
    } catch (e) {
      alert('처리 중 오류가 발생했습니다.');
      console.error(e);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (sub) => {
    if (!reviewNotes[sub.id]?.trim()) {
      alert('거부 사유를 입력해주세요.');
      return;
    }
    setProcessing(sub.id);
    try {
      await updateDoc(doc(db, 'submissions', sub.id), {
        status: 'rejected',
        reviewNotes: reviewNotes[sub.id],
        reviewedAt: serverTimestamp(),
      });
      setSubmissions((prev) => prev.filter((s) => s.id !== sub.id));
    } catch (e) {
      alert('처리 중 오류가 발생했습니다.');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* 헤더 */}
      <div className="mb-10">
        <div className="text-sm font-medium text-blue-900 mb-1">Admin</div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">제보 검수 관리</h1>
      </div>

      {/* 탭 */}
      <div className="flex gap-1 mb-8 border-b border-slate-200">
        {STATUS_TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition -mb-px ${
              activeTab === key
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {key === 'pending' && submissions.length > 0 && activeTab === 'pending' && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-900 text-white rounded-full">
                {submissions.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 목록 */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-blue-900/20 border-t-blue-900 rounded-full animate-spin" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          {activeTab === 'pending' ? '검토 대기 중인 제보가 없습니다.' :
           activeTab === 'approved' ? '승인된 제보가 없습니다.' : '거부된 제보가 없습니다.'}
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => (
            <SubmissionCard
              key={sub.id}
              sub={sub}
              expanded={expandedId === sub.id}
              onToggle={() => setExpandedId(expandedId === sub.id ? null : sub.id)}
              reviewNote={reviewNotes[sub.id] || ''}
              onNoteChange={(v) => setReviewNotes((p) => ({ ...p, [sub.id]: v }))}
              onApprove={() => handleApprove(sub)}
              onReject={() => handleReject(sub)}
              processing={processing === sub.id}
              showActions={activeTab === 'pending'}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SubmissionCard({ sub, expanded, onToggle, reviewNote, onNoteChange, onApprove, onReject, processing, showActions }) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:border-slate-300 transition">
      {/* 요약 헤더 */}
      <button onClick={onToggle} className="w-full text-left p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                {sub.industry}
              </span>
              {sub.isAnonymous && (
                <span className="text-xs font-medium px-2 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-100">
                  익명
                </span>
              )}
              <span className="text-xs text-slate-400">
                {sub.submittedAt ? formatDate(sub.submittedAt) : ''}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 truncate">{sub.title}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{sub.company}</p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            {sub.impact && (
              <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded font-medium hidden sm:block">
                {sub.impact}
              </span>
            )}
            {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </div>
      </button>

      {/* 상세 내용 */}
      {expanded && (
        <div className="border-t border-slate-100 p-5 space-y-4 bg-slate-50">
          <DetailRow icon={<Building2 className="w-4 h-4" />} label="회사명" value={sub.company} />
          <DetailRow icon={<Wrench className="w-4 h-4" />} label="사용 도구" value={sub.tools} />
          <DetailRow icon={<FileText className="w-4 h-4" />} label="구현 방식" value={sub.implementation} multiline />
          {sub.impact && <DetailRow icon={<TrendingUp className="w-4 h-4" />} label="성과" value={sub.impact} />}
          <DetailRow
            icon={<User className="w-4 h-4" />}
            label="제보자"
            value={`${sub.submitterName || '-'} · ${sub.submitterRole || '-'} · ${sub.submitterEmail || '-'}`}
          />

          {/* 리뷰 노트 + 액션 */}
          {showActions && (
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <label className="block text-sm font-medium text-slate-700">
                검토 메모 <span className="text-slate-400 font-normal">(거부 시 필수)</span>
              </label>
              <textarea
                rows={3}
                value={reviewNote}
                onChange={(e) => onNoteChange(e.target.value)}
                placeholder="제보자에게 전달할 메모를 입력하세요."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100 resize-none bg-white"
              />
              <div className="flex gap-3">
                <button
                  onClick={onApprove}
                  disabled={processing}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
                >
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  승인 및 케이스 발행
                </button>
                <button
                  onClick={onReject}
                  disabled={processing}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                >
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                  거부
                </button>
              </div>
            </div>
          )}

          {/* 이미 처리된 경우 리뷰 노트 표시 */}
          {!showActions && sub.reviewNotes && (
            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm font-medium text-slate-700 mb-1">검토 메모</p>
              <p className="text-sm text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2">
                {sub.reviewNotes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const DetailRow = ({ icon, label, value, multiline }) => (
  <div className="flex gap-3">
    <div className="text-slate-400 mt-0.5 shrink-0">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-slate-500 mb-0.5">{label}</p>
      <p className={`text-sm text-slate-800 ${multiline ? 'whitespace-pre-wrap' : ''}`}>{value || '-'}</p>
    </div>
  </div>
);
