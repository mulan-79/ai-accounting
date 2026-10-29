import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');
const __dirname = dirname(fileURLToPath(import.meta.url));

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const outDir = join(__dirname, '..', 'backup_20261029');
mkdirSync(outDir, { recursive: true });

async function exportCollection(name) {
  const snap = await db.collection(name).get();
  const docs = {};
  snap.forEach(doc => {
    const data = doc.data();
    // Timestamp → ISO string
    for (const [k, v] of Object.entries(data)) {
      if (v && typeof v.toDate === 'function') data[k] = v.toDate().toISOString();
    }
    docs[doc.id] = data;
  });
  const outPath = join(outDir, `${name}.json`);
  writeFileSync(outPath, JSON.stringify(docs, null, 2), 'utf-8');
  console.log(`${name}: ${Object.keys(docs).length}건 → ${outPath}`);
}

await exportCollection('guides');
await exportCollection('cases');
await exportCollection('submissions');
console.log('내보내기 완료');
process.exit(0);
