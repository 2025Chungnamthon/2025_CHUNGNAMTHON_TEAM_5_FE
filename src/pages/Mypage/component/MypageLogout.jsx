import React from "react";
import styled from "styled-components";
import { useLogout } from "../../../hooks/useAuth";

const LogoutContainer = styled.div`
  padding: 0 16px;
`;

const LogoutText = styled.div`
  color: #a0a0a0;
  font-size: 14px;
  text-align: left;
  padding: 0 16px 12px 16px;
  background-color: transparent;
  cursor: pointer;
`;

const MypageLogout = () => {
  const logoutMutation = useLogout();

  const handleLogout = () => {
    if (window.confirm("정말 로그아웃 하시겠습니까?")) {
      logoutMutation.mutate();
    }
  };

  return (
    <LogoutContainer>
      <LogoutText onClick={handleLogout}>
        {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
      </LogoutText>
    </LogoutContainer>
  );
};

export default MypageLogout;
