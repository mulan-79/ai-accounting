import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function run() {
  const snap = await db.collection('cases').doc('case03-sap-daily-cashout-automation').get();
  const content = snap.data().content;
  // 이미지 경로만 추출
  const imgMatches = content.match(/!\[.*?\]\(.*?\)/g);
  console.log('이미지 태그 목록:');
  imgMatches?.forEach(m => console.log(' ', m));
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
