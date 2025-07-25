import React, {useState, useRef, useEffect, useCallback, useMemo} from "react";
import styled from "styled-components";
import {getLocationKorean} from "../../../utils/locationUtils";
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
                                meetingStatus,
                                // 메뉴 액션 핸들러들
                                onEdit,
                                onManageMembers,
                                onDelete,
                                onLeave,
                                onCancelApplication
                            }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

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

    // 메뉴 표시 여부 결정 (가입하지 않은 모임에서는 메뉴 숨김)
    const shouldShowMenu = useMemo(() => meetingStatus !== 'available', [meetingStatus]);

    // 메뉴 아이템 결정 (최적화: useMemo 사용)
    const menuItems = useMemo(() => {
        if (!meeting) return [];

        if (meeting.isHost) {
            // 호스트인 경우
            return [
                {
                    key: 'edit',
                    label: '수정하기',
                    icon: '✏️',
                    action: 'edit'
                },
                {
                    key: 'members',
                    label: '멤버 관리',
                    icon: '👥',
                    action: 'members'
                },
                {
                    key: 'delete',
                    label: '삭제하기',
                    icon: '🗑️',
                    action: 'delete',
                    danger: true
                }
            ];
        } else if (meetingStatus === 'joined') {
            // 참여중인 게스트인 경우
            return [
                {
                    key: 'leave',
                    label: '나가기',
                    icon: '🚪',
                    action: 'leave',
                    danger: true
                }
            ];
        } else if (meetingStatus === 'pending') {
            // 승인 대기 중인 경우
            return [
                {
                    key: 'cancel',
                    label: '신청 취소하기',
                    icon: '❌',
                    action: 'cancel',
                    danger: true
                }
            ];
        }
        return [];
    }, [meeting?.isHost, meetingStatus]);

    // 상태에 따른 버튼 텍스트와 비활성화 상태 결정 (최적화: useMemo 사용)
    const buttonConfig = useMemo(() => {
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
    }, [meetingStatus, actionButtonText, isActionDisabled]);

    // 핸들러들 최적화 (useCallback 사용)
    const handleOverlayClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    const handleActionClick = useCallback(() => {
        if (!isActionDisabled) {
            onAction?.(meeting.meetingId);
        }
    }, [isActionDisabled, onAction, meeting?.meetingId]);

    const handleImageError = useCallback((e) => {
        e.target.src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80";
    }, []);

    const handleMenuClick = useCallback((e) => {
        e.stopPropagation();
        setShowDropdown(prev => !prev);
    }, []);

    const handleMenuAction = useCallback((action) => {
        setShowDropdown(false);

        const actionMap = {
            edit: onEdit,
            members: onManageMembers,
            delete: onDelete,
            leave: onLeave,
            cancel: onCancelApplication
        };

        const handler = actionMap[action];
        if (handler && meeting?.meetingId) {
            handler(meeting.meetingId);
        }
    }, [meeting?.meetingId, onEdit, onManageMembers, onDelete, onLeave, onCancelApplication]);

    if (!isOpen || !meeting) return null;

    return (
        <ModalOverlay onClick={handleOverlayClick}>
            <ModalContainer>
                <ModalContent>
                    <MeetingHeader>
                        <MeetingImage
                            src={meeting.image_url || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"}
                            alt={meeting.title}
                            onError={handleImageError}
                        />
                        <MeetingInfo>
                            <HostInfo>
                                {meeting.isHost && <CrownIcon src="/UI/crown.svg" alt="모임장"/>}
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
                        </MeetingInfo>

                        {/* 메뉴 버튼 - 가입하지 않은 모임에서는 숨김 */}
                        {shouldShowMenu && (
                            <div ref={dropdownRef} style={{position: 'relative'}}>
                                <MenuButton onClick={handleMenuClick}>
                                    ⋯
                                </MenuButton>

                                {showDropdown && (
                                    <DropdownMenu>
                                        {menuItems.map((item) => (
                                            <DropdownItem
                                                key={item.key}
                                                danger={item.danger}
                                                onClick={() => handleMenuAction(item.action)}
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
                        <DescriptionSection>
                            <SectionTitle>소개글</SectionTitle>
                            <DescriptionContent>{meeting.description}</DescriptionContent>
                        </DescriptionSection>

                        {meeting.rules && meeting.rules.length > 0 && (
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

                    <ActionButton
                        onClick={handleActionClick}
                        disabled={buttonConfig.disabled}
                    >
                        {buttonConfig.text}
                    </ActionButton>
                </ModalContent>
            </ModalContainer>
        </ModalOverlay>
    );
};

export default MeetingDetailModal;