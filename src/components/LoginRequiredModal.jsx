import React from "react";
import styled from "styled-components";
import { FaUser, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px 24px 24px 24px;
  width: 100%;
  max-width: 320px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const UserIconContainer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px auto;
`;

const UserIcon = styled(FaUser)`
  font-size: 40px;
  color: #9ca3af;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
  line-height: 1.4;
`;

const ModalSubtitle = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 32px 0;
  line-height: 1.4;
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 16px 20px;
  background: #80c7bc;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: #6bb3a8;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ArrowIcon = styled(FaArrowRight)`
  font-size: 14px;
`;

const LoginRequiredModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLoginClick = () => {
    onClose();
    navigate("/login");
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <UserIconContainer>
          <UserIcon />
        </UserIconContainer>
        <ModalTitle>로그인이 필요합니다.</ModalTitle>
        <ModalSubtitle>먼저 로그인해주세요.</ModalSubtitle>
        <LoginButton onClick={handleLoginClick}>
          로그인하러 가기
          <ArrowIcon />
        </LoginButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LoginRequiredModal;
