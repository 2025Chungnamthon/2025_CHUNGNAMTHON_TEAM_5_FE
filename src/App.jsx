import React from "react";
import GlobalStyles from "./styles/GlobalStyles";
// import { AppProvider } from "./contexts/AppContext"; // 필요시 주석 해제
// import Header from "./components/layout/Header"; // 필요시 주석 해제
// import Footer from "./components/layout/Footer"; // 필요시 주석 해제
import AppRouter from "./router/AppRouter";
// import { Toaster } from "react-hot-toast"; // 필요시 주석 해제
// import styled from "styled-components"; // Removed as per edit hint

// const MOBILE_MAX_WIDTH = 420; // Removed as per edit hint

// const AppContainer = styled.div` // Removed as per edit hint
//   min-height: 100vh;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   background: #fff;
// `;

// const MainContent = styled.main` // Removed as per edit hint
//   flex: 1;
//   width: 100%;
//   max-width: ${MOBILE_MAX_WIDTH}px;
//   margin: 0 auto;
//   background: transparent;
//   box-sizing: border-box;
//   padding-left: 16px;
//   padding-right: 16px;
//   ${media.phone`
//     padding-left: 8px;
//     padding-right: 8px;
//   `}
// `;

function App() {
  return (
    <>
      <GlobalStyles />
      {/* <Header /> */}
      {/* <MainContent> */}
      <AppRouter />
      {/* </MainContent> */}
      {/* <Footer /> */}
      {/* <Toaster ... /> */}
    </>
  );
}

export default App;
