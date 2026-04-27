import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const example4 = `
**예시 4. ERP에서 CSV 파일 자동 다운로드**

\`\`\`
아래 조건으로 Python 스크립트를 만들어줘.

[목적]
매월 결산일에 ERP 웹 화면에 자동 로그인해서
전표 데이터를 CSV로 직접 다운로드하는 프로그램
(사람이 ERP에 접속해서 내보내기 버튼을 누르는 과정을 자동화)

[ERP 환경]
- 접속 URL: http://erp.내사내망주소.com/login
- 로그인 방식: ID/PW 입력 후 로그인 버튼 클릭
- 브라우저: Chrome

[다운로드 경로]
로그인 → 회계관리 메뉴 → 전표조회 →
조회조건 입력(기간: 당월 1일~말일, 전표유형: 전체) →
조회 버튼 클릭 → 엑셀 내보내기 버튼 클릭 → 저장

[조회 조건 자동 설정]
- 조회 시작일: 스크립트 실행 월의 1일 (자동 계산)
- 조회 종료일: 스크립트 실행 월의 말일 (자동 계산)
- 전표유형: 전체
- 사업부: 전체

[저장 경로]
/결산작업/data/전표내역_YYYYMM.csv
(YYYYMM은 실행 월 기준으로 자동 입력)

[추가 조건]
- 로그인 정보는 스크립트에 직접 넣지 말고
  별도 config.ini 파일에서 읽어오게 해줘
  (보안상 이유로 코드에 ID/PW 노출 방지)
- 다운로드 완료 후 "전표내역_202503.csv 다운로드 완료"
  메시지를 콘솔에 출력
- 페이지 로딩 지연에 대비해 각 단계마다
  최대 10초 대기 후 다음 단계 진행
- 다운로드 실패 시 오류 메시지와 함께 종료
\`\`\`

> 💡 **포인트 — config.ini 설정 방법**
> 스크립트 실행 전에 아래 형식으로 config.ini 파일을 만들어 같은 폴더에 저장해둔다. 이 파일은 절대 공유 드라이브에 올리지 않는다.

\`\`\`ini
[ERP]
url = http://erp.내사내망주소.com/login
username = 내아이디
password = 내비밀번호
\`\`\`

> ⚠️ **주의사항**
> - ERP가 **사내망(VPN)** 환경인 경우, 스크립트 실행 전 VPN 접속이 되어 있어야 한다
> - ERP 화면 구조(메뉴 위치, 버튼명 등)가 사내 커스터마이징으로 다를 수 있으므로, 처음 세팅 시 Claude Code에 **ERP 화면 캡처를 첨부**해서 "이 화면 기준으로 만들어줘"라고 하면 정확도가 높아진다
> - 이 스크립트를 다음 글의 **방식 4(완전 자동화)** 와 연결하면, ERP 다운로드부터 전표 검증, 보고서 생성까지 전 과정이 무인으로 돌아간다

`;

const insertAfter = `금액 단위: 백만 원
\`\`\`

---

### Step 4.`;

const replaceWith = `금액 단위: 백만 원
\`\`\`
${example4}
---

### Step 4.`;

async function run() {
  const ref = db.collection('guides').doc('claude-code-voucher-validation');
  const snap = await ref.get();
  if (!snap.exists) {
    console.error('문서가 없습니다.');
    process.exit(1);
  }

  const current = snap.data().content;
  if (!current.includes(insertAfter)) {
    console.error('삽입 위치를 찾을 수 없습니다. 텍스트를 확인해주세요.');
    process.exit(1);
  }

  const updated = current.replace(insertAfter, replaceWith);
  await ref.update({ content: updated });
  console.log('✅  예시 4 삽입 완료');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
