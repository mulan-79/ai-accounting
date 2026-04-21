import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Briefcase, Send, ChevronRight } from 'lucide-react';
import GuideCard from '../components/GuideCard';
import CaseCard from '../components/CaseCard';
import { useGuides } from '../hooks/useGuides';
import { useCases } from '../hooks/useCases';
import { useStats } from '../hooks/useStats';

const Stat = ({ number, label }) => (
  <div>
    <div className="text-4xl font-bold text-slate-900 tracking-tight">{number}</div>
    <div className="text-sm text-slate-500 mt-1">{label}</div>
  </div>
);

const PillarCard = ({ icon, title, desc, to }) => (
  <Link
    to={to}
    className="text-left p-6 border border-slate-200 rounded-xl hover:border-blue-900 hover:shadow-lg transition group bg-white block"
  >
    <div className="w-10 h-10 bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-900 group-hover:text-white transition">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
    <div className="mt-4 text-sm font-medium text-blue-900 flex items-center gap-1">
      살펴보기 <ArrowRight className="w-3.5 h-3.5" />
    </div>
  </Link>
);

export default function HomePage() {
  const { guides, loading: guidesLoading } = useGuides({ limitCount: 3 });
  const { cases, loading: casesLoading } = useCases({ limitCount: 4 });
  const { stats, loading: statsLoading } = useStats();

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-medium text-blue-900 mb-6">
              <span className="w-1.5 h-1.5 bg-blue-900 rounded-full animate-pulse" />
              현업 회계팀장이 직접 쓰고 검증한 레시피
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
              AI로 회계 업무,
              <br />
              <span className="text-blue-900">이렇게 바꾸는 중입니다.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl">
              결산, 보고, 세무, 감사 — 반복되는 회계 업무를 AI로 자동화한 실제 사례를 공유합니다.
              각 회사가 스스로 자동화하고, 다시 사례를 나누는 선순환을 만듭니다.
            </p>
            <div className="flex gap-3">
              <Link
                to="/howto"
                className="px-6 py-3 bg-blue-900 text-white font-medium rounded-md hover:bg-blue-800 transition flex items-center gap-2"
              >
                가이드 보기 <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/submit"
                className="px-6 py-3 border border-slate-300 text-slate-900 font-medium rounded-md hover:bg-slate-50 transition"
              >
                내 사례 공유하기
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-slate-200">
            <Stat number={statsLoading ? '—' : stats.guides} label="공개된 자동화 레시피" />
            <Stat number={statsLoading ? '—' : stats.cases} label="공유된 실무 케이스" />
            <Stat number={statsLoading ? '—' : stats.submissions} label="접수된 사례 제보" />
          </div>
        </div>
      </section>

      {/* 3축 소개 */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          <PillarCard icon={<BookOpen className="w-5 h-5" />} title="How-to 가이드"
            desc="AI로 회계 업무를 자동화하는 방법론. 프롬프트, 도구 선택, 워크플로우 설계." to="/howto" />
          <PillarCard icon={<Briefcase className="w-5 h-5" />} title="Case Study"
            desc="실제 기업 재무팀에서 적용한 자동화 사례. 비포/애프터 숫자와 구현 코드까지." to="/cases" />
          <PillarCard icon={<Send className="w-5 h-5" />} title="사례 제보"
            desc="우리 팀이 해낸 자동화를 공유하세요. 검수 후 공개해드립니다." to="/submit" />
        </div>
      </section>

      {/* 최신 가이드 */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-sm font-medium text-blue-900 mb-1">Latest Guides</div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">최신 How-to 가이드</h2>
          </div>
          <Link to="/howto" className="text-sm font-medium text-slate-600 hover:text-blue-900 flex items-center gap-1">
            전체 보기 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {guidesLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {guides.map((g, i) => <GuideCard key={g.id} guide={g} index={i} />)}
          </div>
        )}
      </section>

      {/* 최신 케이스 */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-sm font-medium text-blue-900 mb-1">Case Study</div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">최근 공유된 사례</h2>
            </div>
            <Link to="/cases" className="text-sm font-medium text-slate-600 hover:text-blue-900 flex items-center gap-1">
              전체 보기 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {casesLoading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="h-40 bg-slate-200 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {cases.map(c => <CaseCard key={c.id} caseItem={c} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-blue-900 rounded-2xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              당신의 팀은 어떤 자동화를 하고 있나요?
            </h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              5분이면 충분합니다. 우리 팀의 사례를 공유하고, 다른 회사의 경험에서도 배워가세요.
            </p>
            <Link to="/submit" className="inline-block px-8 py-3 bg-white text-blue-900 font-semibold rounded-md hover:bg-slate-100 transition">
              사례 제보하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
