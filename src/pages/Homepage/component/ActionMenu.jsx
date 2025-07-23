import React from "react";
import styled from "styled-components";
import { FiUsers, FiCamera } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.18);
  z-index: 99;
`;

const Menu = styled.div`
  position: fixed;
  right: calc(50% - 210px + 17px);
  bottom: 168px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 16px 0 rgb(0 0 0 / 0.1);
  padding: 10px 0 10px 0;
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
  transition: background 0.2s;

  &:hover {
    background: #f3f4f6;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;

export default function ActionMenu({ onClose }) {
  const navigate = useNavigate();

  const handleCreateGroup = () => {
    console.log("모임 생성하기 클릭 - /create-meeting으로 이동");
    navigate("/create-meeting");
    onClose();
  };

  const handleCertifyReceipt = () => {
    console.log("영수증 인증하기 클릭");
    alert("영수증 인증 기능 준비 중입니다!");
    onClose();
  };

  return (
    <>
      <Overlay onClick={onClose} />
      <Menu>
        <MenuItem onClick={handleCreateGroup}>
          <FiUsers /> 모임 생성하기
        </MenuItem>
        <MenuItem onClick={handleCertifyReceipt}>
          <FiCamera /> 영수증 인증하기
        </MenuItem>
      </Menu>
    </>
  );
}
