import React, { useState } from 'react';
import { ArrowRight, BookOpen, Briefcase, Send, Search, Clock, User, Tag, ChevronRight, Sparkles, FileText, Database, Zap } from 'lucide-react';

export default function AIAccountingSite() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const categories = ['전체', '결산', '보고서', '세무', '감사', 'RPA', '프롬프팅'];

  const guides = [
    {
      id: 1,
      title: 'ChatGPT로 월별 결산 체크리스트 자동화하기',
      excerpt: '77개 항목의 결산 체크리스트를 Notion DB로 옮기고 AI로 진행률을 관리하는 방법',
      category: '결산',
      readTime: '8분',
      date: '2026.04.15',
    },
    {
      id: 2,
      title: '임원보고서 원페이저, 프롬프트 하나로 끝내기',
      excerpt: '날것의 메모를 C레벨 의사결정 문서로 변환하는 프롬프트 템플릿',
      category: '보고서',
      readTime: '12분',
      date: '2026.04.10',
    },
    {
      id: 3,
      title: 'IFRS 18 전환, AI로 영향 분석 초안 잡기',
      excerpt: '현재 계정과목 체계를 새 기준에 매핑하는 실무 프로세스',
      category: '결산',
      readTime: '15분',
      date: '2026.04.02',
    },
  ];

  const cases = [
    {
      id: 1,
      company: '대원제약',
      industry: '제약',
      title: '감사법인 선정 RFP 4사 비교표 자동화',
      impact: '작업 시간 8시간 → 1시간',
      author: '김덕준 재무팀장',
      tags: ['RFP', '벤더선정', 'Big4'],
    },
    {
      id: 2,
      company: '익명 제조사',
      industry: '제조',
      title: '매출 인식 시점 검토 파이프라인 구축',
      impact: '월 80건 리뷰 자동 1차 스크리닝',
      author: '이○○ 회계팀장',
      tags: ['매출인식', 'IFRS15'],
    },
    {
      id: 3,
      company: '익명 IT기업',
      industry: 'IT',
      title: '세무조정계산서 검토 보조 시스템',
      impact: '조정 오류 사전 적발률 40% 개선',
      author: '박○○ 세무팀 과장',
      tags: ['세무조정', '법인세'],
    },
    {
      id: 4,
      company: '익명 유통사',
      industry: '유통',
      title: '재고자산 평가 손실 산정 자동화',
      impact: '분기 결산 리드타임 3일 단축',
      author: '최○○ 재무팀 차장',
      tags: ['재고자산', '평가손실'],
    },
  ];

  // 네비게이션
  const Nav = () => (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 bg-blue-900 rounded flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight text-lg">
            회계<span className="text-blue-900">.AI</span>
          </span>
        </button>
        <div className="hidden md:flex items-center gap-1">
          <NavLink label="How-to" page="howto" />
          <NavLink label="Case Study" page="cases" />
          <NavLink label="사례 제보" page="submit" />
          <NavLink label="소개" page="about" />
        </div>
        <button className="px-4 py-2 bg-blue-900 text-white text-sm font-medium rounded-md hover:bg-blue-800 transition">
          뉴스레터 구독
        </button>
      </div>
    </nav>
  );

  const NavLink = ({ label, page }) => (
    <button
      onClick={() => setCurrentPage(page)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition ${
        currentPage === page
          ? 'text-blue-900 bg-blue-50'
          : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      {label}
    </button>
  );

  // 홈 페이지
  const HomePage = () => (
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
              <button
                onClick={() => setCurrentPage('howto')}
                className="px-6 py-3 bg-blue-900 text-white font-medium rounded-md hover:bg-blue-800 transition flex items-center gap-2"
              >
                가이드 보기 <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage('submit')}
                className="px-6 py-3 border border-slate-300 text-slate-900 font-medium rounded-md hover:bg-slate-50 transition"
              >
                내 사례 공유하기
              </button>
            </div>
          </div>

          {/* 지표 */}
          <div className="grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-slate-200">
            <Stat number="23" label="공개된 자동화 레시피" />
            <Stat number="47" label="공유된 실무 케이스" />
            <Stat number="12" label="참여 기업" />
          </div>
        </div>
      </section>

      {/* 3축 소개 */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          <PillarCard
            icon={<BookOpen className="w-5 h-5" />}
            title="How-to 가이드"
            desc="AI로 회계 업무를 자동화하는 방법론. 프롬프트, 도구 선택, 워크플로우 설계."
            onClick={() => setCurrentPage('howto')}
          />
          <PillarCard
            icon={<Briefcase className="w-5 h-5" />}
            title="Case Study"
            desc="실제 기업 재무팀에서 적용한 자동화 사례. 비포/애프터 숫자와 구현 코드까지."
            onClick={() => setCurrentPage('cases')}
          />
          <PillarCard
            icon={<Send className="w-5 h-5" />}
            title="사례 제보"
            desc="우리 팀이 해낸 자동화를 공유하세요. 검수 후 공개해드립니다."
            onClick={() => setCurrentPage('submit')}
          />
        </div>
      </section>

      {/* 최신 가이드 */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-sm font-medium text-blue-900 mb-1">Latest Guides</div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">최신 How-to 가이드</h2>
          </div>
          <button
            onClick={() => setCurrentPage('howto')}
            className="text-sm font-medium text-slate-600 hover:text-blue-900 flex items-center gap-1"
          >
            전체 보기 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {guides.map((g) => (
            <GuideCard key={g.id} guide={g} />
          ))}
        </div>
      </section>

      {/* 최신 케이스 */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-sm font-medium text-blue-900 mb-1">Case Study</div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">최근 공유된 사례</h2>
            </div>
            <button
              onClick={() => setCurrentPage('cases')}
              className="text-sm font-medium text-slate-600 hover:text-blue-900 flex items-center gap-1"
            >
              전체 보기 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {cases.slice(0, 4).map((c) => (
              <CaseCard key={c.id} caseItem={c} />
            ))}
          </div>
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
            <button
              onClick={() => setCurrentPage('submit')}
              className="px-8 py-3 bg-white text-blue-900 font-semibold rounded-md hover:bg-slate-100 transition"
            >
              사례 제보하기
            </button>
          </div>
        </div>
      </section>
    </div>
  );

  const Stat = ({ number, label }) => (
    <div>
      <div className="text-4xl font-bold text-slate-900 tracking-tight">{number}</div>
      <div className="text-sm text-slate-500 mt-1">{label}</div>
    </div>
  );

  const PillarCard = ({ icon, title, desc, onClick }) => (
    <button
      onClick={onClick}
      className="text-left p-6 border border-slate-200 rounded-xl hover:border-blue-900 hover:shadow-lg transition group bg-white"
    >
      <div className="w-10 h-10 bg-blue-50 text-blue-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-900 group-hover:text-white transition">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
      <div className="mt-4 text-sm font-medium text-blue-900 flex items-center gap-1">
        살펴보기 <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </button>
  );

  const GuideCard = ({ guide }) => (
    <article className="group cursor-pointer">
      <div className="aspect-[16/10] bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg mb-4 p-5 flex items-end relative overflow-hidden">
        <div className="absolute top-4 right-4 text-white/20 text-6xl font-bold">
          {String(guide.id).padStart(2, '0')}
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
        <span>{guide.date}</span>
      </div>
    </article>
  );

  const CaseCard = ({ caseItem }) => (
    <article className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-900 transition cursor-pointer group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs font-medium text-slate-500 mb-1">
            {caseItem.industry}
          </div>
          <div className="text-sm font-bold text-slate-900">{caseItem.company}</div>
        </div>
        <div className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded border border-emerald-100 font-medium">
          {caseItem.impact}
        </div>
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-3 group-hover:text-blue-900 transition leading-snug">
        {caseItem.title}
      </h3>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {caseItem.tags.map((tag) => (
          <span key={tag} className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            #{tag}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-3 border-t border-slate-100">
        <User className="w-3 h-3" /> {caseItem.author}
      </div>
    </article>
  );

  // How-to 페이지
  const HowtoPage = () => (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-12">
        <div className="text-sm font-medium text-blue-900 mb-2">How-to Guides</div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
          AI 회계 자동화 가이드
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          어디서부터 시작해야 할지 막막한 분들을 위해, 단계별로 정리한 실무 가이드입니다.
        </p>
      </div>

      {/* 검색 + 필터 */}
      <div className="flex gap-3 mb-8 flex-wrap items-center">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="가이드 검색..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                selectedCategory === cat
                  ? 'bg-blue-900 text-white'
                  : 'border border-slate-300 text-slate-700 hover:border-blue-900 hover:text-blue-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {guides.map((g) => (
          <GuideCard key={g.id} guide={g} />
        ))}
      </div>
    </div>
  );

  // Case Study 페이지
  const CasesPage = () => (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-12">
        <div className="text-sm font-medium text-blue-900 mb-2">Case Study</div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
          현업 자동화 사례
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          다른 회사 재무팀은 AI로 어떤 일을 자동화했을까요? 구체적인 성과 수치와 함께 공유합니다.
        </p>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {['전체', '제약', '제조', 'IT', '유통', '금융'].map((ind) => (
          <button
            key={ind}
            className="px-3 py-1.5 text-sm font-medium border border-slate-300 text-slate-700 rounded-md hover:border-blue-900 hover:text-blue-900 transition"
          >
            {ind}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {cases.map((c) => (
          <CaseCard key={c.id} caseItem={c} />
        ))}
      </div>
    </div>
  );

  // 사례 제보 페이지
  const SubmitPage = () => (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-10">
        <div className="text-sm font-medium text-blue-900 mb-2">Share Your Case</div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
          우리 팀의 자동화 사례 제보
        </h1>
        <p className="text-lg text-slate-600">
          작은 자동화도 누군가에게는 큰 힌트가 됩니다. 제보하신 내용은 검수 후 공개되며,
          익명·가명 처리가 가능합니다.
        </p>
      </div>

      {/* 검수 프로세스 안내 */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 mb-8">
        <div className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4" /> 공개까지의 프로세스
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <ProcessStep n="1" title="제보" desc="폼 제출" />
          <ProcessStep n="2" title="검수" desc="3~5영업일 내 연락" />
          <ProcessStep n="3" title="공개" desc="익명 옵션 가능" />
        </div>
      </div>

      {/* 폼 */}
      <div className="space-y-6 bg-white border border-slate-200 rounded-xl p-8">
        <FormField label="회사명 (익명 처리 가능)" placeholder="예: 대원제약 또는 '익명 제약사'" />
        <FormField label="산업군" placeholder="예: 제약, 제조, IT, 유통" />
        <FormField label="자동화한 업무" placeholder="예: 월별 결산 체크리스트 관리" />
        <FormField
          label="사용한 AI 도구"
          placeholder="예: ChatGPT, Claude, Notion AI, 자체 GPT 래퍼 등"
        />
        <FormField
          label="구체적인 구현 방식"
          placeholder="프롬프트, 워크플로우, 연결한 도구 등 최대한 자세히"
          textarea
        />
        <FormField
          label="정량적 성과 (선택)"
          placeholder="예: 월 8시간 → 1시간, 오류율 40% 감소"
        />
        <FormField label="제보자 (내부 확인용, 공개 안 됨)" placeholder="이름 · 직책 · 이메일" />

        <div className="flex items-start gap-2 pt-2">
          <input type="checkbox" id="anon" className="mt-1" />
          <label htmlFor="anon" className="text-sm text-slate-700">
            회사명·이름 공개 없이 <span className="font-medium">익명으로만 게시</span>하고 싶습니다
          </label>
        </div>

        <button className="w-full py-3 bg-blue-900 text-white font-medium rounded-md hover:bg-blue-800 transition">
          제보 제출하기
        </button>
        <p className="text-xs text-slate-500 text-center">
          제출 전 검수 과정이 진행되며, 공개 전 반드시 제보자께 최종 확인 메일을 드립니다.
        </p>
      </div>
    </div>
  );

  const ProcessStep = ({ n, title, desc }) => (
    <div className="bg-white rounded p-3 border border-blue-100">
      <div className="text-blue-900 font-bold text-sm mb-1">{n}. {title}</div>
      <div className="text-slate-600">{desc}</div>
    </div>
  );

  const FormField = ({ label, placeholder, textarea }) => (
    <div>
      <label className="block text-sm font-medium text-slate-900 mb-2">{label}</label>
      {textarea ? (
        <textarea
          rows={4}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100 resize-none"
        />
      ) : (
        <input
          type="text"
          placeholder={placeholder}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100"
        />
      )}
    </div>
  );

  // 소개 페이지
  const AboutPage = () => (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-sm font-medium text-blue-900 mb-2">About</div>
      <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-8">
        이 사이트를 만든 이유
      </h1>
      <div className="prose prose-slate max-w-none space-y-6 text-slate-700 leading-relaxed">
        <p className="text-lg">
          저는 한 제약회사 재무팀에서 일하는 회계팀장입니다. 2023년 AI 붐이 시작된 이후
          ChatGPT, Claude 같은 도구를 업무에 하나씩 적용해봤고, 그 결과가 기대 이상이었습니다.
        </p>
        <p>
          결산 체크리스트 관리, 임원보고서 작성, 감사법인 선정을 위한 RFP 비교 —
          반복되고 소모적이던 일들이 AI와 함께하니 의미 있는 판단 작업에만 집중할 수 있게 되었습니다.
        </p>
        <p>
          문제는 이런 노하우가 각 회사 안에 고립되어 있다는 점이었습니다.
          옆 회사 재무팀이 어떻게 자동화하는지 알 길이 없고, 비슷한 시행착오를 반복합니다.
        </p>
        <p className="font-medium text-slate-900">
          이 사이트는 그 고립을 깨기 위해 만들었습니다.
        </p>
        <p>
          제가 직접 검증한 레시피를 먼저 공개하고, 다른 회사의 사례를 제보받아 큐레이션합니다.
          각 회사가 서로의 경험에서 배우고, 또 자기 경험을 나누는 선순환 — 그게 목표입니다.
        </p>
      </div>
    </div>
  );

  // 푸터
  const Footer = () => (
    <footer className="border-t border-slate-200 bg-slate-50 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-blue-900 rounded flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-slate-900">
                회계<span className="text-blue-900">.AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              현업 회계·재무 실무자를 위한 AI 자동화 레시피 저장소.
              각 회사가 서로에게 배우는 선순환을 만듭니다.
            </p>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 mb-3">콘텐츠</div>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="hover:text-blue-900 cursor-pointer">How-to 가이드</div>
              <div className="hover:text-blue-900 cursor-pointer">Case Study</div>
              <div className="hover:text-blue-900 cursor-pointer">사례 제보</div>
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 mb-3">연결</div>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="hover:text-blue-900 cursor-pointer">뉴스레터</div>
              <div className="hover:text-blue-900 cursor-pointer">이메일 문의</div>
              <div className="hover:text-blue-900 cursor-pointer">개인정보 처리방침</div>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-200 text-xs text-slate-500">
          © 2026 회계.AI · Built by 회계팀장, for 회계팀
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-white font-sans">
      <Nav />
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'howto' && <HowtoPage />}
      {currentPage === 'cases' && <CasesPage />}
      {currentPage === 'submit' && <SubmitPage />}
      {currentPage === 'about' && <AboutPage />}
      <Footer />
    </div>
  );
}
