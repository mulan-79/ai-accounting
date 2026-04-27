import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// 원하는 순서대로 나열 (order: 1이 첫 번째)
const orders = [
  { slug: 'ai-automation-4-methods',           order: 1 },
  { slug: 'ai-chat-skills-accounting',          order: 2 },
  { slug: 'claude-cowork-erp-automation',       order: 3 },
  { slug: 'claude-code-voucher-validation',     order: 4 },
  { slug: 'claude-code-cowork-full-automation', order: 5 },
];

async function run() {
  for (const { slug, order } of orders) {
    await db.collection('guides').doc(slug).update({ order });
    console.log(`✅  guides/${slug} → order: ${order}`);
  }
  console.log('\n🎉  완료!');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
