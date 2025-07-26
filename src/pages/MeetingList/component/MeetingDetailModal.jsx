import React, {useState, useRef, useEffect, useCallback, useMemo} from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {getLocationKorean} from "../../../utils/locationUtils";
import TagBadge from "../../../components/TagBadge";
import { meetingApi } from "../../../services/meetingApi";

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
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [detailData, setDetailData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const dropdownRef = useRef(null);

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

    // 현재 표시할 모임 데이터
    const currentMeeting = detailData || meeting;

    // 메뉴 표시 여부 결정
    const shouldShowMenu = useMemo(() => {
        return currentMeeting?.isHost || meetingStatus === 'joined' || meetingStatus === 'pending';
    }, [currentMeeting?.isHost, meetingStatus]);

    // 메뉴 아이템 결정
    const menuItems = useMemo(() => {
        if (!currentMeeting) return [];

        if (currentMeeting.isHost) {
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
    }, [currentMeeting?.isHost, meetingStatus]);

    // 상태에 따른 버튼 설정
    const buttonConfig = useMemo(() => {
        if (currentMeeting?.isHost) {
            return {
                text: '오픈채팅 참가하기',
                disabled: false,
                action: 'openChat'
            };
        } else if (meetingStatus === 'joined') {
            return {
                text: '오픈채팅 참가하기',
                disabled: false,
                action: 'openChat'
            };
        } else if (meetingStatus === 'pending') {
            return {
                text: '승인 대기 중이에요',
                disabled: true,
                action: 'none'
            };
        } else {
            return {
                text: '가입 신청하기',
                disabled: false,
                action: 'join'
            };
        }
    }, [currentMeeting?.isHost, meetingStatus]);

    // 가입 신청 처리
    const handleJoinMeeting = async () => {
        if (!currentMeeting?.meetingId) return;

        try {
            setActionLoading(true);
            const response = await meetingApi.joinMeeting(currentMeeting.meetingId);
            console.log('가입 신청 응답:', response);

            alert('가입 신청이 완료되었습니다!');
            onClose();

            if (onRefresh) {
                onRefresh();
            }
        } catch (error) {
            console.error('가입 신청 실패:', error);
            alert(error.message || '가입 신청에 실패했습니다.');
        } finally {
            setActionLoading(false);
        }
    };

    // 오픈채팅 참가
    const handleOpenChat = () => {
        if (currentMeeting?.openChatUrl) {
            window.open(currentMeeting.openChatUrl, '_blank');
        } else {
            alert('오픈채팅 링크가 없습니다.');
        }
    };

    // 모임 수정 - CreateMeetingPage 재활용
    const handleEditMeeting = () => {
        setShowDropdown(false);
        onClose();

        // 상세 정보가 있으면 그걸 사용, 없으면 기본 meeting 정보 사용
        const editData = detailData || currentMeeting;

        console.log('🔧 수정하기 - 전달할 데이터:', editData);

        // 쿼리 파라미터로 수정 모드와 모임 데이터 전달
        const editParams = new URLSearchParams({
            mode: 'edit',
            meetingId: editData.meetingId
        });

        navigate(`/create-meeting?${editParams.toString()}`, {
            state: {
                editMode: true,
                meetingData: editData
            }
        });
    };

    // 멤버 관리
    const handleManageMembers = () => {
        console.log(`모임 ${currentMeeting.meetingId} 멤버 관리`);
        setShowDropdown(false);
        onClose();
        navigate(`/meetings/${currentMeeting.meetingId}/members`);
    };

    // 모임 삭제
    const handleDeleteMeeting = async () => {
        if (!currentMeeting?.meetingId) return;

        const confirmMessage = `정말로 "${currentMeeting.title}" 모임을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`;

        if (window.confirm(confirmMessage)) {
            try {
                setActionLoading(true);
                await meetingApi.deleteMeeting(currentMeeting.meetingId);

                alert('모임이 성공적으로 삭제되었습니다.');
                setShowDropdown(false);
                onClose();

                // 모임 리스트 페이지로 이동
                navigate('/meetings');

                if (onRefresh) {
                    onRefresh();
                }
            } catch (error) {
                console.error('모임 삭제 실패:', error);

                // 에러 메시지 세분화
                let errorMessage = '모임 삭제에 실패했습니다.';
                if (error.message.includes('권한')) {
                    errorMessage = '모임을 삭제할 권한이 없습니다.';
                } else if (error.message.includes('찾을 수 없습니다')) {
                    errorMessage = '삭제하려는 모임을 찾을 수 없습니다.';
                } else if (error.message.includes('네트워크')) {
                    errorMessage = '네트워크 오류가 발생했습니다. 다시 시도해주세요.';
                }

                alert(errorMessage);
            } finally {
                setActionLoading(false);
            }
        }
    };

    // 모임 나가기
    const handleLeaveMeeting = () => {
        if (!currentMeeting?.meetingId) return;

        const confirmMessage = `정말로 "${currentMeeting.title}" 모임에서 나가시겠습니까?`;

        if (window.confirm(confirmMessage)) {
            console.log(`모임 ${currentMeeting.meetingId} 나가기`);
            alert('모임 나가기 기능은 준비 중입니다.');
            setShowDropdown(false);
            onClose();
        }
    };

    // 가입 신청 취소
    const handleCancelApplication = () => {
        if (!currentMeeting?.meetingId) return;

        const confirmMessage = `정말로 "${currentMeeting.title}" 모임 신청을 취소하시겠습니까?`;

        if (window.confirm(confirmMessage)) {
            console.log(`모임 ${currentMeeting.meetingId} 신청 취소`);
            alert('신청 취소 기능은 준비 중입니다.');
            setShowDropdown(false);
            onClose();
        }
    };

    // 메인 액션 버튼 클릭 핸들러
    const handleActionClick = useCallback(() => {
        if (actionLoading) return;

        switch (buttonConfig.action) {
            case 'join':
                handleJoinMeeting();
                break;
            case 'openChat':
                handleOpenChat();
                break;
            default:
                break;
        }
    }, [buttonConfig.action, actionLoading]);

    // 메뉴 액션 처리
    const handleMenuAction = useCallback((action) => {
        const actionMap = {
            edit: handleEditMeeting,
            members: handleManageMembers,
            delete: handleDeleteMeeting,
            leave: handleLeaveMeeting,
            cancel: handleCancelApplication
        };

        const handler = actionMap[action];
        if (handler) {
            handler();
        }
    }, [currentMeeting]);

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
                                                onClick={() => handleMenuAction(item.action)}
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
                        onClick={handleActionClick}
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