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
    console.log(`\n=== ${doc.id} ===`);
    console.log('  slug:', d.slug);
    console.log('  title:', d.title);
    console.log('  category:', d.category);
    console.log('  readTime:', d.readTime);
    console.log('  content length:', d.content?.length ?? 'MISSING');
    console.log('  order:', d.order);
  }
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
