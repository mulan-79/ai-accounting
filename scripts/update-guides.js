import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const updates = [
  {
    oldSlug: 'chatgpt-monthly-closing-checklist',
    newSlug: 'ai-chat-skills-accounting',
    title: '[방식 1 상세] AI 채팅 + Skills로 결산 보고서 자동 작성하기',
    excerpt: '오늘 당장 시작할 수 있는 가장 쉬운 방법. Skills 템플릿 하나로 매월 반복되는 보고서를 10분 만에 완성하는 법',
    category: '보고서',
    tags: ['AI채팅', 'Skills', '결산보고서', 'Claude', 'ChatGPT'],
    readTime: '10분',
    author: 'K팀장',
  },
  {
    oldSlug: 'executive-report-one-pager-prompt',
    newSlug: 'claude-cowork-erp-automation',
    title: '[방식 2 상세] Claude Cowork로 ERP 반복 업무 자동화하기',
    excerpt: 'AI가 내 컴퓨터를 직접 조작한다. ERP 데이터 추출부터 엑셀 가공, 보고서 붙여넣기까지 원클릭으로 처리하는 법',
    category: 'RPA',
    tags: ['Cowork', 'ERP', '자동화', '컴퓨터제어'],
    readTime: '12분',
    author: 'K팀장',
  },
  {
    oldSlug: 'ifrs18-transition-ai-analysis',
    newSlug: 'claude-code-voucher-validation',
    title: '[방식 3 상세] Claude Code로 전표 검증 프로그램 만들기',
    excerpt: '코딩 몰라도 된다. 매월 수백 건의 전표를 자동으로 검증하는 Python 스크립트를 AI가 대신 만들어주는 과정',
    category: 'RPA',
    tags: ['ClaudeCode', 'Python', '전표검증', '자동화'],
    readTime: '15분',
    author: 'K팀장',
  },
];

async function run() {
  console.log('🔄  가이드 업데이트 시작...\n');

  for (const u of updates) {
    // 기존 문서 삭제
    await db.collection('guides').doc(u.oldSlug).delete();
    console.log(`🗑️   삭제: guides/${u.oldSlug}`);

    // 새 슬러그로 저장 (content는 빈값 유지)
    await db.collection('guides').doc(u.newSlug).set({
      title: u.title,
      slug: u.newSlug,
      excerpt: u.excerpt,
      category: u.category,
      tags: u.tags,
      readTime: u.readTime,
      author: u.author,
      content: '',
      publishedAt: Timestamp.now(),
    });
    console.log(`✅  생성: guides/${u.newSlug}`);
  }

  console.log('\n🎉  완료!');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
