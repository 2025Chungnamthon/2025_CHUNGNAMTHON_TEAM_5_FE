import React from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 5px solid #ccc;
  border-top-color: #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  font-size: 14px;
  color: #666;
  text-align: center;
`;

const LoadingOverlay = ({ text }) => {
  return (
    <Overlay>
      <Spinner />
      {text && <LoadingText>{text}</LoadingText>}
    </Overlay>
  );
};

export default LoadingOverlay;
