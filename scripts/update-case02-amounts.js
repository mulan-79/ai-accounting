import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function run() {
  const ref = db.collection('cases').doc('case02-cowork-proposal-analysis');
  const snap = await ref.get();
  let content = snap.data().content;

  const replacements = [
    ['| A회계법인 | 3,870만원 | 10,240만원 | △ |', '| A회계법인 | 380만원 | 870만원 | △ |'],
    ['| B회계법인 | 5,130만원 | 7,460만원 ✅ | △ |', '| B회계법인 | 520만원 | 760만원 ✅ | △ |'],
    ['| C회계법인 | 8,290만원 | PA only | ◎ |', '| C회계법인 | 910만원 | PA only | ◎ |'],
    ['| D회계법인 | 6,750만원 ✅ | PA only | ◎ |', '| D회계법인 | 630만원 ✅ | PA only | ◎ |'],
  ];

  for (const [from, to] of replacements) {
    content = content.replace(from, to);
  }

  await ref.update({ content });
  console.log('✅  금액 업데이트 완료');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
