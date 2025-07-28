import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import GlobalStyles from "./styles/GlobalStyles";
import AppRouter from "./router/AppRouter";
import { toastConfig } from "./config/toastConfig";

function App() {
  useEffect(() => {}, []);

  return (
    <>
      <GlobalStyles />
      <AppRouter />
      <Toaster {...toastConfig} />
    </>
  );
}

export default App;
