/**
 * Firestore 더미 데이터 시드 스크립트
 * 사용법: node scripts/seed.js
 *
 * 실행 전 필요:
 *   1. Firebase 프로젝트에서 서비스 계정 키 다운로드
 *      (프로젝트 설정 > 서비스 계정 > 새 비공개 키 생성)
 *   2. 다운로드한 JSON을 scripts/serviceAccountKey.json 으로 저장
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

let serviceAccount;
try {
  serviceAccount = require('./serviceAccountKey.json');
} catch {
  console.error('❌  scripts/serviceAccountKey.json 파일이 없습니다.');
  console.error('   Firebase 콘솔 > 프로젝트 설정 > 서비스 계정 > 새 비공개 키 생성');
  process.exit(1);
}

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const now = Timestamp.now();

const guides = [
  {
    title: 'ChatGPT로 월별 결산 체크리스트 자동화하기',
    slug: 'chatgpt-monthly-closing-checklist',
    excerpt: '77개 항목의 결산 체크리스트를 Notion DB로 옮기고 AI로 진행률을 관리하는 방법',
    category: '결산',
    tags: ['ChatGPT', 'Notion', '결산'],
    readTime: '8분',
    author: '김덕준',
    publishedAt: now,
    content: '## 배경\n\n월별 결산은 반복 작업의 연속입니다. 매월 동일한 항목을 확인하고, 담당자별로 진행 현황을 취합하고, 누락 여부를 체크하는 일이 수작업으로 이루어지고 있었습니다.\n\n## 해결 방법\n\nNotion 데이터베이스를 결산 체크리스트의 기반으로 삼고, ChatGPT를 통해 담당자에게 자동 알림을 보내는 구조를 만들었습니다.',
  },
  {
    title: '임원보고서 원페이저, 프롬프트 하나로 끝내기',
    slug: 'executive-report-one-pager-prompt',
    excerpt: '날것의 메모를 C레벨 의사결정 문서로 변환하는 프롬프트 템플릿',
    category: '보고서',
    tags: ['Claude', '보고서', '프롬프팅'],
    readTime: '12분',
    author: '김덕준',
    publishedAt: now,
    content: '## 개요\n\nC레벨 임원은 핵심만 원합니다. 5페이지짜리 보고서보다 잘 구조화된 원페이지가 더 효과적입니다.\n\n## 프롬프트 템플릿\n\n```\n다음 내용을 임원 보고서 형식으로 변환해주세요...\n```',
  },
  {
    title: 'IFRS 18 전환, AI로 영향 분석 초안 잡기',
    slug: 'ifrs18-transition-ai-analysis',
    excerpt: '현재 계정과목 체계를 새 기준에 매핑하는 실무 프로세스',
    category: '결산',
    tags: ['IFRS18', '기준서', '영향분석'],
    readTime: '15분',
    author: '김덕준',
    publishedAt: now,
    content: '## IFRS 18이란\n\n2027년부터 적용되는 새로운 손익계산서 기준으로, 영업손익의 정의가 변경됩니다.',
  },
];

const cases = [
  {
    title: '감사법인 선정 RFP 4사 비교표 자동화',
    slug: 'daewon-pharma-rfp-automation',
    company: '대원제약',
    industry: '제약',
    impact: '작업 시간 8시간 → 1시간',
    author: '김덕준 재무팀장',
    isAnonymous: false,
    tags: ['RFP', '벤더선정', 'Big4'],
    publishedAt: now,
    content: '## 배경\n\n3년마다 돌아오는 감사법인 선정. 4개 법인의 제안서를 비교하는 작업이 매번 8시간 이상 걸렸습니다.',
  },
  {
    title: '매출 인식 시점 검토 파이프라인 구축',
    slug: 'anonymous-manufacturer-revenue-recognition',
    company: '익명 제조사',
    industry: '제조',
    impact: '월 80건 리뷰 자동 1차 스크리닝',
    author: '이○○ 회계팀장',
    isAnonymous: true,
    tags: ['매출인식', 'IFRS15'],
    publishedAt: now,
    content: '## 문제 상황\n\n납품 조건이 복잡한 거래에서 IFRS 15 기준에 따른 매출 인식 시점 검토가 월 80건 이상 발생했습니다.',
  },
  {
    title: '세무조정계산서 검토 보조 시스템',
    slug: 'anonymous-it-tax-adjustment',
    company: '익명 IT기업',
    industry: 'IT',
    impact: '조정 오류 사전 적발률 40% 개선',
    author: '박○○ 세무팀 과장',
    isAnonymous: true,
    tags: ['세무조정', '법인세'],
    publishedAt: now,
    content: '## 배경\n\n법인세 신고 시즌 세무조정 작업에서 반복적인 오류가 발생했습니다.',
  },
  {
    title: '재고자산 평가 손실 산정 자동화',
    slug: 'anonymous-retail-inventory-valuation',
    company: '익명 유통사',
    industry: '유통',
    impact: '분기 결산 리드타임 3일 단축',
    author: '최○○ 재무팀 차장',
    isAnonymous: true,
    tags: ['재고자산', '평가손실'],
    publishedAt: now,
    content: '## 개요\n\nSKU 수 5만여 개의 재고에 대해 분기마다 저가법 평가를 수행했습니다.',
  },
];

async function seed() {
  console.log('🌱  시드 데이터 업로드 시작...\n');

  for (const guide of guides) {
    const ref = db.collection('guides').doc(guide.slug);
    await ref.set(guide);
    console.log(`✅  guides/${guide.slug}`);
  }

  for (const c of cases) {
    const ref = db.collection('cases').doc(c.slug);
    await ref.set(c);
    console.log(`✅  cases/${c.slug}`);
  }

  console.log('\n🎉  완료!');
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
