import React from "react";
import styled from "styled-components";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaMapMarkerAlt,
  FaCommentDots,
  FaUser,
} from "react-icons/fa";

const MOBILE_MAX_WIDTH = 430;

// 전체 앱을 감싸는 최상위 컨테이너 (모바일 앱 프레임 역할)
const RootContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5; // 앱 프레임 바깥 배경색
  display: flex;
  justify-content: center;
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  max-width: ${MOBILE_MAX_WIDTH}px;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.08); // 앱 프레임 그림자 강화
  position: relative;
  overflow-x: hidden; // 가로 스크롤 방지
`;

const Content = styled.main`
  flex: 1;
  padding: 0 0 80px 0;
  background: #fff;
  min-height: 0;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

const TabBar = styled.nav`
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 100%;
  max-width: ${MOBILE_MAX_WIDTH}px;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 64px;
  z-index: 99;
  padding-bottom: env(safe-area-inset-bottom); // iOS 하단 안전영역 대응
`;

const TabItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  color: ${(props) => (props.isActive ? "#2dd4bf" : "#6b7280")};
  cursor: pointer;
  transition: all 0.2s;
  padding: 8px 0;

  svg {
    font-size: 22px;
    margin-bottom: 2px;
  }

  &:hover {
    color: #2dd4bf;
    transform: translateY(-2px); // 호버 시 살짝 위로 떠오르는 효과
  }
`;

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <RootContainer>
      <AppContainer>
        <Content>
          <Outlet />
        </Content>
        <TabBar>
          <TabItem
            isActive={isActive("/")}
            onClick={() => handleNavigation("/")}
          >
            <FaHome />홈
          </TabItem>
          <TabItem
            isActive={isActive("/meetings")}
            onClick={() => handleNavigation("/meetings")}
          >
            <FaUsers />
            모임
          </TabItem>
          <TabItem
            isActive={isActive("/map")}
            onClick={() => handleNavigation("/map")}
          >
            <FaMapMarkerAlt />
            지도
          </TabItem>
          <TabItem
            isActive={isActive("/chat")}
            onClick={() => handleNavigation("/chat")}
          >
            <FaCommentDots />
            채팅
          </TabItem>
          <TabItem
            isActive={isActive("/mypage")}
            onClick={() => handleNavigation("/mypage")}
          >
            <FaUser />
            MY
          </TabItem>
        </TabBar>
      </AppContainer>
    </RootContainer>
  );
}
