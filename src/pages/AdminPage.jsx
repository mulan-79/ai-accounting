import { useState, useEffect } from 'react';
import {
  collection, query, where, orderBy, getDocs,
  updateDoc, addDoc, doc, serverTimestamp, deleteDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { formatDate } from '../lib/utils';
import MarkdownRenderer from '../components/MarkdownRenderer';
import {
  CheckCircle, XCircle, Clock, ChevronDown, ChevronUp,
  User, Building2, Wrench, TrendingUp, FileText, Loader2,
  BookOpen, Briefcase, Plus, Pencil, Trash2, Eye, EyeOff, X,
} from 'lucide-react';

const MAIN_TABS = [
  { key: 'submissions', label: '제보 검수',   icon: FileText },
  { key: 'guides',      label: '가이드 관리', icon: BookOpen },
  { key: 'cases',       label: '케이스 관리', icon: Briefcase },
];

export default function AdminPage() {
  const [mainTab, setMainTab] = useState('submissions');

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-8">
        <div className="text-sm font-medium text-blue-900 mb-1">Admin</div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">관리자</h1>
      </div>

      {/* 메인 탭 */}
      <div className="flex gap-1 mb-8 border-b border-slate-200">
        {MAIN_TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setMainTab(key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition -mb-px ${
              mainTab === key
                ? 'border-blue-900 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {mainTab === 'submissions' && <SubmissionsTab />}
      {mainTab === 'guides'      && <ContentTab type="guides" />}
      {mainTab === 'cases'       && <ContentTab type="cases" />}
    </div>
  );
}

/* ─────────────────────────────────────────
   제보 검수 탭
───────────────────────────────────────── */
const STATUS_TABS = [
  { key: 'pending',  label: '검토 대기', icon: Clock },
  { key: 'approved', label: '승인됨',    icon: CheckCircle },
  { key: 'rejected', label: '거부됨',    icon: XCircle },
];

function SubmissionsTab() {
  const [activeTab, setActiveTab]     = useState('pending');
  const [allSubs, setAllSubs]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [expandedId, setExpandedId]   = useState(null);
  const [reviewNotes, setReviewNotes] = useState({});
  const [processing, setProcessing]   = useState(null);

  // 인덱스 불필요 — 전체 로드 후 클라이언트 필터링
  const loadAll = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'submissions'));
      const docs = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => {
          const ta = a.submittedAt?.toDate?.() ?? new Date(a.submittedAt ?? 0);
          const tb = b.submittedAt?.toDate?.() ?? new Date(b.submittedAt ?? 0);
          return tb - ta;
        });
      setAllSubs(docs);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadAll(); }, []);
  useEffect(() => { setExpandedId(null); }, [activeTab]);

  const submissions = allSubs.filter(s => (s.status || 'pending') === activeTab);

  const handleApprove = async (sub) => {
    setProcessing(sub.id);
    try {
      await updateDoc(doc(db, 'submissions', sub.id), {
        status: 'approved', reviewNotes: reviewNotes[sub.id] || '', reviewedAt: serverTimestamp(),
      });
      await addDoc(collection(db, 'cases'), {
        title: sub.title,
        slug: sub.title.toLowerCase().replace(/[^a-z0-9가-힣\s]/g, '').replace(/\s+/g, '-').substring(0, 60),
        company: sub.isAnonymous ? `익명 ${sub.industry}사` : sub.company,
        industry: sub.industry, impact: sub.impact || '',
        content: `## 사용 도구\n\n${sub.tools}\n\n## 구현 방식\n\n${sub.implementation}`,
        tags: [],
        author: sub.isAnonymous ? `${sub.submitterRole || ''} (익명)` : `${sub.submitterName || ''} ${sub.submitterRole || ''}`.trim(),
        isAnonymous: sub.isAnonymous || false,
        publishedAt: serverTimestamp(), submissionId: sub.id,
      });
      await loadAll();
    } catch { alert('처리 중 오류가 발생했습니다.'); }
    finally { setProcessing(null); }
  };

  const handleReject = async (sub) => {
    if (!reviewNotes[sub.id]?.trim()) { alert('거부 사유를 입력해주세요.'); return; }
    setProcessing(sub.id);
    try {
      await updateDoc(doc(db, 'submissions', sub.id), {
        status: 'rejected', reviewNotes: reviewNotes[sub.id], reviewedAt: serverTimestamp(),
      });
      await loadAll();
    } catch { alert('처리 중 오류가 발생했습니다.'); }
    finally { setProcessing(null); }
  };

  return (
    <>
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-lg w-fit">
        {STATUS_TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition ${
              activeTab === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue-900/20 border-t-blue-900 rounded-full animate-spin" /></div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-20 text-slate-400">제보가 없습니다.</div>
      ) : (
        <div className="space-y-3">
          {submissions.map(sub => (
            <SubmissionCard key={sub.id} sub={sub}
              expanded={expandedId === sub.id}
              onToggle={() => setExpandedId(expandedId === sub.id ? null : sub.id)}
              reviewNote={reviewNotes[sub.id] || ''}
              onNoteChange={v => setReviewNotes(p => ({ ...p, [sub.id]: v }))}
              onApprove={() => handleApprove(sub)} onReject={() => handleReject(sub)}
              processing={processing === sub.id} showActions={activeTab === 'pending'} />
          ))}
        </div>
      )}
    </>
  );
}

function SubmissionCard({ sub, expanded, onToggle, reviewNote, onNoteChange, onApprove, onReject, processing, showActions }) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <button onClick={onToggle} className="w-full text-left p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded">{sub.industry}</span>
              {sub.isAnonymous && <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-100">익명</span>}
              <span className="text-xs text-slate-400">{sub.submittedAt ? formatDate(sub.submittedAt) : ''}</span>
            </div>
            <h3 className="font-bold text-slate-900 truncate">{sub.title}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{sub.company}</p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            {sub.impact && <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded font-medium hidden sm:block">{sub.impact}</span>}
            {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </div>
      </button>
      {expanded && (
        <div className="border-t border-slate-100 p-5 space-y-4 bg-slate-50">
          <DetailRow icon={<Building2 className="w-4 h-4" />} label="회사명" value={sub.company} />
          <DetailRow icon={<Wrench className="w-4 h-4" />} label="사용 도구" value={sub.tools} />
          <DetailRow icon={<FileText className="w-4 h-4" />} label="구현 방식" value={sub.implementation} multiline />
          {sub.impact && <DetailRow icon={<TrendingUp className="w-4 h-4" />} label="성과" value={sub.impact} />}
          <DetailRow icon={<User className="w-4 h-4" />} label="제보자" value={`${sub.submitterName || '-'} · ${sub.submitterRole || '-'} · ${sub.submitterEmail || '-'}`} />
          {showActions && (
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <textarea rows={3} value={reviewNote} onChange={e => onNoteChange(e.target.value)}
                placeholder="검토 메모 (거부 시 필수)" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-900 resize-none bg-white" />
              <div className="flex gap-3">
                <button onClick={onApprove} disabled={processing}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition disabled:opacity-50">
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} 승인 및 발행
                </button>
                <button onClick={onReject} disabled={processing}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition disabled:opacity-50">
                  {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />} 거부
                </button>
              </div>
            </div>
          )}
          {!showActions && sub.reviewNotes && (
            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm font-medium text-slate-700 mb-1">검토 메모</p>
              <p className="text-sm text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2">{sub.reviewNotes}</p>
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

/* ─────────────────────────────────────────
   가이드 / 케이스 관리 탭
───────────────────────────────────────── */
const GUIDE_CATEGORIES = ['결산', '보고서', '세무', '감사', 'RPA', '프롬프팅'];
const CASE_INDUSTRIES  = ['제약', '제조', 'IT', '유통', '금융', '서비스'];

const EMPTY_GUIDE = { title: '', slug: '', excerpt: '', category: '결산', tags: '', readTime: '', author: '', content: '' };
const EMPTY_CASE  = { title: '', slug: '', company: '', industry: '제조', impact: '', author: '', tags: '', content: '', isAnonymous: false };

function ContentTab({ type }) {
  const isGuide = type === 'guides';
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(null);   // null | 'new' | {id, ...}
  const [preview, setPreview]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [form, setForm]         = useState(isGuide ? EMPTY_GUIDE : EMPTY_CASE);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, type), orderBy('publishedAt', 'desc'));
      const snap = await getDocs(q);
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, [type]);

  const openNew  = () => { setForm(isGuide ? EMPTY_GUIDE : EMPTY_CASE); setEditing('new'); setPreview(false); };
  const openEdit = (item) => {
    setForm({ ...item, tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || '') });
    setEditing(item);
    setPreview(false);
  };
  const closeEditor = () => setEditing(null);

  const handleChange = e => {
    const { name, value, type: t, checked } = e.target;
    setForm(p => ({ ...p, [name]: t === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) { alert('제목을 입력해주세요.'); return; }
    setSaving(true);
    try {
      const tagsArr = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      const slug = form.slug.trim() || form.title.toLowerCase()
        .replace(/[^a-z0-9가-힣\s]/g, '').replace(/\s+/g, '-').substring(0, 60);
      const data = { ...form, tags: tagsArr, slug, publishedAt: serverTimestamp() };

      if (editing === 'new') {
        await addDoc(collection(db, type), data);
      } else {
        await updateDoc(doc(db, type, editing.id), data);
      }
      await fetchItems();
      closeEditor();
    } catch (e) { alert('저장 중 오류가 발생했습니다.'); console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async (item) => {
    if (!confirm(`"${item.title}" 을 삭제하시겠습니까?`)) return;
    await deleteDoc(doc(db, type, item.id));
    setItems(p => p.filter(i => i.id !== item.id));
  };

  if (editing) return (
    <Editor
      form={form} onChange={handleChange} onSave={handleSave} onClose={closeEditor}
      saving={saving} preview={preview} onTogglePreview={() => setPreview(v => !v)}
      isNew={editing === 'new'} isGuide={isGuide}
    />
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-slate-500">{items.length}개</p>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition">
          <Plus className="w-4 h-4" /> 새 {isGuide ? '가이드' : '케이스'} 작성
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-blue-900/20 border-t-blue-900 rounded-full animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-slate-400">아직 콘텐츠가 없습니다.</div>
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition">
              <div className="flex-1 min-w-0 mr-4">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">
                    {isGuide ? item.category : item.industry}
                  </span>
                  {item.publishedAt && <span className="text-xs text-slate-400">{formatDate(item.publishedAt)}</span>}
                </div>
                <p className="font-semibold text-slate-900 truncate">{item.title}</p>
                {isGuide ? (
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{item.excerpt}</p>
                ) : (
                  <p className="text-xs text-slate-500 mt-0.5">{item.company} · {item.impact}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => openEdit(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                  <Pencil className="w-3.5 h-3.5" /> 수정
                </button>
                <button onClick={() => handleDelete(item)}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────
   에디터
───────────────────────────────────────── */
function Editor({ form, onChange, onSave, onClose, saving, preview, onTogglePreview, isNew, isGuide }) {
  return (
    <div className="space-y-6">
      {/* 에디터 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">
          {isNew ? `새 ${isGuide ? '가이드' : '케이스'} 작성` : '수정'}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={onTogglePreview}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border transition ${
              preview ? 'bg-slate-900 text-white border-slate-900' : 'text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}>
            {preview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {preview ? '에디터' : '미리보기'}
          </button>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 메타 정보 */}
      <div className="grid grid-cols-2 gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-slate-600 mb-1">제목 *</label>
          <input name="title" value={form.title} onChange={onChange} placeholder="제목을 입력하세요"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">슬러그 (URL)</label>
          <input name="slug" value={form.slug} onChange={onChange} placeholder="자동 생성 (비워두면 됨)"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100" />
        </div>
        {isGuide ? (
          <>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">카테고리</label>
              <select name="category" value={form.category} onChange={onChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-900">
                {GUIDE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">한 줄 요약</label>
              <input name="excerpt" value={form.excerpt} onChange={onChange} placeholder="목록에 표시되는 짧은 설명"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">읽는 시간</label>
              <input name="readTime" value={form.readTime} onChange={onChange} placeholder="예: 8분"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">작성자</label>
              <input name="author" value={form.author} onChange={onChange} placeholder="예: K팀장"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100" />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">산업군</label>
              <select name="industry" value={form.industry} onChange={onChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-900">
                {CASE_INDUSTRIES.map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">회사명</label>
              <input name="company" value={form.company} onChange={onChange} placeholder="예: 대원제약"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">성과 (임팩트)</label>
              <input name="impact" value={form.impact} onChange={onChange} placeholder="예: 작업시간 8h → 1h"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">작성자</label>
              <input name="author" value={form.author} onChange={onChange} placeholder="예: 김덕준 재무팀장"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div className="col-span-2 flex items-center gap-2 pt-1">
              <input type="checkbox" id="isAnonymous" name="isAnonymous" checked={form.isAnonymous} onChange={onChange} />
              <label htmlFor="isAnonymous" className="text-sm text-slate-700">익명 게시</label>
            </div>
          </>
        )}
        <div className="col-span-2">
          <label className="block text-xs font-medium text-slate-600 mb-1">태그 (쉼표로 구분)</label>
          <input name="tags" value={form.tags} onChange={onChange} placeholder="예: ChatGPT, 결산, 자동화"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100" />
        </div>
      </div>

      {/* 본문 에디터 / 미리보기 */}
      {preview ? (
        <div className="min-h-[500px] p-6 bg-white border border-slate-200 rounded-xl">
          <MarkdownRenderer content={form.content} />
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-slate-600">본문 (마크다운)</label>
            <span className="text-xs text-slate-400">{form.content.length}자</span>
          </div>
          <textarea name="content" value={form.content} onChange={onChange}
            rows={24} placeholder={`## 배경\n\n내용을 입력하세요...\n\n## 해결 방법\n\n...`}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm font-mono leading-relaxed focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100 resize-y"
          />
        </div>
      )}

      {/* 저장 버튼 */}
      <div className="flex gap-3 pt-2">
        <button onClick={onSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition disabled:opacity-60">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {isNew ? '발행하기' : '저장하기'}
        </button>
        <button onClick={onClose} className="px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition">
          취소
        </button>
      </div>
    </div>
  );
}
