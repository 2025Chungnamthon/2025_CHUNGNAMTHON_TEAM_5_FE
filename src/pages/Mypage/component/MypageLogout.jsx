import React from "react";
import styled from "styled-components";
import { logout } from "../../../services/oauthApi";

const LogoutBtn = styled.button`
  background: none;
  color: #bdbdbd;
  font-size: 14px;
  font-weight: 500;
  border: none;
  margin: 0 0 0 24px;
  cursor: pointer;
  padding: 0;
  box-shadow: none;
  transition: color 0.2s ease, transform 0.2s ease;

  &:hover {
    color: #ff4d4f; /* 빨간색 */
    transform: translateY(-1px);
  }
`;

const MypageLogout = () => <LogoutBtn onClick={logout}>로그아웃</LogoutBtn>;

export default MypageLogout;
