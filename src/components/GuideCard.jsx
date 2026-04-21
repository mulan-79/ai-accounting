import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { formatDate } from '../lib/utils';

export default function GuideCard({ guide, index = 0 }) {
  const displayDate = guide.date || formatDate(guide.publishedAt);

  return (
    <Link
      to={`/howto/${guide.slug || guide.id}`}
      className="group flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all duration-200"
    >
      {/* 상단 강조 바 */}
      <div className="h-1 bg-blue-900 group-hover:bg-blue-700 transition-colors" />

      <div className="flex flex-col flex-1 p-6">
        {/* 번호 + 카테고리 */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full">
            {guide.category}
          </span>
          <span className="text-2xl font-bold text-slate-100 select-none tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* 제목 */}
        <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-900 transition-colors">
          {guide.title}
        </h3>

        {/* 요약 */}
        <p className="text-sm text-slate-500 leading-relaxed flex-1 line-clamp-3">
          {guide.excerpt}
        </p>

        {/* 메타 + 화살표 */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2.5 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {guide.readTime}
            </span>
            <span>·</span>
            <span>{displayDate}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </Link>
  );
}
