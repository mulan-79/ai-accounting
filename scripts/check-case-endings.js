import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function run() {
  const snap = await db.collection('cases').orderBy('order', 'asc').get();
  for (const doc of snap.docs) {
    const d = doc.data();
    const lines = (d.content || '').split('\n');
    const last8 = lines.slice(-8).join('\n');
    console.log(`\n=== ${doc.id} (order:${d.order}) ===`);
    console.log(last8);
  }
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
