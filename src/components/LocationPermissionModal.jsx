import React from "react";
import styled from "styled-components";

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

const LocationIconContainer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px auto;
  position: relative;
`;

const LocationIcon = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
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

const ActionButton = styled.button`
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

  &:hover {
    background: #6bb3a8;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 20px;
  color: #9ca3af;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
    color: #374151;
  }
`;

const LocationPermissionModal = ({ isOpen, onClose, onRetry }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRetryClick = () => {
    if (onRetry) {
      onRetry();
    }
    onClose();
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <LocationIconContainer>
          <LocationIcon
            src="/UI/location-pin-disabled--navigation-map-maps-pin-gps-location-disabled-off.svg"
            alt="위치 권한 비활성화"
          />
        </LocationIconContainer>
        <ModalTitle>위치 권한이 필요합니다.</ModalTitle>
        <ModalSubtitle>
          원활한 서비스 이용을 위해
          <br />
          위치 권한을 허용해 주세요.
        </ModalSubtitle>
        <ActionButton onClick={handleRetryClick}>다시 시도하기</ActionButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LocationPermissionModal;
