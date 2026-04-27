import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const KEEP = 'case01-executive-report-ai';

async function run() {
  const snap = await db.collection('cases').get();
  console.log(`전체 케이스 수: ${snap.size}\n`);

  for (const doc of snap.docs) {
    if (doc.id === KEEP) {
      console.log(`✅  유지: ${doc.id}`);
    } else {
      await doc.ref.delete();
      console.log(`🗑️   삭제: ${doc.id}`);
    }
  }

  console.log('\n완료!');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
