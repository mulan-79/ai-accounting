import { useParams, Link } from 'react-router-dom';
import { Clock, ArrowLeft, Tag } from 'lucide-react';
import { guides } from '../lib/dummyData';

export default function GuideDetailPage() {
  const { slug } = useParams();
  const guide = guides.find((g) => g.slug === slug || String(g.id) === slug);

  if (!guide) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-slate-500 mb-4">가이드를 찾을 수 없습니다.</p>
        <Link to="/howto" className="text-blue-900 font-medium hover:underline">
          가이드 목록으로
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link
        to="/howto"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-900 mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> 가이드 목록
      </Link>

      <div className="mb-3">
        <span className="text-xs font-medium px-2.5 py-1 bg-blue-50 text-blue-900 rounded-full border border-blue-100">
          {guide.category}
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-snug mb-4">
        {guide.title}
      </h1>

      <div className="flex items-center gap-4 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-200">
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" /> {guide.readTime}
        </span>
        <span>{guide.date}</span>
      </div>

      <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
        <p className="text-lg text-slate-600 mb-6">{guide.excerpt}</p>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-slate-500 text-sm text-center">
          본문 콘텐츠가 여기에 표시됩니다. (Firebase 연동 후 Firestore에서 불러옵니다)
        </div>
      </div>

      {guide.tags && (
        <div className="flex items-center gap-2 mt-8 pt-8 border-t border-slate-200 flex-wrap">
          <Tag className="w-4 h-4 text-slate-400" />
          {guide.tags.map((tag) => (
            <span key={tag} className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
