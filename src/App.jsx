import React, { useEffect } from "react";
import GlobalStyles from "./styles/GlobalStyles";
import AppRouter from "./router/AppRouter";

function App() {
  useEffect(() => {
  }, []);

  return (
    <>
      <GlobalStyles />
      <AppRouter />
    </>
  );
}

export default App;
