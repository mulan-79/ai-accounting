import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const links = [
  {
    guideSlug: 'ai-chat-skills-accounting',
    caseSlug: 'case01-executive-report-ai',
    caseTitle: '회계법인 선정 검토 보고서를 AI로 20분 만에 완성한 방법',
  },
  {
    guideSlug: 'claude-cowork-erp-automation',
    caseSlug: 'case02-cowork-proposal-analysis',
    caseTitle: '4개 회계법인 제안서를 AI가 직접 읽고 임원 보고서까지 완성한 방법',
  },
  {
    guideSlug: 'claude-code-voucher-validation',
    caseSlug: 'case03-sap-daily-cashout-automation',
    caseTitle: 'SAP 일일출납 다운로드를 배치파일 하나로 자동화한 방법',
  },
];

const sectionTemplate = (caseSlug, caseTitle) => `

---

## 📌 실제 적용 사례

이 방식을 실무에 적용한 케이스 스터디를 함께 읽어보세요.

[${caseTitle}](/cases/${caseSlug})`;

async function run() {
  for (const { guideSlug, caseSlug, caseTitle } of links) {
    const ref = db.collection('guides').doc(guideSlug);
    const snap = await ref.get();
    const current = snap.data().content;
    const addition = sectionTemplate(caseSlug, caseTitle);

    // 이미 추가된 경우 스킵
    if (current.includes('## 📌 실제 적용 사례')) {
      console.log(`⏭️   이미 있음: ${guideSlug}`);
      continue;
    }

    await ref.update({ content: current + addition });
    console.log(`✅  링크 추가: ${guideSlug} → ${caseSlug}`);
  }
  console.log('\n완료!');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
