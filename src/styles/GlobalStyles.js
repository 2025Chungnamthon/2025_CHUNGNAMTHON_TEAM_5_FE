import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  :root {
    --primary: #80C7BC;
    --primary-dark: #5fa89e;
    --primary-light: #e6f4f2;
    --secondary: #06b6d4;
    --gray-50: #f9fafb;
    --gray-100: #f3f4f6;
    --gray-200: #e5e7eb;
    --gray-300: #d1d5db;
    --gray-400: #9ca3af;
    --gray-500: #6b7280;
    --gray-600: #4b5563;
    --gray-900: #111827;
    --white: #fff;
    --black: #000;
    --yellow: #fde68a;
    --yellow-dark: #fbbf24;
    --shadow-card: 0 2px 8px 0 rgb(0 0 0 / 0.06);
    --shadow-nav: 0 -2px 8px 0 rgb(0 0 0 / 0.04);
    --radius-lg: 16px;
    --radius-md: 12px;
    --radius-sm: 8px;
    --safe-area-inset-bottom: env(safe-area-inset-bottom);
    --safe-area-inset-top: env(safe-area-inset-top);
  }

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    font-family: 'Inter', 'Apple SD Gothic Neo', 'Roboto', 'sans-serif';
    background: #fafbfc;
    color: var(--gray-900);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overscroll-behavior: none;
    touch-action: manipulation;
  }

  body {
    min-height: 100vh;
    background: #fafbfc;
    padding-bottom: var(--safe-area-inset-bottom);
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #fafbfc;
  }

  /* PWA 상태바 영역 스타일 */
  @supports (padding: max(0px)) {
    body {
      padding-bottom: max(var(--safe-area-inset-bottom), 0px);
    }
  }

  /* iOS 상태바 영역 배경색 제거 */

  a {
    color: var(--primary);
    text-decoration: none;
  }

  button {
    font-family: inherit;
    border: none;
    outline: none;
    background: var(--primary);
    color: var(--white);
    border-radius: var(--radius-md);
    padding: 0.75rem 1.25rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    box-shadow: var(--shadow-card);
  }
  button:active {
    background: var(--primary-dark);
  }
  button:disabled {
    background: var(--gray-200);
    color: var(--gray-400);
    cursor: not-allowed;
  }

  input, textarea, select {
    font-family: inherit;
    border: none;
    outline: none;
    background: var(--gray-100);
    border-radius: var(--radius-sm);
    padding: 0.75rem 1rem;
    font-size: 1rem;
    color: var(--gray-900);
    box-shadow: none;
    transition: background 0.2s;
  }
  input:focus, textarea:focus, select:focus {
    background: var(--gray-50);
  }

  /* 카드형 UI, 섹션, 배지, 플로팅 버튼 등은 각 컴포넌트에서 styled-components로 관리 */

  /* 스크롤바 숨기기 (앱 느낌) */
  ::-webkit-scrollbar { display: none; }
  scrollbar-width: none;
  -ms-overflow-style: none;

  /* 애니메이션 키프레임 */
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* PWA 네비게이션 바 개선 */
  @media (display-mode: standalone) {
    body {
      padding-bottom: calc(var(--safe-area-inset-bottom) + 60px); // 네비게이션 바 높이와 정확히 일치 (70px → 60px)
    }
    
    /* PWA 환경에서 하단 safe area 추가 처리 */
    #root {
      padding-bottom: env(safe-area-inset-bottom);
    }
  }

  /* 터치 피드백 개선 */
  * {
    -webkit-tap-highlight-color: transparent;
  }

  /* iOS Safari에서 스크롤 바운스 효과 제거 */
  html {
    -webkit-overflow-scrolling: touch;
  }
`;

export default GlobalStyles;
