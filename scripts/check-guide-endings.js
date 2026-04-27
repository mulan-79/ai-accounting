import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function run() {
  const snap = await db.collection('guides').orderBy('order', 'asc').get();
  for (const doc of snap.docs) {
    const d = doc.data();
    const lines = (d.content || '').split('\n');
    const last10 = lines.slice(-10).join('\n');
    console.log(`\n=== ${doc.id} (order:${d.order}) ===`);
    console.log(last10);
    console.log('---');
  }
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
