import React from "react";
import styled from "styled-components";
import { FaExclamationTriangle } from "react-icons/fa";

const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ErrorContent = styled.div`
  color: #dc2626;
  text-align: center;
  padding: 20px;
`;

const ErrorTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const ErrorMessage = styled.div`
  font-size: 12px;
  margin-bottom: 16px;
`;

const RefreshButton = styled.button`
  margin-top: 10px;
  padding: 8px 16px;
  background: #80c7bc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #6bb3a8;
  }
`;

const ErrorOverlay = ({ message }) => {
  return (
    <OverlayContainer>
      <ErrorContent>
        <FaExclamationTriangle size={24} style={{ marginBottom: "8px" }} />
        <ErrorTitle>❌ 지도를 불러올 수 없습니다</ErrorTitle>
        <ErrorMessage>{message}</ErrorMessage>
        <RefreshButton onClick={() => window.location.reload()}>
          새로고침
        </RefreshButton>
      </ErrorContent>
    </OverlayContainer>
  );
};

export default ErrorOverlay;
