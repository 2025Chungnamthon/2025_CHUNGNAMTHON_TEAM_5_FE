import React from "react";
import styled from "styled-components";
import { FiUsers, FiCamera } from "react-icons/fi";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.18);
  z-index: 99;
`;

const Menu = styled.div`
  position: fixed;
  right: calc(50% - 210px + 17px);
  bottom: 147px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 16px 0 rgb(0 0 0 / 0.1);
  padding: 10px 0 10px 0; /* 위/아래 여백 최소화 */
  min-width: 188px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const MenuItem = styled.button`
  background: none;
  border: none;
  color: #222;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 24px;
  cursor: pointer;
  &:hover {
    background: #f3f4f6;
  }
  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;

export default function ActionMenu({
  onClose,
  onCreateGroup,
  onCertifyReceipt,
}) {
  return (
    <>
      <Overlay onClick={onClose} />
      <Menu>
        <MenuItem onClick={onCreateGroup}>
          <FiUsers /> 모임 생성하기
        </MenuItem>
        <MenuItem onClick={onCertifyReceipt}>
          <FiCamera /> 영수증 인증하기
        </MenuItem>
      </Menu>
    </>
  );
}
