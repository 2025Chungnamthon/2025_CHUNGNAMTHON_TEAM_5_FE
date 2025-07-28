import React from "react";
import styled from "styled-components";
import {
  Outlet,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaMapMarkerAlt,
  FaCommentDots,
  FaUser,
  FaCloud,
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
  padding: 0 0
    ${(props) =>
      props.$hideTabBar ? "0" : "calc(60px + env(safe-area-inset-bottom))"}
    0; // 탭 바 숨김 여부에 따라 패딩 조정, safe area 추가 (70px → 60px)
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
  box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.08); // 그림자 강화
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: calc(60px + env(safe-area-inset-bottom)); // 높이 조정 (70px → 60px)
  z-index: 99;
  padding-bottom: env(safe-area-inset-bottom); // iOS 하단 안전영역 대응
  border-top: 1px solid #f0f0f0; // 상단 경계선 추가
`;

const TabItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 11px; // 폰트 크기 약간 조정
  color: ${(props) => (props.isActive ? "#23272F" : "#B0B5BB")};
  cursor: pointer;
  transition: all 0.2s;
  padding: 8px 0 4px 0; // 패딩 조정: 상단 12px → 8px, 하단 0px → 4px로 줄이기
  font-weight: ${(props) => (props.isActive ? "600" : "400")};
  min-height: 50px; // 최소 높이 설정 (60px → 50px로 줄이기)
  justify-content: center;

  svg {
    font-size: 26px; // 아이콘 크기 증가 (24px → 26px)
    margin-bottom: 4px; // 마진 조정 (6px → 4px로 줄이기)
    color: ${(props) => (props.isActive ? "#23272F" : "#B0B5BB")};
    transition: color 0.2s;
  }

  &:active {
    transform: scale(0.95); // 터치 피드백
  }
`;

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // 탭 바를 숨길 조건들
  const shouldHideTabBar = () => {
    // 모임 수정 모드일 때 탭 바 숨김
    if (
      location.pathname === "/create-meeting" &&
      searchParams.get("mode") === "edit"
    ) {
      return true;
    }
    return false;
  };

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
        <Content $hideTabBar={shouldHideTabBar()}>
          <Outlet />
        </Content>
        {!shouldHideTabBar() && (
          <TabBar>
            <TabItem
              isActive={isActive("/")}
              onClick={() => handleNavigation("/")}
            >
              <FaHome />홈
            </TabItem>
            <TabItem
              isActive={isActive("/map")}
              onClick={() => handleNavigation("/map")}
            >
              <FaMapMarkerAlt />
              지도
            </TabItem>
            <TabItem
              isActive={isActive("/meetings")}
              onClick={() => handleNavigation("/meetings")}
            >
              <FaCloud />
              모임
            </TabItem>
            <TabItem
              isActive={isActive("/mypage")}
              onClick={() => handleNavigation("/mypage")}
            >
              <FaUser />
              My
            </TabItem>
          </TabBar>
        )}
      </AppContainer>
    </RootContainer>
  );
}
