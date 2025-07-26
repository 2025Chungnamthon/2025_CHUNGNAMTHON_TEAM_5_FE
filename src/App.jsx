import React, { useEffect } from "react";
import GlobalStyles from "./styles/GlobalStyles";
import AppRouter from "./router/AppRouter";

import { restoreAuthFromStorage } from "@/stores/authStore";

function App() {
  useEffect(() => {
    restoreAuthFromStorage();
  }, []);

  return (
    <>
      <GlobalStyles />
      <AppRouter />
    </>
  );
}

export default App;
