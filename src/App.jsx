import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect } from 'react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import HowtoPage from './pages/HowtoPage';
import GuideDetailPage from './pages/GuideDetailPage';
import CasesPage from './pages/CasesPage';
import CaseDetailPage from './pages/CaseDetailPage';
import SubmitPage from './pages/SubmitPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  // 브라우저의 자동 스크롤 복원 비활성화 (최초 1회)
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // paint 전에 실행(useLayoutEffect)해서 스크롤 깜빡임 방지
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-white font-sans">
        <Nav />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/howto" element={<HowtoPage />} />
            <Route path="/howto/:slug" element={<GuideDetailPage />} />
            <Route path="/guides/:slug" element={<GuideDetailPage />} />
            <Route path="/cases" element={<CasesPage />} />
            <Route path="/cases/:slug" element={<CaseDetailPage />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminPage />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
