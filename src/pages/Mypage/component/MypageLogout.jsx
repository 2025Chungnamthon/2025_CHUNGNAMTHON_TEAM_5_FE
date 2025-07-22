import React from "react";
import styled from "styled-components";
import { logout, removeTokenFromStorage } from "../../../utils/auth";

const LogoutBtn = styled.button`
  background: none;
  color: #bdbdbd;
  font-size: 14px;
  font-weight: 500;
  border: none;
  margin: 16px 0 0 24px;
  cursor: pointer;
  padding: 0;
  box-shadow: none;
  transition: color 0.2s ease, transform 0.2s ease;

  &:hover {
    color: #ff4d4f; /* 빨간색 */
    transform: translateY(-1px);
  }
`;

const DevLogoutBtn = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  margin: 16px 24px 0 24px;

  &:hover {
    background: #dc2626;
  }
`;

const MypageLogout = () => {
  const handleLogout = () => {
    logout();
  };

  const handleDevLogout = () => {
    removeTokenFromStorage();
    window.location.reload();
  };

  return (
    <>
      <LogoutBtn onClick={handleLogout}>로그아웃</LogoutBtn>
      <DevLogoutBtn onClick={handleDevLogout}>
        개발용: 게스트 모드로 전환
      </DevLogoutBtn>
    </>
  );
};

export default MypageLogout;
