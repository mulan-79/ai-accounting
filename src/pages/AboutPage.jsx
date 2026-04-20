export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-sm font-medium text-blue-900 mb-2">About</div>
      <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-8">
        이 사이트를 만든 이유
      </h1>
      <div className="space-y-6 text-slate-700 leading-relaxed">
        <p className="text-lg">
          저는 한 제약회사 재무팀에서 일하는 회계팀장입니다. 2023년 AI 붐이 시작된 이후 ChatGPT,
          Claude 같은 도구를 업무에 하나씩 적용해봤고, 그 결과가 기대 이상이었습니다.
        </p>
        <p>
          결산 체크리스트 관리, 임원보고서 작성, 감사법인 선정을 위한 RFP 비교 — 반복되고
          소모적이던 일들이 AI와 함께하니 의미 있는 판단 작업에만 집중할 수 있게 되었습니다.
        </p>
        <p>
          문제는 이런 노하우가 각 회사 안에 고립되어 있다는 점이었습니다. 옆 회사 재무팀이 어떻게
          자동화하는지 알 길이 없고, 비슷한 시행착오를 반복합니다.
        </p>
        <p className="font-medium text-slate-900">
          이 사이트는 그 고립을 깨기 위해 만들었습니다.
        </p>
        <p>
          제가 직접 검증한 레시피를 먼저 공개하고, 다른 회사의 사례를 제보받아 큐레이션합니다. 각
          회사가 서로의 경험에서 배우고, 또 자기 경험을 나누는 선순환 — 그게 목표입니다.
        </p>
      </div>
    </div>
  );
}
