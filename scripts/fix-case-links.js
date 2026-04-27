import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const fixes = [
  {
    id: 'case01-executive-report-ai',
    from: '*관련 글: [방식 1 상세] AI 채팅 + Skills로 결산 보고서 자동 작성하기*',
    to:   '*관련 글: [방식 1 상세 — AI 채팅 + Skills로 결산 보고서 자동 작성하기](/guides/ai-chat-skills-accounting)*',
  },
  {
    id: 'case02-cowork-proposal-analysis',
    from: '*관련 글: [방식 2 상세] Claude Cowork로 ERP 데이터 추출부터 보고서 완성까지 자동화하기*',
    to:   '*관련 글: [방식 2 상세 — Claude Cowork로 ERP 데이터 추출부터 보고서 완성까지 자동화하기](/guides/claude-cowork-erp-automation)*',
  },
  {
    id: 'case03-sap-daily-cashout-automation',
    from: '*관련 글: [방식 3 상세] Claude Code로 전표 검증 자동화 프로그램 만들기*\n*다음 글: [방식 4 상세] 자동화 프로그램 + 스케줄러로 완전 무인 운영하기*',
    to:   '*관련 글: [방식 3 상세 — Claude Code로 전표 검증 자동화 프로그램 만들기](/guides/claude-code-voucher-validation)*\n*다음 글: [방식 4 상세 — 자동화 프로그램 + 스케줄러로 완전 무인 운영하기](/guides/claude-code-cowork-full-automation)*',
  },
  {
    id: 'case04-sap-trial-balance-automation',
    from: '*관련 글: [방식 3 상세] Claude Code로 전표 검증 자동화 프로그램 만들기*\n*다음 글: [케이스 03] SAP 일일출납 다운로드를 배치파일 하나로 자동화한 방법*',
    to:   '*관련 글: [방식 3 상세 — Claude Code로 전표 검증 자동화 프로그램 만들기](/guides/claude-code-voucher-validation)*\n*다음 글: [케이스 03 — SAP 일일출납 다운로드를 배치파일 하나로 자동화한 방법](/cases/case03-sap-daily-cashout-automation)*',
  },
  {
    id: 'case05-sap-scheduler-automation',
    from: '*이전 글: [케이스 04] 코딩 몰라도 됩니다 — AI와 대화만으로 SAP 시산표 자동화 완성*',
    to:   '*이전 글: [케이스 04 — 코딩 몰라도 됩니다, AI와 대화만으로 SAP 시산표 자동화 완성](/cases/case04-sap-trial-balance-automation)*',
  },
];

async function run() {
  for (const { id, from, to } of fixes) {
    const ref = db.collection('cases').doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      console.log(`⚠️  없음: ${id}`);
      continue;
    }
    const content = snap.data().content;
    if (!content.includes(from)) {
      console.log(`⏭️  스킵 (텍스트 없음): ${id}`);
      console.log('   찾는 텍스트:', from.substring(0, 60));
      continue;
    }
    await ref.update({ content: content.replace(from, to) });
    console.log(`✅  링크 추가: ${id}`);
  }
  console.log('\n완료!');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
