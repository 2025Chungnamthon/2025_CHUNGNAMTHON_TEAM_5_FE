import React from "react";
import styled from "styled-components";
import { FiMinus, FiPlus } from "react-icons/fi";

const CounterWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const CounterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 16px;
`;

const CounterButton = styled.button`
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  svg {
    font-size: 20px;
    color: #6b7280;
  }
  
  &:hover {
    background: #e5e7eb;
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    
    &:hover {
      background: #f3f4f6;
      transform: none;
    }
  }
`;

const CounterDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  font-weight: 600;
  color: #333;
  min-width: 120px;
  justify-content: center;
`;

const MemberCounter = ({ count, onCountChange, min = 2, max = 10, title = "인원 설정" }) => {
    const handleDecrement = () => {
        if (count > min) {
            onCountChange(count - 1);
        }
    };

    const handleIncrement = () => {
        if (count < max) {
            onCountChange(count + 1);
        }
    };

    return (
        <CounterWrapper>
            <SectionTitle>{title}</SectionTitle>
            <CounterContainer>
                <CounterButton
                    onClick={handleDecrement}
                    disabled={count <= min}
                    aria-label="인원 수 감소"
                >
                    <FiMinus />
                </CounterButton>
                <CounterDisplay>
                    최대 <strong>{count}</strong> 명
                </CounterDisplay>
                <CounterButton
                    onClick={handleIncrement}
                    disabled={count >= max}
                    aria-label="인원 수 증가"
                >
                    <FiPlus />
                </CounterButton>
            </CounterContainer>
        </CounterWrapper>
    );
};

export default MemberCounter;