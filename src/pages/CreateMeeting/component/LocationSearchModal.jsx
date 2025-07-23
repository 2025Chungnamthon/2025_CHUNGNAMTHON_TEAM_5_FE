// LocationSearchModal.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { FiArrowLeft } from "react-icons/fi";

const MOBILE_MAX_WIDTH = 430;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  max-width: ${MOBILE_MAX_WIDTH}px;
  width: 100%;
  max-height: 90vh;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  background: #fff;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const Content = styled.div`
  padding: 24px 20px;
  overflow-y: auto;
  flex: 1;
`;

const Section = styled.div`
  margin-bottom: 32px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SectionBadge = styled.span`
  background: #e3f2fd;
  color: #1976d2;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
`;

const LocationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  
  @media (max-width: 400px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const LocationButton = styled.button`
  background: ${props => props.$selected ? '#80c7bc' : '#f8f9fa'};
  color: ${props => props.$selected ? 'white' : '#333'};
  border: none;
  border-radius: 12px;
  padding: 16px 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.$selected ? '#5fa89e' : '#e3f2fd'};
    color: ${props => props.$selected ? 'white' : '#1976d2'};
    transform: translateY(-2px);
  }
`;

const SelectedInfo = styled.div`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 12px;
  padding: 16px;
  margin-top: 24px;
  text-align: center;
  display: ${props => props.$show ? 'block' : 'none'};
`;

const SelectedText = styled.div`
  color: #0369a1;
  font-size: 14px;
  font-weight: 500;
`;

const ConfirmButton = styled.button`
  width: 100%;
  background: ${props => props.disabled ? '#d1d5db' : '#80c7bc'};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 32px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;

  &:hover {
    background: ${props => props.disabled ? '#d1d5db' : '#5fa89e'};
  }
`;

// 천안시 지역 데이터
const CHEONAN_LOCATIONS = {
    seobuk: {
        title: "서북구",
        badge: "읍·동",
        locations: [
            "성환읍", "성거읍", "직산읍", "입장면",
            "성정1동", "성정2동", "쌍용1동", "쌍용2동", "쌍용3동",
            "백석동", "불당동", "부성1동", "부성2동"
        ]
    },
    dongnam: {
        title: "동남구",
        badge: "면·동",
        locations: [
            "목천면", "풍세면", "광덕면", "북면", "성남면", "수신면", "병천면", "동면",
            "중앙동", "문성동", "원성1동", "원성2동", "봉명동", "일봉동",
            "신방동", "청룡동", "신안동"
        ]
    }
};

const LocationSearchModal = ({ isOpen, onClose, onLocationSelect }) => {
    const [selectedLocation, setSelectedLocation] = useState(null);

    if (!isOpen) return null;

    const handleLocationClick = (location) => {
        setSelectedLocation(location);
    };

    const handleConfirm = () => {
        if (selectedLocation) {
            onLocationSelect(selectedLocation);
            onClose();
            setSelectedLocation(null);
        }
    };

    const handleClose = () => {
        onClose();
        setSelectedLocation(null);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    return (
        <ModalOverlay onClick={handleOverlayClick}>
            <ModalContainer>
                <Header>
                    <BackButton onClick={handleClose}>
                        <FiArrowLeft />
                    </BackButton>
                    <HeaderTitle>활동 지역 선택</HeaderTitle>
                </Header>

                <Content>
                    {/* 서북구 */}
                    <Section>
                        <SectionTitle>
                            {CHEONAN_LOCATIONS.seobuk.title}
                            <SectionBadge>{CHEONAN_LOCATIONS.seobuk.badge}</SectionBadge>
                        </SectionTitle>
                        <LocationGrid>
                            {CHEONAN_LOCATIONS.seobuk.locations.map((location) => (
                                <LocationButton
                                    key={location}
                                    $selected={selectedLocation === location}
                                    onClick={() => handleLocationClick(location)}
                                >
                                    {location}
                                </LocationButton>
                            ))}
                        </LocationGrid>
                    </Section>

                    {/* 동남구 */}
                    <Section>
                        <SectionTitle>
                            {CHEONAN_LOCATIONS.dongnam.title}
                            <SectionBadge>{CHEONAN_LOCATIONS.dongnam.badge}</SectionBadge>
                        </SectionTitle>
                        <LocationGrid>
                            {CHEONAN_LOCATIONS.dongnam.locations.map((location) => (
                                <LocationButton
                                    key={location}
                                    $selected={selectedLocation === location}
                                    onClick={() => handleLocationClick(location)}
                                >
                                    {location}
                                </LocationButton>
                            ))}
                        </LocationGrid>
                    </Section>

                    <SelectedInfo $show={selectedLocation !== null}>
                        <SelectedText>
                            선택된 지역: {selectedLocation}
                        </SelectedText>
                    </SelectedInfo>

                    <ConfirmButton
                        onClick={handleConfirm}
                        disabled={!selectedLocation}
                    >
                        선택 완료
                    </ConfirmButton>
                </Content>
            </ModalContainer>
        </ModalOverlay>
    );
};

export default LocationSearchModal;