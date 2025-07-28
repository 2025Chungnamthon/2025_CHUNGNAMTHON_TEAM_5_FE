import React from "react";
import styled from "styled-components";
import { FiX, FiPlus } from "react-icons/fi";

const MOBILE_MAX_WIDTH = 430;

const FabButton = styled.button`
  position: fixed;
  right: calc(50% - ${MOBILE_MAX_WIDTH / 2}px + 24px);
  bottom: calc(
    78px + env(safe-area-inset-bottom)
  ); // PWA 환경에서 safe area 추가 (88px → 78px)
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #80c7bc;
  color: #fff;
  font-size: 56px;
  box-shadow: 0 6px 24px 0 rgb(0 0 0 / 0.15);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  &:active {
    background: #5fa89e;
    box-shadow: 0 2px 8px 0 rgb(0 0 0 / 0.1);
  }
`;

export default function FloatingActionButton({ onClick, isOpen }) {
  return (
    <FabButton
      onClick={onClick}
      aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
    >
      {isOpen ? <FiX size={56} /> : <FiPlus size={56} />}
    </FabButton>
  );
}
