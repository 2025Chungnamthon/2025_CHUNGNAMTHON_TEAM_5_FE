import React, { useEffect } from "react";
import GlobalStyles from "./styles/GlobalStyles";
import AppRouter from "./router/AppRouter";
import { ToastProvider } from "./components/ToastProvider";
import { useAuthInitializer } from "./hooks/useAuth";

function App() {
  // 앱 초기화 시 토큰 복원
  useAuthInitializer();

  // PWA 환경 감지 및 CSS 변수 설정
  useEffect(() => {
    const detectPWAEnvironment = () => {
      // 여러 방법으로 PWA 환경 감지
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      const isFullscreen = window.matchMedia(
        "(display-mode: fullscreen)"
      ).matches;
      const isMinimalUI = window.matchMedia(
        "(display-mode: minimal-ui)"
      ).matches;
      const isIOSStandalone = window.navigator.standalone === true;

      // PWA 환경인지 확인
      const isPWA =
        isStandalone || isFullscreen || isMinimalUI || isIOSStandalone;

      // CSS 변수 설정
      document.documentElement.style.setProperty("--is-pwa", isPWA ? "1" : "0");

      console.log("PWA 환경 감지:", {
        isStandalone,
        isFullscreen,
        isMinimalUI,
        isIOSStandalone,
        isPWA,
      });
    };

    detectPWAEnvironment();

    // 화면 방향 변경 시에도 다시 감지
    window.addEventListener("orientationchange", detectPWAEnvironment);

    return () => {
      window.removeEventListener("orientationchange", detectPWAEnvironment);
    };
  }, []);

  return (
    <>
      <GlobalStyles />
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </>
  );
}

export default App;
