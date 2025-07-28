import React, { useEffect } from "react";
import styled from "styled-components";
import PointDisplay from "@/components/PointDisplay";
import { useUIStore } from "@/stores/uiStore";

const Header = styled.header`
  background-color: #fff;
  padding: 12px 20px 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "Inter", sans-serif;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);

  /* PWA 환경에서만 상단 여백 추가 */
  @media (display-mode: standalone) {
    padding: 66px 20px 12px 20px;
  }

  /* JavaScript로 감지한 PWA 환경에서도 적용 */
  &[data-pwa="true"] {
    padding: 66px 20px 12px 20px;
  }
`;

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }
`;

const LogoImg = styled.img`
  width: 254px;
  height: 30px;
  display: block;
`;

const PointBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  box-shadow: none;
`;

function HeaderComponent() {
  const { points, refreshPoints } = useUIStore();
  const [isPWA, setIsPWA] = React.useState(false);

  // PWA 환경 감지
  React.useEffect(() => {
    const checkPWA = () => {
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

      const isPWAEnvironment =
        isStandalone || isFullscreen || isMinimalUI || isIOSStandalone;
      setIsPWA(isPWAEnvironment);
    };

    checkPWA();
    window.addEventListener("orientationchange", checkPWA);

    return () => {
      window.removeEventListener("orientationchange", checkPWA);
    };
  }, []);

  const handleLogoClick = () => {
    window.location.href = "/";
  };

  // 포인트 데이터가 없거나 오래된 경우 새로고침
  useEffect(() => {
    if (points.currentPoints === 0 || !points.lastUpdated) {
      refreshPoints();
    }
  }, [points.currentPoints, points.lastUpdated, refreshPoints]);

  return (
    <Header data-pwa={isPWA}>
      <LogoRow onClick={handleLogoClick}>
        <LogoImg src="/logo.svg" alt="Cheon:On 로고" />
      </LogoRow>
      <PointBadge>
        <PointDisplay
          points={points.currentPoints || 0}
          size="28px"
          fontSize="18px"
          iconFontSize="18px"
        />
      </PointBadge>
    </Header>
  );
}

export default HeaderComponent;
