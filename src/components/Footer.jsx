import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-blue-900 rounded flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-slate-900">
                회계<span className="text-blue-900">.AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              현업 회계·재무 실무자를 위한 AI 자동화 레시피 저장소.
              각 회사가 서로에게 배우는 선순환을 만듭니다.
            </p>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 mb-3">콘텐츠</div>
            <div className="space-y-2 text-sm text-slate-600">
              <Link to="/howto" className="block hover:text-blue-900">How-to 가이드</Link>
              <Link to="/cases" className="block hover:text-blue-900">Case Study</Link>
              <Link to="/submit" className="block hover:text-blue-900">사례 제보</Link>
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 mb-3">연결</div>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="hover:text-blue-900 cursor-pointer">뉴스레터</div>
              <div className="hover:text-blue-900 cursor-pointer">이메일 문의</div>
              <div className="hover:text-blue-900 cursor-pointer">개인정보 처리방침</div>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-200 text-xs text-slate-500">
          © 2026 회계.AI · Built by 회계팀장, for 회계팀
        </div>
      </div>
    </footer>
  );
}
