const SectionTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: #181818;
    margin: 0 0 12px 0;
`;import React from "react";
import styled from "styled-components";
import { getLocationKorean } from "../../../utils/locationUtils";
import TagBadge from "../../../components/TagBadge";

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
    padding: 20px;
`;

const ModalContainer = styled.div`
    background: #fff;
    border-radius: 20px;
    width: 100%;
    max-width: 400px;
    max-height: 80vh;
    overflow: hidden;
    position: relative;
    animation: modalSlideUp 0.3s ease-out;

    @keyframes modalSlideUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;

const ModalHeader = styled.div`
    position: relative;
    padding: 0;
`;

const MeetingImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(0, 0, 0, 0.5);
    border: none;
    border-radius: 30%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #fff;
    font-size: 18px;
    font-weight: 300;
    z-index: 10;

    &:hover {
        background: rgba(0, 0, 0, 0.7);
    }
`;

const ModalContent = styled.div`
    padding: 24px;
`;

const MeetingTitleSection = styled.div`
    margin-bottom: 20px;
`;

const HostInfo = styled.div`
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
`;

const CrownIcon = styled.img`
    width: 16px;
    height: 16px;
    margin-right: 6px;
`;

const MeetingTitle = styled.h2`
    font-size: 20px;
    font-weight: 700;
    color: #181818;
    margin: 0 0 12px 0;
    line-height: 1.3;
`;

const TagContainer = styled.div`
    display: flex;
    gap: 0;
    align-items: center;
    margin-bottom: 20px;
`;

const ContentWrapper = styled.div`
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 32px;
`;

const DescriptionSection = styled.div`
    margin-bottom: 24px;

    &:last-child {
        margin-bottom: 0;
    }
`;

const DescriptionContent = styled.div`
    font-size: 14px;
    color: #374151;
    line-height: 1.6;
    white-space: pre-wrap;
`;

const RulesList = styled.ul`
    margin: 0;
    padding-left: 20px;

    li {
        font-size: 14px;
        color: #374151;
        line-height: 1.6;
        margin-bottom: 4px;

        &:last-child {
            margin-bottom: 0;
        }
    }
`;

const ActionButtonContainer = styled.div`
    padding: 0;
    margin-top: 8px;
`;

const ActionButton = styled.button`
    width: 100%;
    background: ${props => props.disabled ? '#9CA3AF' : '#80C7BC'};
    color: #fff;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    padding: 16px;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    transition: all 0.2s;

    &:hover {
        background: ${props => props.disabled ? '#9CA3AF' : '#80C7BC'};
    }

    &:active {
        transform: ${props => props.disabled ? 'none' : 'scale(0.98)'};
    }
`;

// 스케줄을 한글로 변환하는 함수
const getScheduleKorean = (schedule) => {
    const scheduleMap = {
        'WEEKDAY': '평일',
        'WEEKEND': '주말',
        'ALL': '전체'
    };
    return scheduleMap[schedule] || schedule;
};

// 스케줄에 따른 TagBadge 타입 결정
const getScheduleTagType = (schedule) => {
    const typeMap = {
        'WEEKDAY': 'weekday',
        'WEEKEND': 'weekend',
        'ALL': 'all'
    };
    return typeMap[schedule] || 'all';
};

const MeetingDetailModal = ({
                                meeting,
                                isOpen,
                                onClose,
                                onAction,
                                actionButtonText,
                                isActionDisabled = false,
                                meetingStatus // 'joined', 'pending', 'available' 등의 상태
                            }) => {
    if (!isOpen || !meeting) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleActionClick = () => {
        if (!isActionDisabled) {
            onAction?.(meeting.meetingId);
        }
    };

    // 이미지 에러 핸들러
    const handleImageError = (e) => {
        e.target.src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80";
    };

    // 상태에 따른 버튼 텍스트와 비활성화 상태 결정
    const getButtonConfig = () => {
        if (meetingStatus === 'joined') {
            return {
                text: '오픈채팅 참가하기',
                disabled: false
            };
        } else if (meetingStatus === 'pending') {
            return {
                text: '승인 대기 중이에요',
                disabled: true
            };
        } else {
            return {
                text: actionButtonText || '가입 신청하기',
                disabled: isActionDisabled
            };
        }
    };

    const buttonConfig = getButtonConfig();

    return (
        <ModalOverlay onClick={handleOverlayClick}>
            <ModalContainer>
                <ModalHeader>
                    <MeetingImage
                        src={meeting.image_url || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"}
                        alt={meeting.title}
                        onError={handleImageError}
                    />
                    <CloseButton onClick={onClose}>
                        ×
                    </CloseButton>
                </ModalHeader>

                <ModalContent>
                    <MeetingTitleSection>
                        <HostInfo>
                            {meeting.isHost && <CrownIcon src="/UI/crown.svg" alt="모임장" />}
                            @{meeting.hostName || "김방장"}
                        </HostInfo>

                        <MeetingTitle>{meeting.title}</MeetingTitle>

                        <TagContainer>
                            <TagBadge
                                type="location"
                                text={getLocationKorean(meeting.location)}
                            />
                            <TagBadge
                                type={getScheduleTagType(meeting.schedule)}
                                text={getScheduleKorean(meeting.schedule)}
                                className="last"
                            />
                        </TagContainer>
                    </MeetingTitleSection>

                    <ContentWrapper>
                        <DescriptionSection>
                            <SectionTitle>소개글</SectionTitle>
                            <DescriptionContent>{meeting.description}</DescriptionContent>
                        </DescriptionSection>

                        {meeting.rules && (
                            <DescriptionSection>
                                <SectionTitle>규칙</SectionTitle>
                                <RulesList>
                                    {meeting.rules.map((rule, index) => (
                                        <li key={index}>{rule}</li>
                                    ))}
                                </RulesList>
                            </DescriptionSection>
                        )}
                    </ContentWrapper>

                    <ActionButtonContainer>
                        <ActionButton
                            onClick={handleActionClick}
                            disabled={buttonConfig.disabled}
                        >
                            {buttonConfig.text}
                        </ActionButton>
                    </ActionButtonContainer>
                </ModalContent>
            </ModalContainer>
        </ModalOverlay>
    );
};

export default MeetingDetailModal;