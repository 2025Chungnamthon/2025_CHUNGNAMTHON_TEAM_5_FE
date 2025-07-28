import React from "react";
import styled from "styled-components";

const ButtonContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
`;

const ResearchButton = styled.button`
  background: white;
  color: #80c7bc;
  border: 2px solid #80c7bc;
  border-radius: 16px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 140px;
  justify-content: center;

  &:hover {
    background: #f8f9fa;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #f5f5f5;
    color: #ccc;
    border-color: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const SearchIcon = styled.span`
  font-size: 16px;
`;

const ResearchButtonComponent = ({ onClick, disabled = false }) => {
  return (
    <ButtonContainer>
      <ResearchButton onClick={onClick} disabled={disabled}>
        이 지역 가맹점 검색
      </ResearchButton>
    </ButtonContainer>
  );
};

export default ResearchButtonComponent;
