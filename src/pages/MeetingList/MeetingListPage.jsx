import React, { useState, useEffect } from "react";
import styled from "styled-components";
// import { meetingApi } from "../../api/meetingApi";
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

// 확장된 더미 데이터 (상세 정보 포함)
const DUMMY_MEETINGS = [
    {
        meetingId: 1,
        title: "30대 초반 맛집 투어 모임",
        description: "30대 환영 ~ 인스타 맛집 다니고 싶으신 분들 어쩌고 저쩌고 우오아아아아아아",
        location: "SEONGJEONG1",
        schedule: "ALL",
        image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
        isHost: true,
        hostName: "김방장",
        detailedDescription: `진짜 30대 환영 !!!
벌써에 돼지코와 맛집으로 저녁 먹어봐 다니실 분 구
해요 ㅋㅋ 맛집 잘 아시는 분 환영 ~

주로 성정동에서 활동하고, 이야 동네도 좋습니다!
오래 활동하실 분 오셨으면 좋겠어요
방 인원 10명으로 제한해주겠습니다
엄격 들어와주세요 !!!`,
        rules: [
            "반말하지 않기",
            "노쇼하지 않기",
            "부정적으로 얘기하지 않기"
        ]
    },
    {
        meetingId: 2,
        title: "신불당 보드게임 카페 다녀요",
        description: "보드게임 좋아하시는 분 주말에 모여서 저랑 놀고 어쩌고 저쩌고",
        location: "SEONGJEONG1",
        schedule: "WEEKDAY",
        image_url: "https://www.ekn.kr/mnt/file/202412/20241223001203509_1.png",
        isHost: false,
        hostName: "보드마스터",
        detailedDescription: `보드게임 좋아하시는 분들과 함께 즐거운 시간 보내요!
신불당 근처 보드게임 카페에서 만나서 
다양한 게임을 해보며 친목을 도모해요.

초보자도 환영하며, 게임 룰 설명해드립니다.
매주 평일 저녁에 모임 진행합니다.`,
        rules: [
            "게임 룰 준수하기",
            "서로 배려하며 게임하기",
            "시간 약속 지키기"
        ]
    },
    {
        meetingId: 3,
        title: "분위기 좋은 카페 다니실 분 ~",
        description: "분좋카 많이 아시는 분 환영 들어오세 어쩌고 저쩌고 우오아아아아아아",
        location: "SEONGJEONG1",
        schedule: "WEEKEND",
        image_url: "https://img.kr.gcp-karroter.net/community/community/20240824/14c3cfff-9a94-45d5-a578-d0ddf80ee338.jpeg?q=95&s=1200x630&t=cover",
        isHost: false,
        hostName: "카페러버",
        detailedDescription: `분위기 좋은 카페를 찾아다니는 모임입니다.
인스타그램에서 화제가 된 카페들을 중심으로
주말마다 새로운 곳을 탐방해요.

사진 찍기 좋아하시는 분들 환영!
같이 예쁜 사진도 찍고 맛있는 디저트도 먹어요.`,
        rules: [
            "사진 촬영 시 다른 손님 배려하기",
            "카페 매너 지키기",
            "개인 취향 존중하기"
        ]
    }
];

const DUMMY_MY_MEETINGS = [
    {
        meetingId: 4,
        title: "30대 초반 맛집 투어 모임",
        description: "보드게임 좋아하시는 분 주말에 모여서 저랑 놀고 어쩌고 저쩌고",
        location: "SEONGJEONG1",
        schedule: "WEEKEND",
        image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
        isHost: true,
        hostName: "김방장",
        status: "JOINED",
        detailedDescription: `내가 만든 맛집 투어 모임입니다.
함께 맛있는 음식을 먹으며 즐거운 시간을 보내요!`,
        rules: [
            "반말하지 않기",
            "노쇼하지 않기",
            "부정적으로 얘기하지 않기"
        ]
    },
    {
        meetingId: 5,
        title: "독서 모임",
        description: "책 읽고 토론하는 모임입니다",
        location: "SEONGJEONG1",
        schedule: "ALL",
        image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
        isHost: false,
        hostName: "책벌레",
        status: "JOINED",
        detailedDescription: `매주 책을 읽고 함께 토론하는 모임입니다.
다양한 장르의 책을 읽으며 견문을 넓혀요.`,
        rules: [
            "책 읽고 참여하기",
            "다른 의견 존중하기"
        ]
    },
    {
        meetingId: 6,
        title: "등산 모임",
        description: "주말 등산 함께 해요",
        location: "SEONGJEONG1",
        schedule: "WEEKDAY",
        image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
        isHost: false,
        hostName: "산악인",
        status: "PENDING",
        detailedDescription: `주말마다 근교 산을 오르는 등산 모임입니다.
초보자도 환영하며, 안전한 등산을 위해 준비물을 꼼꼼히 챙겨주세요.`,
        rules: [
            "안전 수칙 준수하기",
            "쓰레기 되가져가기",
            "체력에 맞는 코스 선택하기"
        ]
    }
];

const MeetingListPage = () => {
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

            console.log('모임 리스트 조회 (더미 데이터 사용)');

            // 실제 API 호출 대신 더미 데이터 사용
            // const response = await meetingApi.getMeetings();

            // 로딩 시뮬레이션
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 더미 데이터 설정
            setMeetings(DUMMY_MEETINGS);
            setMyMeetings(DUMMY_MY_MEETINGS);

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

            {/* 모임 상세 모달 */}
            <MeetingDetailModal
                meeting={selectedMeeting}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAction={handleModalAction}
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