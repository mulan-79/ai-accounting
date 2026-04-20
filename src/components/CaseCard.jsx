import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

export default function CaseCard({ caseItem }) {
  return (
    <Link
      to={`/cases/${caseItem.slug || caseItem.id}`}
      className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-900 transition cursor-pointer group block"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs font-medium text-slate-500 mb-1">{caseItem.industry}</div>
          <div className="text-sm font-bold text-slate-900">{caseItem.company}</div>
        </div>
        <div className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded border border-emerald-100 font-medium shrink-0 ml-3">
          {caseItem.impact}
        </div>
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-3 group-hover:text-blue-900 transition leading-snug">
        {caseItem.title}
      </h3>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {caseItem.tags?.map((tag) => (
          <span key={tag} className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            #{tag}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-3 border-t border-slate-100">
        <User className="w-3 h-3" /> {caseItem.author}
      </div>
    </Link>
  );
}
