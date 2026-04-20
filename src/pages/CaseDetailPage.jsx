import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Tag } from 'lucide-react';
import { cases } from '../lib/dummyData';

export default function CaseDetailPage() {
  const { slug } = useParams();
  const caseItem = cases.find((c) => c.slug === slug || String(c.id) === slug);

  if (!caseItem) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-slate-500 mb-4">사례를 찾을 수 없습니다.</p>
        <Link to="/cases" className="text-blue-900 font-medium hover:underline">
          사례 목록으로
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link
        to="/cases"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-900 mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> 사례 목록
      </Link>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
          {caseItem.industry}
        </span>
        <span className="text-xs font-medium px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
          {caseItem.impact}
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-snug mb-4">
        {caseItem.title}
      </h1>

      <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-200">
        <User className="w-4 h-4" />
        <span>{caseItem.author}</span>
        <span>·</span>
        <span className="font-medium text-slate-700">{caseItem.company}</span>
        {caseItem.publishedAt && <><span>·</span><span>{caseItem.publishedAt}</span></>}
      </div>

      <div className="text-slate-700 leading-relaxed">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-slate-500 text-sm text-center">
          본문 콘텐츠가 여기에 표시됩니다. (Firebase 연동 후 Firestore에서 불러옵니다)
        </div>
      </div>

      {caseItem.tags && (
        <div className="flex items-center gap-2 mt-8 pt-8 border-t border-slate-200 flex-wrap">
          <Tag className="w-4 h-4 text-slate-400" />
          {caseItem.tags.map((tag) => (
            <span key={tag} className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
