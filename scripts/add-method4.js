import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function run() {
  await db.collection('guides').doc('claude-code-cowork-full-automation').set({
    title: '[방식 4 상세] Claude Code + Cowork로 완전 자동화 파이프라인 구축하기',
    slug: 'claude-code-cowork-full-automation',
    excerpt: 'AI가 코드를 만들고, AI가 그 코드를 매일 대신 돌린다. ERP 데이터 수집부터 Slack 발송까지 사람 손 없이 돌아가는 자동화 루틴 구축법',
    category: 'RPA',
    tags: ['ClaudeCode', 'Cowork', '완전자동화', '스케줄링', 'Python', 'Slack'],
    readTime: '18분',
    author: 'K팀장',
    content: '',
    publishedAt: Timestamp.now(),
  });
  console.log('✅  guides/claude-code-cowork-full-automation 저장 완료');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
