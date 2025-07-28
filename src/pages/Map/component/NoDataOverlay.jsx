import React from "react";
import styled from "styled-components";

const OverlayContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  z-index: 500;
  max-width: 280px;
`;

const Icon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
`;

const Message = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.4;
`;

const NoDataOverlay = ({ message = "이 지역의 가맹점 정보가 없습니다." }) => {
  return (
    <OverlayContainer>
      <Icon>🏪</Icon>
      <Title>가맹점 정보 없음</Title>
      <Message>{message}</Message>
    </OverlayContainer>
  );
};

export default NoDataOverlay;
