import React from "react";
import styled from "styled-components";

const Header = styled.header`
  background-color: #fff;
  padding: 20px 20px 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "Inter", sans-serif;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
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

const PointCircle = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: #fdd756;
  color: #d18000;
  font-weight: 700;
  font-size: 18px;
  border-radius: 50%;
`;

const PointValue = styled.span`
  color: #6b7280;
  font-size: 18px;
  font-weight: 500;
  margin-left: 2px;
`;

function HeaderComponent() {
  const handleLogoClick = () => {
    window.location.href = "/";
  };
  return (
    <Header>
      <LogoRow onClick={handleLogoClick}>
        <LogoImg src="/logo.png" alt="Cheon:On 로고" />
      </LogoRow>
      <PointBadge>
        <PointCircle>P</PointCircle>
        <PointValue>1,620p</PointValue>
      </PointBadge>
    </Header>
  );
}

export default HeaderComponent;
