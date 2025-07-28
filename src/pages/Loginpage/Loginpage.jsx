import React from "react";
import styled from "styled-components";
import { startSocialLogin } from "../../services/auth";

const MOBILE_MAX_WIDTH = 430;

const PageContainer = styled.div`
  max-width: ${MOBILE_MAX_WIDTH}px;
  min-height: 100vh;
  margin: 0 auto;
  background: #fafbfc;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 0 0;
`;
const LogoSection = styled.div`
  margin-bottom: 32px;
  text-align: center;
`;

const LogoImg = styled.img`
  width: 118px;
  height: 134px;
  margin-bottom: 16px;
`;

const KakaoButton = styled.img`
  width: 310px;
  height: 52px;
  display: block;
  cursor: pointer;
`;

const Loginpage = () => {
  return (
    <PageContainer>
      <LogoSection>
        <LogoImg src="UI/login-logo.svg" alt="천온 로고" />
      </LogoSection>

      <KakaoButton
        src="/UI/kakao-login-btn.svg"
        onClick={() => {
          startSocialLogin("kakao");
        }}
        alt="카카오톡 아이콘"
      />
    </PageContainer>
  );
};

export default Loginpage;
