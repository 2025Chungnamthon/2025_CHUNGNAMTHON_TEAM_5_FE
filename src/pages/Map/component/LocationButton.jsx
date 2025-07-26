import React from "react";
import styled from "styled-components";
import { FiNavigation } from "react-icons/fi";

const ButtonContainer = styled.button`
  position: absolute;
  bottom: 50vh;
  right: 16px;
  width: 48px;
  height: 48px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  z-index: 25;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const StyledNavigationIcon = styled(FiNavigation)`
  color: #80c7bc;
  width: 48px;
  height: 48px;
`;

const LocationButton = React.memo(({ onClick, disabled }) => {
  return (
    <ButtonContainer onClick={onClick} disabled={disabled}>
      <StyledNavigationIcon />
    </ButtonContainer>
  );
});

export default LocationButton;
