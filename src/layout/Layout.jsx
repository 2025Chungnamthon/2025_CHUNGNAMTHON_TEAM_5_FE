import React from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaMapMarkerAlt,
  FaCommentDots,
  FaUser,
} from "react-icons/fa";

const MOBILE_MAX_WIDTH = 430;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: ${MOBILE_MAX_WIDTH}px;
  margin: 0 auto;
  background: #fafbfc;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.04);
  position: relative;
`;

const Header = styled.header`
  background-color: #fff;
  padding: 20px 20px 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: "Inter", sans-serif;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;

const LogoRow = styled.div`
  display: flex;
  align-items: center;
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

const Content = styled.main`
  flex: 1;
  padding: 0 0 80px 0;
  background: transparent;
  min-height: 0;
`;

const TabBar = styled.nav`
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 100vw;
  max-width: ${MOBILE_MAX_WIDTH}px;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.06);
  border-top: none;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 64px;
  z-index: 99;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;

const TabItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  color: #6b7280;
  svg {
    font-size: 22px;
    margin-bottom: 2px;
  }
  &:hover {
    color: #2dd4bf;
  }
`;

export default function Layout() {
  return (
    <AppContainer>
      <Header>
        <LogoRow>
          <LogoImg src="/logo.png" alt="Cheon:On 로고" />
        </LogoRow>
        <PointBadge>
          <PointCircle>P</PointCircle>
          <PointValue>1,620p</PointValue>
        </PointBadge>
      </Header>
      <Content>
        <Outlet />
      </Content>
      <TabBar>
        <TabItem>
          <FaHome />홈
        </TabItem>
        <TabItem>
          <FaUsers />
          모임
        </TabItem>
        <TabItem>
          <FaMapMarkerAlt />
          지도
        </TabItem>
        <TabItem>
          <FaCommentDots />
          채팅
        </TabItem>
        <TabItem>
          <FaUser />
          MY
        </TabItem>
      </TabBar>
    </AppContainer>
  );
}
