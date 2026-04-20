import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { formatDate } from '../lib/utils';

export default function GuideCard({ guide, index = 0 }) {
  const displayDate = guide.date || formatDate(guide.publishedAt);

  return (
    <Link to={`/howto/${guide.slug || guide.id}`} className="group block">
      <div className="aspect-[16/10] bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg mb-4 p-5 flex items-end relative overflow-hidden">
        <div className="absolute top-4 right-4 text-white/20 text-6xl font-bold">
          {String(index + 1).padStart(2, '0')}
        </div>
        <span className="text-xs font-medium text-white bg-white/10 backdrop-blur px-2.5 py-1 rounded-full border border-white/20">
          {guide.category}
        </span>
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-900 transition">
        {guide.title}
      </h3>
      <p className="text-sm text-slate-600 leading-relaxed mb-3">{guide.excerpt}</p>
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" /> {guide.readTime}
        </span>
        <span>·</span>
        <span>{displayDate}</span>
      </div>
    </Link>
  );
}
