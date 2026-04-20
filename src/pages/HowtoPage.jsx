import { useState } from 'react';
import { Search } from 'lucide-react';
import GuideCard from '../components/GuideCard';
import { useGuides } from '../hooks/useGuides';
import { categories } from '../lib/dummyData';

export default function HowtoPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const { guides, loading } = useGuides({ category: selectedCategory });

  const filtered = searchQuery
    ? guides.filter(g =>
        g.title.includes(searchQuery) ||
        g.excerpt?.includes(searchQuery) ||
        g.tags?.some(t => t.includes(searchQuery))
      )
    : guides;

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-12">
        <div className="text-sm font-medium text-blue-900 mb-2">How-to Guides</div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">AI 회계 자동화 가이드</h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          어디서부터 시작해야 할지 막막한 분들을 위해, 단계별로 정리한 실무 가이드입니다.
        </p>
      </div>

      <div className="flex gap-3 mb-8 flex-wrap items-center">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="가이드 검색..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                selectedCategory === cat
                  ? 'bg-blue-900 text-white'
                  : 'border border-slate-300 text-slate-700 hover:border-blue-900 hover:text-blue-900'
              }`}
            >{cat}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500">검색 결과가 없습니다.</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filtered.map((g, i) => <GuideCard key={g.id} guide={g} index={i} />)}
        </div>
      )}
    </div>
  );
}
