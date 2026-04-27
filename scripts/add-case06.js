import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const content = `# 경영진용 재무 대시보드를 AI로 직접 만든 방법
## 케이스 스터디 06 — 기획부터 배포까지, Claude와 단둘이 만든 실시간 재무 현황판

---

## 어떤 상황이었나

J재무팀장은 매달 같은 고민을 했다.

경영진이 재무 현황을 물어볼 때마다 엑셀을 열고, 수치를 정리하고, 이메일로 보내는 과정이 반복됐다. 그나마도 "최신 데이터인가요?" 라는 질문이 돌아오면 또 확인해야 했다.

> "경영진이 원할 때 직접 볼 수 있는 대시보드가 있으면 어떨까. IT팀에 요청하면 몇 달이 걸리고, 외주 맡기면 비용도 만만치 않은데…"

코딩 경험이 없었다. 하지만 Claude가 있었다.

---

## 전체 과정 요약

이 프로젝트는 크게 두 단계로 진행됐다.

| 단계 | 도구 | 작업 내용 |
|------|------|-----------|
| 1단계 | Claude 채팅 | 데이터 구조 설계 + 피드 자동화 + 프롬프트 생성 |
| 2단계 | Claude Code | Next.js 대시보드 구현 + GitHub + Cloudflare 배포 |

---

## 1단계: 데이터 구조부터 설계했다

### Google Sheets를 데이터베이스로 쓰기

첫 번째 질문은 "데이터를 어디에 어떻게 저장하는가"였다.

J팀장은 이미 Google Sheets에 재무 데이터를 관리하고 있었다. Claude에게 이 상황을 설명하자, 별도의 DB 없이 Google Sheets를 그대로 데이터 소스로 활용하는 구조를 제안했다.

핵심은 **피드(Feed) 시트**라는 개념이었다.

\`\`\`
기존 시트 (사람이 보는 형식)
→ Apps Script 자동 변환
→ 피드 시트 (대시보드가 읽는 형식)
\`\`\`

피드 시트의 구조는 이렇다.

| 컬럼 | 설명 | 예시 |
|------|------|------|
| 회사 | 법인명 | **제약 |
| 연도 | 회계연도 | 2025 |
| 분기 | 분기 또는 FY | 1Q / FY |
| 월 | 월 (1~12) | 3 |
| 구분 | 데이터 타입 | PL_월별 / BS |
| 계정과목 | 항목명 | Ⅰ. 매출액 |
| 금액 | 수치 (원 단위) | 85000000000 |

PL(손익)은 월별로 쌓이는 \`PL_월별\`, BS(재무상태표)는 분기별 스냅샷으로 구분 = \`BS\`로 설계했다. 이 구조 덕분에 대시보드는 어떤 기간도 유연하게 집계할 수 있다.

### Apps Script로 피드 자동 업데이트

기존 결산 시트에서 피드 시트로 데이터를 매번 수동 복사할 수는 없었다. Claude와 대화하면서 **Google Apps Script** 자동화까지 함께 만들었다.

결산 시트가 업데이트될 때마다 Apps Script가 자동으로 피드 시트를 갱신하는 구조다. 이제 J팀장이 기존 방식대로 결산을 입력하면, 피드 시트가 알아서 최신 상태를 유지한다.

### 디자인 방향과 Claude Code 프롬프트 생성

데이터 구조가 확정되자 Claude에게 대시보드 디자인 시안도 함께 논의했다.

- 헤더: 네이비(#0f2744) 배경, 로고 + 페이지 네비
- 배경: #f4f5f7 라이트 그레이
- KPI 카드: 흰 배경, 전기 대비 증감 화살표
- 포인트 컬러: 네이비 / 블루 / 그린 / 레드

마지막으로 Claude가 이 모든 내용을 정리해서 **Claude Code에게 넘길 상세 프롬프트**를 작성해줬다. 기획자처럼 요구사항을 정리하고, 그것을 개발자 언어로 번역해주는 역할이었다.

---

## 2단계: Claude Code로 대시보드를 구현했다

### 프롬프트 하나로 프로젝트 골격 완성

1단계에서 만든 프롬프트를 Claude Code에 붙여넣자, 단 몇 분 만에 Next.js 15 + TypeScript + Tailwind 프로젝트가 만들어졌다.

빌드 결과:

\`\`\`
Route (app)
├ ○ /           → 종합현황 (207 kB)
├ ƒ /api/feed   → Google Sheets API
└ ○ /trend      → 손익추이 (206 kB)
\`\`\`

생성된 파일 구조는 명확했다.

| 파일 | 역할 |
|------|------|
| \`lib/sheets.ts\` | Google Sheets 인증 + 데이터 조회 |
| \`lib/transform.ts\` | PL/BS 요약, 분기/월별 집계 |
| \`app/api/feed/route.ts\` | API 라우트 (5분 캐시) |
| \`app/page.tsx\` | 종합현황 (KPI, PL 테이블, BS, 재무비율) |
| \`app/trend/page.tsx\` | 손익추이 (월별/분기/연도 탭) |
| \`components/Header.tsx\` | 네이비 헤더, 네비, 연도 선택 |

### 벽 1: 사내 방화벽이 CSS를 막았다

개발 서버를 켜자 화면에 스타일이 전혀 없었다.

브라우저 콘솔을 보니 CSS 파일들이 **503 오류**로 로드되지 않고 있었다. 원인은 Next.js가 기본으로 사용하는 \`next/font/google\`이 구글 서버에 접근하려다 사내 방화벽에 막힌 것이었다.

Claude Code가 즉시 대안을 제시했다.

\`\`\`typescript
// Before — 구글 서버 접속 시도
import { Inter } from 'next/font/google';

// After — 시스템 폰트로 교체
font-family: -apple-system, BlinkMacSystemFont,
             'Segoe UI', system-ui, sans-serif;
\`\`\`

코드 수정 후 새로고침하자 네이비 헤더와 카드 레이아웃이 정상적으로 나타났다.

### 벽 2: 계정과목명이 시트와 달랐다

연결 성공 후 KPI 카드의 매출액과 영업이익이 "0억"으로 표시됐다.

Claude Code가 직접 API 응답을 분석했다. 문제는 두 가지였다.

**문제 1.** 코드는 \`PL\` 타입을 찾고 있었지만, 실제 시트에는 \`PL_월별\`만 존재했다.

**문제 2.** 계정과목명에 유니코드 로마자가 혼용되어 있었다.

\`\`\`
코드에 입력된 값:  "I. 매출액"   (ASCII 알파벳 I)
시트 실제 값:      "Ⅰ. 매출액"  (유니코드 로마 숫자 Ⅰ)
\`\`\`

육안으로는 동일해 보이지만 컴퓨터는 완전히 다른 문자로 인식한다.

시트에서 실제 데이터를 직접 가져와 비교한 뒤, \`transform.ts\`의 계정과목 매핑을 시트 실제값 기준으로 전면 교체했다. 이후 KPI 카드에 실제 매출액과 영업이익 수치가 표시됐다.

### 벽 3: UI 정리 — 필요없는 기능 제거

헤더에 "연간/분기/월별" 토글이 있었지만 종합현황 페이지 데이터와 연결이 안 되어 있어 아무 역할을 하지 못했다.

선택지를 논의한 결과, 경영진 대시보드 특성상 옵션 B가 더 적합하다는 결론을 냈다.

> "종합현황은 연간 스냅샷으로 고정, 기간 드릴다운은 손익추이 페이지에서만"

토글을 삭제하자 헤더가 훨씬 깔끔해졌다.

---

## 3단계: GitHub + Cloudflare로 배포했다

### GitHub에 올리기 전 확인한 것

코드를 GitHub에 올리기 전 Claude Code가 먼저 \`.gitignore\`를 점검했다.

스테이지된 파일 목록에서 **Service Account 키 파일** (\`.json\`)이 포함된 것을 발견하고, 즉시 알려줬다.

\`\`\`
⚠️  project-id-xxxxxxxxxx.json 파일이
    스테이지됐습니다. Service Account 키입니다.
    절대 GitHub에 올라가면 안 됩니다.
\`\`\`

키 파일을 \`.gitignore\`에 추가한 뒤 커밋했다. \`.env.local\` (환경변수 파일)도 당연히 제외됐다.

GitHub private 레포에 소스코드가 올라갔다. 민감한 정보는 단 하나도 포함되지 않았다.

### Cloudflare Pages 배포: Edge Runtime 호환 문제

Cloudflare Pages는 일반 Node.js 서버가 아닌 **Edge Runtime** 환경이다. 처음에 사용하던 \`googleapis\` 패키지는 Node.js 전용이라 Edge에서 동작하지 않는다.

Claude Code가 \`lib/sheets.ts\`를 전면 재작성했다. Node.js 의존성을 제거하고, 모든 브라우저와 Edge 환경에서 사용 가능한 **Web Crypto API**로 JWT 인증을 직접 구현하는 방식으로 바꿨다.

\`\`\`
Before: googleapis 패키지 (Node.js 전용)
After:  Web Crypto API + fetch (Edge 호환)
\`\`\`

배포 과정에서 Next.js 버전 충돌 문제도 있었다. \`@cloudflare/next-on-pages\`가 요구하는 버전보다 낮았던 것인데, Next.js를 15로 업그레이드하고, \`next.config.mjs\`에서 불필요한 개발용 코드를 제거해서 해결했다.

최종 Cloudflare Pages 설정:

| 항목 | 값 |
|------|-----|
| Build command | \`npx @cloudflare/next-on-pages@1\` |
| Build output directory | \`.vercel/output/static\` |
| Node.js version | 20 |
| GOOGLE_SHEET_ID | (환경변수로 입력) |
| GOOGLE_SERVICE_ACCOUNT_KEY | (환경변수로 입력) |

---

## 결과

| 항목 | 이전 | 이후 |
|------|------|------|
| 재무 현황 확인 방법 | 팀장에게 요청 → 이메일 | URL 접속 즉시 확인 |
| 접근 가능 위치 | 팀장 PC의 엑셀 | 어디서든 (PC, 스마트폰) |
| 데이터 최신 여부 | 이메일 발송 시점 기준 | 결산 입력 즉시 반영 |
| IT팀 의존도 | 요청 → 몇 달 대기 | 없음 |
| 개발 비용 | 외주 시 수백만 원 | 없음 |

---

## 이 케이스에서 얻을 수 있는 인사이트

**1. Claude 채팅 → Claude Code 순서가 중요하다**
채팅으로 기획과 데이터 구조를 먼저 정리하고, 완성된 요구사항을 Claude Code에 넘기는 방식이 효율적이다. 모호한 상태에서 코드부터 짜려 하면 수정이 반복된다.

**2. 기존 도구(Google Sheets)를 데이터베이스로 활용할 수 있다**
별도의 DB를 새로 구축하지 않아도 된다. 이미 쓰고 있는 Google Sheets에 피드 구조만 추가하면 대시보드가 연결된다.

**3. 오류가 나도 Claude Code가 원인까지 찾는다**
CSS 503, 계정과목 매핑 오류, Edge Runtime 충돌 — 모두 Claude Code가 로그를 직접 읽고 원인을 찾았다. 오류를 마주쳤을 때 당황하지 않고 Claude Code에 그대로 보여주면 된다.

**4. 보안은 선택이 아니다**
GitHub 업로드 전 키 파일 노출을 자동으로 잡아낸 것처럼, AI는 사람이 놓치기 쉬운 보안 실수도 챙긴다. 민감한 정보는 항상 환경변수로 분리해야 한다.

---

*이전 글: [케이스 05 — SAP 자동화를 매일 자동 실행되게 만든 방법](/cases/case05-sap-scheduler-automation)*`;

async function run() {
  await db.collection('cases').doc('case06-management-dashboard-build').set({
    title: '경영진용 재무 대시보드를 AI로 직접 만든 방법',
    slug: 'case06-management-dashboard-build',
    excerpt: '코딩 경험 없이 Claude 채팅으로 기획하고 Claude Code로 구현했다. Google Sheets 피드 구조 설계부터 Next.js 대시보드 구축, Cloudflare 배포까지 — IT팀 없이 완성한 경영진용 실시간 재무 현황판.',
    industry: '제약/재무',
    impact: '경영진이 언제 어디서나 재무 현황을 직접 확인',
    tags: ['Claude Code', 'Next.js', 'Google Sheets', 'Cloudflare', '대시보드', '재무', 'TypeScript'],
    author: 'J재무팀장',
    company: '제약회사 재무팀',
    method: '방식3+4',
    content,
    publishedAt: Timestamp.now(),
    order: 6,
  });
  console.log('✅  cases/case06-management-dashboard-build 저장 완료');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
