import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import { meetingApi } from "../../services/meetingApi";
import MeetingCard from "./component/MeetingCard";
import MeetingDetailModal from "./component/MeetingDetailModal";

const MOBILE_MAX_WIDTH = 430;

// 전체 페이지 컨테이너
const PageContainer = styled.div`
    max-width: ${MOBILE_MAX_WIDTH}px;
    margin: 0 auto;
    background: #fff;
    min-height: 100vh;
`;

// 상단 헤더 (모임 제목)
const PageHeader = styled.div`
    background: #fff;
    padding: 50px 20px 0 20px;
`;

// 메인 탭 (모임 / 내 모임)
const MainTabContainer = styled.div`
    display: flex;
    background: #fff;
    padding: 0 20px;
    margin-bottom: 10px;
    position: relative;
`;

const MainTab = styled.div`
    flex: 1;
    text-align: center;
    padding: 12px 0;
    font-size: 16px;
    font-weight: ${props => props.active ? '600' : '500'};
    color: ${props => props.active ? '#111827' : '#9ca3af'};
    cursor: pointer;
    position: relative;
    user-select: none;

    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: ${props => props.active ? '#111827' : 'transparent'};
        transition: all 0.3s ease;
    }
`;

// 서브 탭 (참여중 / 승인 대기 중) - 내 모임일 때만 표시
const SubTabContainer = styled.div`
    display: flex;
    background: #fff;
    margin-bottom: 5px;
`;

const SubTab = styled.button`
    padding: 12px 16px;
    background: ${props => props.active ? '#494E4D' : 'transparent'};
    border: none;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.active ? '#fff' : '#666'};
    cursor: pointer;
    transition: all 0.2s;
    margin-right: 8px;

    &:hover {
        background: ${props => props.active ? '#494E4D' : '#f5f5f5'};
    }
`;

// 모임 리스트 컨테이너
const MeetingList = styled.div`
    background: #fff;
    margin-top: 20px;
    padding-bottom: 100px; /* 하단 탭바 공간 확보 */
`;

// 로딩/에러/빈 상태 컨테이너들
const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 60px 20px;
    color: #6b7280;
    font-size: 14px;
    background: #fff;
`;

const ErrorContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 60px 20px;
    color: #ef4444;
    font-size: 14px;
    text-align: center;
    background: #fff;
`;

const RetryButton = styled.button`
    background: #4ECDC4;
    color: #fff;
    border: none;
    border-radius: 12px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
    margin-top: 16px;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background: #3bb5ad;
    }
`;

const EmptyContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 80px 20px;
    color: #6b7280;
    font-size: 14px;
    text-align: center;
    background: #fff;
`;

const MeetingListPage = () => {
    const navigate = useNavigate();
    const [mainTab, setMainTab] = useState('meetings'); // 'meetings' or 'myMeetings'
    const [subTab, setSubTab] = useState('joined'); // 'joined' or 'pending'
    const [meetings, setMeetings] = useState([]);
    const [myMeetings, setMyMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [swipedCard, setSwipedCard] = useState(null);

    // 모달 상태
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 모임 데이터 불러오기
    const fetchMeetings = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('모임 리스트 조회 시작');
            const response = await meetingApi.getMeetings();
            console.log('API 응답:', response);

            // 스웨거 응답 구조: { timestamp, message, data: [...] }
            const meetings = response.data || [];
            setMeetings(meetings);
            setMyMeetings([]); // 내 모임은 별도 API라서 일단 빈 배열

        } catch (err) {
            console.error('모임 리스트 조회 실패:', err);
            setError(err.message || '모임 리스트를 불러오는데 실패했습니다.');
            setMeetings([]);
            setMyMeetings([]);
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트 마운트 시 데이터 로드
    useEffect(() => {
        fetchMeetings();
    }, []);

    // 현재 표시할 모임 리스트 결정
    const getCurrentMeetings = () => {
        if (mainTab === 'meetings') {
            return meetings;
        } else {
            return myMeetings.filter(meeting =>
                subTab === 'joined' ? meeting.status === 'JOINED' : meeting.status === 'PENDING'
            );
        }
    };

    // 모임 카드 클릭 핸들러
    const handleMeetingClick = (meetingId) => {
        if (mainTab === 'myMeetings') {
            // 내 모임에서는 스와이프 기능
            handleSwipe(meetingId);
        } else {
            // 모임 리스트에서는 카드 클릭 시 아무 동작 안 함
            // 자세히 버튼으로만 모달 열기
            console.log(`모임 ${meetingId} 카드 클릭 (모달 열지 않음)`);
        }
    };

    // 자세히 버튼 클릭 핸들러
    const handleViewMeeting = (meetingId) => {
        console.log(`모임 ${meetingId} 자세히`);

        if (mainTab === 'meetings') {
            // 모임 리스트에서는 상세 모달 열기
            const meeting = meetings.find(m => m.meetingId === meetingId);
            if (meeting) {
                setSelectedMeeting(meeting);
                setIsModalOpen(true);
            }
        } else {
            // 내 모임에서도 상세 모달 열기
            const meeting = myMeetings.find(m => m.meetingId === meetingId);
            if (meeting) {
                setSelectedMeeting(meeting);
                setIsModalOpen(true);
            }
        }
    };

    // 모달 액션 버튼 클릭 핸들러
    const handleModalAction = (meetingId) => {
        console.log(`모임 ${meetingId} 가입 신청`);
        alert(`모임 ${meetingId}에 가입 신청하시겠습니까?`);
        setIsModalOpen(false);
    };

    // 모달 닫기 핸들러
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMeeting(null);
    };

    // 스와이프 핸들러
    const handleSwipe = (meetingId) => {
        setSwipedCard(swipedCard === meetingId ? null : meetingId);
    };

    // 나가기 버튼 클릭 핸들러
    const handleLeaveMeeting = (meetingId) => {
        console.log(`모임 ${meetingId} 나가기`);
        alert(`모임 ${meetingId}에서 나가시겠습니까?`);
        setSwipedCard(null);
    };

    // 멤버 관리 핸들러 - 새로 추가된 부분
    const handleManageMembers = (meetingId) => {
        console.log(`모임 ${meetingId} 멤버 관리`);
        navigate(`/meetings/${meetingId}/members`);
        setIsModalOpen(false); // 모달 닫기
    };

    // 모임 수정 핸들러
    const handleEditMeeting = (meetingId) => {
        console.log(`모임 ${meetingId} 수정`);
        alert(`모임 ${meetingId} 수정 기능은 준비 중입니다.`);
        setIsModalOpen(false);
    };

    // 모임 삭제 핸들러
    const handleDeleteMeeting = (meetingId) => {
        console.log(`모임 ${meetingId} 삭제`);
        if (window.confirm(`정말로 모임 ${meetingId}을(를) 삭제하시겠습니까?`)) {
            alert(`모임 ${meetingId}이(가) 삭제되었습니다.`);
            setIsModalOpen(false);
        }
    };

    // 모임 나가기 핸들러
    const handleLeaveFromModal = (meetingId) => {
        console.log(`모임 ${meetingId} 나가기`);
        if (window.confirm(`정말로 모임 ${meetingId}에서 나가시겠습니까?`)) {
            alert(`모임 ${meetingId}에서 나가셨습니다.`);
            setIsModalOpen(false);
        }
    };

    // 신청 취소 핸들러
    const handleCancelApplication = (meetingId) => {
        console.log(`모임 ${meetingId} 신청 취소`);
        if (window.confirm(`정말로 모임 ${meetingId} 신청을 취소하시겠습니까?`)) {
            alert(`모임 ${meetingId} 신청이 취소되었습니다.`);
            setIsModalOpen(false);
        }
    };

    // 재시도 핸들러
    const handleRetry = () => {
        fetchMeetings();
    };

    // 로딩 상태
    if (loading) {
        return (
            <PageContainer>
                <PageHeader>
                    <MainTabContainer>
                        <MainTab active={true}>모임</MainTab>
                        <MainTab active={false}>내 모임</MainTab>
                    </MainTabContainer>
                </PageHeader>
                <LoadingContainer>
                    모임 리스트를 불러오고 있습니다...
                </LoadingContainer>
            </PageContainer>
        );
    }

    // 에러 상태
    if (error) {
        return (
            <PageContainer>
                <PageHeader>
                    <MainTabContainer>
                        <MainTab active={true}>모임</MainTab>
                        <MainTab active={false}>내 모임</MainTab>
                    </MainTabContainer>
                </PageHeader>
                <ErrorContainer>
                    <div>{error}</div>
                    <RetryButton onClick={handleRetry}>
                        다시 시도
                    </RetryButton>
                </ErrorContainer>
            </PageContainer>
        );
    }

    const currentMeetings = getCurrentMeetings();

    // 빈 상태
    if (currentMeetings.length === 0) {
        return (
            <PageContainer>
                <PageHeader>
                    <MainTabContainer>
                        <MainTab
                            active={mainTab === 'meetings'}
                            onClick={() => setMainTab('meetings')}
                        >
                            모임
                        </MainTab>
                        <MainTab
                            active={mainTab === 'myMeetings'}
                            onClick={() => setMainTab('myMeetings')}
                        >
                            내 모임
                        </MainTab>
                    </MainTabContainer>

                    {mainTab === 'myMeetings' && (
                        <SubTabContainer>
                            <SubTab
                                active={subTab === 'joined'}
                                onClick={() => setSubTab('joined')}
                            >
                                참여중
                            </SubTab>
                            <SubTab
                                active={subTab === 'pending'}
                                onClick={() => setSubTab('pending')}
                            >
                                승인 대기 중
                            </SubTab>
                        </SubTabContainer>
                    )}
                </PageHeader>
                <EmptyContainer>
                    <div>등록된 모임이 없습니다.</div>
                    <div>새로운 모임을 만들어보세요!</div>
                </EmptyContainer>
            </PageContainer>
        );
    }

    // 메인 렌더링
    return (
        <PageContainer>
            <PageHeader>
                <MainTabContainer>
                    <MainTab
                        active={mainTab === 'meetings'}
                        onClick={() => setMainTab('meetings')}
                    >
                        모임
                    </MainTab>
                    <MainTab
                        active={mainTab === 'myMeetings'}
                        onClick={() => setMainTab('myMeetings')}
                    >
                        내 모임
                    </MainTab>
                </MainTabContainer>

                {mainTab === 'myMeetings' && (
                    <SubTabContainer>
                        <SubTab
                            active={subTab === 'joined'}
                            onClick={() => setSubTab('joined')}
                        >
                            참여중
                        </SubTab>
                        <SubTab
                            active={subTab === 'pending'}
                            onClick={() => setSubTab('pending')}
                        >
                            승인 대기 중
                        </SubTab>
                    </SubTabContainer>
                )}
            </PageHeader>

            <MeetingList>
                {currentMeetings.map((meeting) => (
                    <MeetingCard
                        key={meeting.meetingId}
                        meeting={meeting}
                        onCardClick={handleMeetingClick}
                        onActionClick={handleViewMeeting}
                        onLeaveClick={handleLeaveMeeting}
                        showSwipeAction={mainTab === 'myMeetings'}
                        swiped={swipedCard === meeting.meetingId}
                        actionButtonText={
                            mainTab === 'myMeetings' && subTab === 'pending'
                                ? '대기중'
                                : '자세히'
                        }
                    />
                ))}
            </MeetingList>

            {/* 모임 상세 모달 - 새로 추가된 핸들러들 포함 */}
            <MeetingDetailModal
                meeting={selectedMeeting}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAction={handleModalAction}
                onEdit={handleEditMeeting}
                onManageMembers={handleManageMembers}
                onDelete={handleDeleteMeeting}
                onLeave={handleLeaveFromModal}
                onCancelApplication={handleCancelApplication}
                meetingStatus={
                    mainTab === 'myMeetings'
                        ? (subTab === 'joined' ? 'joined' : 'pending')
                        : 'available'
                }
            />
        </PageContainer>
    );
};

export default MeetingListPage;