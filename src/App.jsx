import React from "react";
import { Toaster } from "react-hot-toast";
import GlobalStyles from "./styles/GlobalStyles";
import AppRouter from "./router/AppRouter";
import { ToastProvider } from "./components/ToastProvider";
import { useAuthInitializer } from "./hooks/useAuth";

function App() {
  // 앱 초기화 시 토큰 복원
  useAuthInitializer();

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
