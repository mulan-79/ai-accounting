import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';

const components = {
  h1: ({ children }) => <h1 className="text-2xl font-bold text-slate-900 mt-10 mb-4 tracking-tight">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3 tracking-tight">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-2">{children}</h3>,
  p: ({ children, node }) => {
    // 이미지만 있는 단락은 <p> 대신 <div>로 감싸 HTML 구조 충돌 방지
    const hasImg = node?.children?.some(c => c.tagName === 'img');
    if (hasImg) return <div className="mb-4">{children}</div>;
    return <p className="text-slate-700 leading-relaxed mb-4">{children}</p>;
  },
  ul: ({ children }) => <ul className="list-disc list-inside space-y-1.5 mb-4 text-slate-700">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside space-y-1.5 mb-4 text-slate-700">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-900 pl-4 my-4 text-slate-600 italic bg-blue-50/50 py-2 rounded-r-lg">
      {children}
    </blockquote>
  ),
  code: ({ inline, children }) =>
    inline ? (
      <code className="bg-slate-100 text-blue-900 text-sm px-1.5 py-0.5 rounded font-mono">{children}</code>
    ) : (
      <pre className="bg-slate-900 text-slate-100 rounded-xl p-5 overflow-x-auto my-6 text-sm">
        <code className="font-mono leading-relaxed whitespace-pre">{children}</code>
      </pre>
    ),
  strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
  a: ({ href, children }) => {
    const isInternal = href && (href.startsWith('/') || href.startsWith('#'));
    if (isInternal) {
      return (
        <Link to={href} className="text-blue-900 underline underline-offset-2 hover:text-blue-700">
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer"
        className="text-blue-900 underline underline-offset-2 hover:text-blue-700">{children}</a>
    );
  },
  hr: () => <hr className="border-slate-200 my-8" />,
  img: ({ src, alt }) => (
    <span className="block my-6">
      <img
        src={src}
        alt={alt}
        className="w-full rounded-xl border border-slate-200 shadow-sm"
        loading="lazy"
      />
      {alt && (
        <span className="block text-center text-xs text-slate-400 mt-2">{alt}</span>
      )}
    </span>
  ),
  // 표 렌더링
  table: ({ children }) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-slate-100">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y divide-slate-200">{children}</tbody>,
  tr: ({ children }) => <tr className="hover:bg-slate-50 transition">{children}</tr>,
  th: ({ children }) => (
    <th className="text-left px-4 py-2.5 font-semibold text-slate-700 border border-slate-200">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2.5 text-slate-700 border border-slate-200">{children}</td>
  ),
};

export default function MarkdownRenderer({ content }) {
  if (!content) {
    return (
      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-8 text-center text-slate-400 text-sm">
        본문 콘텐츠가 아직 작성되지 않았습니다.
      </div>
    );
  }
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
