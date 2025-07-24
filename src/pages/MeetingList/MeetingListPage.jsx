import React, {useState, useEffect} from "react";
import styled from "styled-components";
// import { meetingApi } from "../../api/meetingApi";
import {getLocationKorean} from "../../utils/locationUtils";
import TagBadge from "../../components/TagBadge";

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
    padding-bottom: 10px;
`;

// 개별 모임 카드 컨테이너 (스와이프 기능을 위한 래퍼)
const MeetingCardWrapper = styled.div`
    position: relative;
    overflow: hidden;
    background: #fff;
`;

// 스와이프로 나타나는 삭제 버튼
const SwipeAction = styled.div`
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    background: #fd5662;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    transform: translateX(${props => props.show ? '0' : '100%'});
    transition: transform 0.3s ease;
    z-index: 1;
`;

const LeaveButton = styled.button`
    background: none;
    border: none;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    outline: none;

    &:focus {
        outline: none;
    }

    &:active {
        background: none;
        color: #fff;
    }
`;

// 개별 모임 카드
const MeetingCard = styled.div`
    background: #fff;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    transform: translateX(${props => props.swiped ? '-80px' : '0'});
    position: relative;
    z-index: 2;

    &:hover {
        background: #fafafa;
    }
`;

// 왕관 이모지
const CrownIcon = styled.img`
    width: 20px;
    height: 20px;
    margin-right: 5px;
    margin-bottom: 3px;
    vertical-align: middle;
`;

// 모임 이미지
const MeetingImage = styled.img`
    width: 75px;
    height: 75px;
    border-radius: 14px;
    object-fit: cover;
    background: #f3f4f6;
    flex-shrink: 0;
    position: relative;
`;

// 모임 정보 영역
const MeetingInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
`;

// 모임 제목
const MeetingTitle = styled.div`
    font-size: 16px;
    font-weight: 600;
    color: #181818;
    line-height: 1.3;
    margin-bottom: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

// 모임 설명
const MeetingDescription = styled.div`
    font-size: 13px;
    color: #6b7280;
    line-height: 1.4;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

// 태그 컨테이너
const TagContainer = styled.div`
    display: flex;
    gap: 0;
    align-items: center;
`;

// 자세히 버튼
const ViewButton = styled.button`
    background: #F2F4F4;
    color: #222;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    padding: 8px 18px;
    cursor: pointer;
    transition: all 0.18s;
    flex-shrink: 0;
    box-shadow: 0 1px 4px 0 rgb(0 0 0 / 0.06);

    &:hover {
        background: #e5e7eb;
        box-shadow: 0 2px 8px 0 rgb(0 0 0 / 0.1);
    }

    &:active {
        background: #d1d5db;
        transform: scale(0.98);
    }
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

// 임시 더미 데이터 (API 응답 구조에 맞춤)
const DUMMY_MEETINGS = [
    {
        meetingId: 1,
        title: "30대 초반 맛집 투어 모임",
        description: "30대 환영 ~ 인스타 맛집 다니고 싶으신 분들 어쩌고 저쩌고 우오아아아아아아",
        location: "SEONGJEONG1",
        schedule: "ALL",
        image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
        isHost: true
    },
    {
        meetingId: 2,
        title: "신불당 보드게임 카페 다녀요",
        description: "보드게임 좋아하시는 분 주말에 모여서 저랑 놀고 어쩌고 저쩌고",
        location: "SEONGJEONG1",
        schedule: "WEEKDAY",
        image_url: "https://www.ekn.kr/mnt/file/202412/20241223001203509_1.png",
        isHost: false
    },
    {
        meetingId: 3,
        title: "분위기 좋은 카페 다니실 분 ~",
        description: "분좋카 많이 아시는 분 환영 들어오세 어쩌고 저쩌고 우오아아아아아아",
        location: "SEONGJEONG1",
        schedule: "WEEKEND",
        image_url: "https://img.kr.gcp-karroter.net/community/community/20240824/14c3cfff-9a94-45d5-a578-d0ddf80ee338.jpeg?q=95&s=1200x630&t=cover",
        isHost: false
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
        status: "JOINED" // JOINED, PENDING
    },
    {
        meetingId: 5,
        title: "30대 초반 맛집 투어 모임",
        description: "보드게임 좋아하시는 분 주말에 모여서 저랑 놀고 어쩌고 저쩌고",
        location: "SEONGJEONG1",
        schedule: "ALL",
        image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
        isHost: false,
        status: "JOINED"
    },
    {
        meetingId: 6,
        title: "30대 초반 맛집 투어 모임",
        description: "보드게임 좋아하시는 분 주말에 모여서 저랑 놀고 어쩌고 저쇼고",
        location: "SEONGJEONG1",
        schedule: "WEEKDAY",
        image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
        isHost: false,
        status: "PENDING"
    }
];

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

const MeetingListPage = () => {
    const [mainTab, setMainTab] = useState('meetings'); // 'meetings' or 'myMeetings'
    const [subTab, setSubTab] = useState('joined'); // 'joined' or 'pending'
    const [meetings, setMeetings] = useState([]);
    const [myMeetings, setMyMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [swipedCard, setSwipedCard] = useState(null);

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
        console.log(`모임 ${meetingId} 상세 페이지로 이동`);
        // TODO: 라우터로 상세 페이지 이동
        // navigate(`/meetings/${meetingId}`);
        alert(`모임 ${meetingId} 상세 페이지로 이동합니다!`);
    };

    // 자세히 버튼 클릭 핸들러
    const handleViewMeeting = (meetingId) => {
        console.log(`모임 ${meetingId} 자세히`);
        if (mainTab === 'meetings') {
            alert(`모임 ${meetingId} 가입 모달이 나중에 여기 나타날 예정입니다!`);
        } else {
            alert(`모임 ${meetingId} 상세 페이지로 이동합니다!`);
        }
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

    // 이미지 에러 핸들러
    const handleImageError = (e) => {
        e.target.src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80";
    };

    // 재시도 핸들러
    const handleRetry = () => {
        fetchMeetings();
    };

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
                    <MeetingCardWrapper key={meeting.meetingId}>
                        {/* 스와이프 액션 (내 모임일 때만 표시) */}
                        {mainTab === 'myMeetings' && (
                            <SwipeAction show={swipedCard === meeting.meetingId}>
                                <LeaveButton onClick={() => handleLeaveMeeting(meeting.meetingId)}>
                                    나가기
                                </LeaveButton>
                            </SwipeAction>
                        )}

                        <MeetingCard
                            swiped={swipedCard === meeting.meetingId}
                            onClick={() => {
                                if (mainTab === 'myMeetings') {
                                    handleSwipe(meeting.meetingId);
                                } else {
                                    handleMeetingClick(meeting.meetingId);
                                }
                            }}
                        >
                            <div style={{position: 'relative'}}>
                                <MeetingImage
                                    src={meeting.image_url || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"}
                                    alt={meeting.title}
                                    onError={handleImageError}
                                />
                            </div>

                            <MeetingInfo>
                                <MeetingTitle>
                                    {meeting.isHost && <CrownIcon src="/UI/crown.svg" alt="모임장"/>}
                                    {meeting.title}
                                </MeetingTitle>
                                <MeetingDescription>{meeting.description}</MeetingDescription>
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

                            <ViewButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewMeeting(meeting.meetingId);
                                }}
                            >
                                {mainTab === 'myMeetings' && subTab === 'pending' ? '대기중' : '자세히'}
                            </ViewButton>
                        </MeetingCard>
                    </MeetingCardWrapper>
                ))}
            </MeetingList>
        </PageContainer>
    );
};

export default MeetingListPage;