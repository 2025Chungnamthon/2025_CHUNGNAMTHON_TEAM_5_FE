import React from "react";
import styled from "styled-components";

const ExchangeConfirmModal = ({ coupon, onConfirm, onCancel }) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>쿠폰으로 교환할까요?</ModalTitle>
        <ModalButtons>
          <CancelButton onClick={onCancel}>취소</CancelButton>
          <ConfirmButton onClick={onConfirm}>교환하기</ConfirmButton>
        </ModalButtons>
      </ModalContent>
    </ModalOverlay>
  );
};

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
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin: 20px;
  max-width: 320px;
  width: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  text-align: center;
  margin: 0 0 24px 0;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const CancelButton = styled.button`
  flex: 1;
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
  }
`;

const ConfirmButton = styled.button`
  flex: 1;
  background: #80c7bc;
  border: none;
  color: white;
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #6bb3a8;
  }
`;

export default ExchangeConfirmModal;
