import { useState } from 'react';
import CaseCard from '../components/CaseCard';
import { useCases } from '../hooks/useCases';
import { industries } from '../lib/dummyData';

export default function CasesPage() {
  const [selectedIndustry, setSelectedIndustry] = useState('전체');
  const { cases, loading } = useCases({ industry: selectedIndustry });

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-12">
        <div className="text-sm font-medium text-blue-900 mb-2">Case Study</div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">현업 자동화 사례</h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          다른 회사 재무팀은 AI로 어떤 일을 자동화했을까요? 구체적인 성과 수치와 함께 공유합니다.
        </p>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {industries.map(ind => (
          <button key={ind} onClick={() => setSelectedIndustry(ind)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
              selectedIndustry === ind
                ? 'bg-blue-900 text-white'
                : 'border border-slate-300 text-slate-700 hover:border-blue-900 hover:text-blue-900'
            }`}
          >{ind}</button>
        ))}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-40 bg-slate-100 rounded-xl animate-pulse" />)}
        </div>
      ) : cases.length === 0 ? (
        <div className="text-center py-20 text-slate-500">해당 산업군의 사례가 없습니다.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {cases.map(c => <CaseCard key={c.id} caseItem={c} />)}
        </div>
      )}
    </div>
  );
}
