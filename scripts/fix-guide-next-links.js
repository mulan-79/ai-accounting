import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const fixes = [
  {
    slug: 'ai-automation-4-methods',
    from: '*다음 글: [방식 1 상세] AI 채팅 + Skills로 결산 보고서 자동 작성하기*',
    to:   '*다음 글: [방식 1 상세 — AI 채팅 + Skills로 결산 보고서 자동 작성하기](/guides/ai-chat-skills-accounting)*',
  },
  {
    slug: 'ai-chat-skills-accounting',
    from: '*다음 글: [방식 2 상세] Claude Cowork로 ERP 데이터 추출부터 보고서 완성까지 자동화하기*',
    to:   '*다음 글: [방식 2 상세 — Claude Cowork로 ERP 데이터 추출부터 보고서 완성까지 자동화하기](/guides/claude-cowork-erp-automation)*',
  },
  {
    slug: 'claude-cowork-erp-automation',
    from: '*다음 글: [방식 3 상세] Claude Code로 전표 검증 자동화 프로그램 만들기 — 코딩 몰라도 됩니다*',
    to:   '*다음 글: [방식 3 상세 — Claude Code로 전표 검증 자동화 프로그램 만들기](/guides/claude-code-voucher-validation)*',
  },
  {
    slug: 'claude-code-voucher-validation',
    from: '*다음 글: [방식 4 상세] Claude Code + Cowork 결합으로 완전 자동화 구축하기 — 출근하면 결과가 나와 있습니다*',
    to:   '*다음 글: [방식 4 상세 — Claude Code + Cowork 결합으로 완전 자동화 구축하기](/guides/claude-code-cowork-full-automation)*',
  },
  {
    slug: 'claude-code-cowork-full-automation',
    from: '*[방식 1 상세] AI 채팅 + Skills로 결산 보고서 자동 작성하기*\n*[방식 2 상세] Claude Cowork로 ERP 데이터 추출부터 보고서 완성까지*\n*[방식 3 상세] Claude Code로 전표 검증 자동화 프로그램 만들기*\n*[방식 4 상세] Claude Code + Cowork 결합으로 완전 자동화 구축하기 ← 현재 글*',
    to:   '- [방식 1 상세 — AI 채팅 + Skills로 결산 보고서 자동 작성하기](/guides/ai-chat-skills-accounting)\n- [방식 2 상세 — Claude Cowork로 ERP 데이터 추출부터 보고서 완성까지](/guides/claude-cowork-erp-automation)\n- [방식 3 상세 — Claude Code로 전표 검증 자동화 프로그램 만들기](/guides/claude-code-voucher-validation)\n- **방식 4 상세 — Claude Code + Cowork 결합으로 완전 자동화 구축하기 ← 현재 글**',
  },
];

async function run() {
  for (const { slug, from, to } of fixes) {
    const ref = db.collection('guides').doc(slug);
    const snap = await ref.get();
    if (!snap.exists) {
      console.log(`⚠️  없음: ${slug}`);
      continue;
    }
    const content = snap.data().content;
    if (!content.includes(from)) {
      console.log(`⏭️  스킵 (텍스트 없음): ${slug}`);
      continue;
    }
    await ref.update({ content: content.replace(from, to) });
    console.log(`✅  링크 수정: ${slug}`);
  }
  console.log('\n완료!');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
