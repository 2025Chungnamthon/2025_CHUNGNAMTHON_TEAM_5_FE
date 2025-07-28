import React from "react";
import styled from "styled-components";
import { FaLocationArrow } from "react-icons/fa";

const ButtonContainer = styled.button`
  position: absolute;
  bottom: 50vh;
  right: 16px;
  width: 48px;
  height: 48px;
  background: #80c7bc;
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
    background: #6bb3a8;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const StyledEmojiIcon = styled.span`
  font-size: 20px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchButton = styled.button`
  position: absolute;
  bottom: calc(50vh + 60px);
  right: 16px;
  padding: 8px 12px;
  background: #80c7bc;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  z-index: 25;
  transition: all 0.2s;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #6bb3a8;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const LocationButton = React.memo(({ onClick, disabled, onSearchNearby }) => {
  return (
    <>
      <ButtonContainer onClick={onClick} disabled={disabled}>
        <StyledEmojiIcon>
          <FaLocationArrow size={20} />
        </StyledEmojiIcon>
      </ButtonContainer>
      {onSearchNearby && (
        <SearchButton
          onClick={onSearchNearby}
          disabled={disabled}
        ></SearchButton>
      )}
    </>
  );
});

export default LocationButton;
