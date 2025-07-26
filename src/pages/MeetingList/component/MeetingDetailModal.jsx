import React, {useState, useRef, useEffect, useMemo} from "react";
import styled from "styled-components";
import {getLocationKorean} from "../../../utils/locationUtils";
import TagBadge from "../../../components/TagBadge";
import { meetingApi } from "../../../services/meetingApi";
import { useMeetingModalHandlers } from "./useMeetingModalHandlers";

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
    max-width: 380px;
    height: 70vh;
    min-height: 500px;
    overflow: hidden;
    position: relative;
`;

const ModalContent = styled.div`
    padding: 24px;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const MeetingHeader = styled.div`
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
    margin-top: 5px;
    position: relative;
`;

const MenuButton = styled.button`
    position: absolute;
    top: -5px;
    right: 0;
    background: none;
    border: none;
    font-size: 20px;
    color: #666;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &:hover {
        background: #f5f5f5;
        color: #333;
    }

    &:active {
        transform: scale(0.95);
    }
`;

const DropdownMenu = styled.div`
    position: absolute;
    top: 35px;
    right: 0;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    min-width: 135px;
    z-index: 1001;
    animation: dropdownSlideIn 0.1s ease-out;

    @keyframes dropdownSlideIn {
        from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
`;

const DropdownItem = styled.button`
    width: 100%;
    background: none;
    border: none;
    box-shadow: none;
    padding: 12px 16px;
    text-align: left;
    font-size: 13px;
    font-weight: 450;
    color: ${props => props.danger ? '#ef4444' : '#374151'};
    cursor: pointer;
    transition: background 0.15s;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 8px;

    &:last-child {
        margin-bottom: 0;
    }

    &:hover {
        background: ${props => props.danger ? '#fef2f2' : '#f9fafb'};
    }

    &:active {
        background: ${props => props.danger ? '#fee2e2' : '#f3f4f6'};
    }
`;

const MeetingImage = styled.img`
    width: 73px;
    height: 73px;
    border-radius: 12px;
    object-fit: cover;
    flex-shrink: 0;
`;

const MeetingInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
`;

const HostInfo = styled.div`
    font-size: 13px;
    color: #666;
    display: flex;
    align-items: center;
`;

const CrownIcon = styled.img`
    width: 16px;
    height: 16px;
    margin-right: 6px;
`;

const MeetingTitle = styled.h2`
    font-size: 17px;
    font-weight: 700;
    color: #181818;
    margin: 0;
    line-height: 1.3;
`;

const TagContainer = styled.div`
    display: flex;
    gap: 0;
    align-items: center;
`;

const ContentWrapper = styled.div`
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 24px;
    flex: 1;
    overflow-y: auto;
    min-height: 0;
`;

const SectionTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: #181818;
    margin: 0 0 12px 0;
`;

const DescriptionSection = styled.div`
    margin-bottom: 20px;

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

const ActionButton = styled.button`
    width: 100%;
    background: ${props => props.disabled ? '#9CA3AF' : '#80C7BC'};
    color: #fff;
    border: none;
    border-radius: 16px;
    font-size: 16px;
    font-weight: 600;
    padding: 16px;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    transition: all 0.2s;

    &:hover {
        background: ${props => props.disabled ? '#9CA3AF' : '#6BB8B0'};
    }

    &:active {
        transform: ${props => props.disabled ? 'none' : 'scale(0.98)'};
    }
`;

const LoadingSpinner = styled.div`
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 8px;

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

// 스케줄을 한글로 변환하는 함수
const getScheduleKorean = (schedule) => {
    const scheduleMap = {
        'WEEKDAY': '평일',
        'WEEKEND': '주말',
        'FULL': '전체'
    };
    return scheduleMap[schedule] || schedule;
};

// 스케줄에 따른 TagBadge 타입 결정
const getScheduleTagType = (schedule) => {
    const typeMap = {
        'WEEKDAY': 'weekday',
        'WEEKEND': 'weekend',
        'FULL': 'all'
    };
    return typeMap[schedule] || 'all';
};

const MeetingDetailModal = ({
                                meeting,
                                isOpen,
                                onClose,
                                onRefresh,
                                meetingStatus = 'available'
                            }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [detailData, setDetailData] = useState(null);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    // 현재 표시할 모임 데이터
    const currentMeeting = detailData || meeting;

    // 커스텀 훅으로 분리된 핸들러들
    const {
        actionLoading,
        handleActionClick,
        handleMenuAction
    } = useMeetingModalHandlers(currentMeeting, onClose, onRefresh);

    // 모임 상세 정보 불러오기
    const fetchMeetingDetail = async () => {
        if (!meeting?.meetingId) return;

        try {
            setLoading(true);
            const response = await meetingApi.getMeetingDetail(meeting.meetingId);
            console.log('모임 상세 정보:', response);
            setDetailData(response.data);
        } catch (error) {
            console.error('모임 상세 정보 조회 실패:', error);
            setDetailData(meeting);
        } finally {
            setLoading(false);
        }
    };

    // 모달 열릴 때 상세 정보 조회
    useEffect(() => {
        if (isOpen && meeting?.meetingId) {
            fetchMeetingDetail();
        }
    }, [isOpen, meeting?.meetingId]);

    // 드롭다운 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    // 메뉴 표시 여부 결정
    const shouldShowMenu = useMemo(() => {
        return currentMeeting?.isHost || meetingStatus === 'joined' || meetingStatus === 'pending';
    }, [currentMeeting?.isHost, meetingStatus]);

    // 메뉴 아이템 결정
    const menuItems = useMemo(() => {
        if (!currentMeeting) return [];

        if (currentMeeting.isHost) {
            return [
                { key: 'edit', label: '수정하기', icon: '✏️', action: 'edit' },
                { key: 'members', label: '멤버 관리', icon: '👥', action: 'members' },
                { key: 'delete', label: '삭제하기', icon: '🗑️', action: 'delete', danger: true }
            ];
        } else if (meetingStatus === 'joined') {
            return [
                { key: 'leave', label: '나가기', icon: '🚪', action: 'leave', danger: true }
            ];
        } else if (meetingStatus === 'pending') {
            return [
                { key: 'cancel', label: '신청 취소하기', icon: '❌', action: 'cancel', danger: true }
            ];
        }
        return [];
    }, [currentMeeting?.isHost, meetingStatus]);

    // 상태에 따른 버튼 설정
    const buttonConfig = useMemo(() => {
        console.log('🔧 버튼 설정 계산:', {
            isHost: currentMeeting?.isHost,
            meetingStatus,
            meetingId: currentMeeting?.meetingId
        });

        if (currentMeeting?.isHost) {
            return { text: '오픈채팅 참가하기', disabled: false, action: 'openChat' };
        } else if (meetingStatus === 'joined') {
            return { text: '오픈채팅 참가하기', disabled: false, action: 'openChat' };
        } else if (meetingStatus === 'pending') {
            return { text: '승인 대기 중이에요', disabled: true, action: 'none' };
        } else {
            return { text: '가입 신청하기', disabled: false, action: 'join' };
        }
    }, [currentMeeting?.isHost, meetingStatus]);

    if (!isOpen || !currentMeeting) return null;

    return (
        <ModalOverlay onClick={(e) => e.target === e.currentTarget && onClose()}>
            <ModalContainer>
                <ModalContent>
                    <MeetingHeader>
                        <MeetingImage
                            src={currentMeeting.imageUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"}
                            alt={currentMeeting.title}
                            onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80";
                            }}
                        />
                        <MeetingInfo>
                            <HostInfo>
                                {currentMeeting.isHost && <CrownIcon src="/UI/crown.svg" alt="모임장"/>}
                                @{currentMeeting.hostName || "호스트"}
                            </HostInfo>
                            <MeetingTitle>{currentMeeting.title}</MeetingTitle>
                            <TagContainer>
                                <TagBadge
                                    type="location"
                                    text={getLocationKorean(currentMeeting.location)}
                                />
                                <TagBadge
                                    type={getScheduleTagType(currentMeeting.schedule)}
                                    text={getScheduleKorean(currentMeeting.schedule)}
                                    className="last"
                                />
                            </TagContainer>
                        </MeetingInfo>

                        {/* 메뉴 버튼 */}
                        {shouldShowMenu && (
                            <div ref={dropdownRef} style={{position: 'relative'}}>
                                <MenuButton onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDropdown(prev => !prev);
                                }}>
                                    ⋯
                                </MenuButton>

                                {showDropdown && (
                                    <DropdownMenu>
                                        {menuItems.map((item) => (
                                            <DropdownItem
                                                key={item.key}
                                                danger={item.danger}
                                                onClick={() => {
                                                    setShowDropdown(false);
                                                    onClose();
                                                    handleMenuAction(item.action, detailData);
                                                }}
                                                disabled={actionLoading}
                                            >
                                                <span>{item.icon}</span>
                                                {item.label}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                )}
                            </div>
                        )}
                    </MeetingHeader>

                    <ContentWrapper>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                모임 정보를 불러오는 중...
                            </div>
                        ) : (
                            <DescriptionSection>
                                <SectionTitle>소개글</SectionTitle>
                                <DescriptionContent>{currentMeeting.description}</DescriptionContent>
                            </DescriptionSection>
                        )}
                    </ContentWrapper>

                    <ActionButton
                        onClick={() => handleActionClick(buttonConfig)}
                        disabled={buttonConfig.disabled || actionLoading}
                    >
                        {actionLoading ? (
                            <>
                                <LoadingSpinner />
                                처리 중...
                            </>
                        ) : (
                            buttonConfig.text
                        )}
                    </ActionButton>
                </ModalContent>
            </ModalContainer>
        </ModalOverlay>
    );
};

export default MeetingDetailModal;