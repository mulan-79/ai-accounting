import { useParams, Link } from 'react-router-dom';
import { Clock, ArrowLeft, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useGuide } from '../hooks/useGuides';
import { formatDate } from '../lib/utils';

export default function GuideDetailPage() {
  const { slug } = useParams();
  const { guide, loading } = useGuide(slug);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-4 animate-pulse">
        <div className="h-4 w-24 bg-slate-100 rounded" />
        <div className="h-10 w-3/4 bg-slate-100 rounded" />
        <div className="h-4 w-48 bg-slate-100 rounded" />
        <div className="space-y-3 mt-10">
          {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-slate-100 rounded" />)}
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-slate-500 mb-4">가이드를 찾을 수 없습니다.</p>
        <Link to="/howto" className="text-blue-900 font-medium hover:underline">가이드 목록으로</Link>
      </div>
    );
  }

  const displayDate = guide.date || formatDate(guide.publishedAt);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link to="/howto" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-900 mb-8">
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

      <div className="flex items-center gap-4 text-sm text-slate-500 mb-10 pb-8 border-b border-slate-200">
        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {guide.readTime}</span>
        {displayDate && <span>{displayDate}</span>}
        {guide.author && <span>by {guide.author}</span>}
      </div>

      {/* 마크다운 본문 */}
      <div className="prose-custom">
        {guide.content ? (
          <ReactMarkdown components={mdComponents}>{guide.content}</ReactMarkdown>
        ) : (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-8 text-center text-slate-400 text-sm">
            본문 콘텐츠가 아직 작성되지 않았습니다.
          </div>
        )}
      </div>

      {guide.tags?.length > 0 && (
        <div className="flex items-center gap-2 mt-12 pt-8 border-t border-slate-200 flex-wrap">
          <Tag className="w-4 h-4 text-slate-400" />
          {guide.tags.map((tag) => (
            <span key={tag} className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">#{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}

const mdComponents = {
  h1: ({ children }) => <h1 className="text-2xl font-bold text-slate-900 mt-10 mb-4 tracking-tight">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3 tracking-tight">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-2">{children}</h3>,
  p:  ({ children }) => <p className="text-slate-700 leading-relaxed mb-4">{children}</p>,
  ul: ({ children }) => <ul className="list-disc list-inside space-y-1.5 mb-4 text-slate-700">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside space-y-1.5 mb-4 text-slate-700">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-900 pl-4 my-4 text-slate-600 italic">{children}</blockquote>
  ),
  code: ({ inline, children }) =>
    inline ? (
      <code className="bg-slate-100 text-blue-900 text-sm px-1.5 py-0.5 rounded font-mono">{children}</code>
    ) : (
      <pre className="bg-slate-900 text-slate-100 rounded-xl p-5 overflow-x-auto my-6 text-sm">
        <code className="font-mono leading-relaxed">{children}</code>
      </pre>
    ),
  strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="text-blue-900 underline underline-offset-2 hover:text-blue-700">{children}</a>
  ),
  hr: () => <hr className="border-slate-200 my-8" />,
};
