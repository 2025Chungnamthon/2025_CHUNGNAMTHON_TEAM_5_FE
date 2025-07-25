import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import TagBadge from "../../../components/TagBadge";
import MeetingDetailModal from "../../MeetingList/component/MeetingDetailModal";
import { getLocationKorean } from "../../../utils/locationUtils";

const SectionContainer = styled.div`
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 2px 8px 0 rgb(0 0 0 / 0.06);
  padding: 0 0 8px 0;
  margin-bottom: 14px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 18px 18px 12px 18px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #111;
`;

const SectionArrow = styled(FiChevronRight)`
  color: #bdbdbd;
  font-size: 26px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #9ca3af;
    transform: translateX(2px);
  }
`;

const GroupCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 4px 18px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const GroupImage = styled.img`
  width: 68px;
  height: 68px;
  border-radius: 14px;
  object-fit: cover;
  background: #f3f4f6;
  flex-shrink: 0;
`;

const GroupInfo = styled.div`
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  max-width: 100%;
  white-space: normal;
  word-break: break-all;
  padding-right: 8px;
`;

const GroupTitle = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: #181818;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const GroupDesc = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TagRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 2px;
`;

const ViewButton = styled.button`
  background: #f3f4f6;
  color: #222;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  padding: 8px 18px;
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 0.06);
  transition: background 0.18s, box-shadow 0.18s;
  cursor: pointer;
  &:hover {
    background: #e5e7eb;
    box-shadow: 0 2px 8px 0 rgb(0 0 0 / 0.1);
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

// 더미 데이터를 미팅 리스트 형식으로 변환
const groupList = [
  {
    meetingId: 1,
    title: "30대 초반 맛집 투어 모임",
    description: "30대 환영 ~ 인스타 맛집 다니고 싶으신 분들 어쩌고 저쩌고 우오아아아아아아",
    location: "SEONGJEONG1",
    schedule: "ALL",
    image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    isHost: false,
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
    detailedDescription: `분위기 좋은 카페를 찾아다니는 모임입니다!
인스타그램에서 화제가 된 카페들을 중심으로
주말마다 새로운 곳을 탐방해요.

☕ 카페 탐방 컨셉:
- 인테리어가 예쁜 감성 카페
- 커피가 맛있는 로스터리 카페  
- 디저트가 유명한 베이커리 카페
- 뷰가 좋은 루프탑 카페

📸 이런 분들과 함께하고 싶어요:
- 사진 찍기 좋아하시는 분
- 카페 인테리어에 관심 많은 분
- 커피/디저트 마니아
- 힐링하고 싶으신 분
- 소소한 일상을 공유하고 싶은 분

🗺️ 주요 탐방 지역:
- 천안 시내 숨은 카페들
- 성환, 직산 근교 카페
- 아산, 온양 유명 카페  
- 서울 핫플레이스 (월 1회)

📅 활동 계획:
매주 토요일 오후 2시 모임
한 달에 4-5곳 카페 탐방
시즌별 테마 카페 투어 진행
카페 사장님과의 커피 이야기 시간

💡 특별 활동:
- 월말 카페 랭킹 투표
- 개인 사진전 미니 전시회
- 홈카페 만들기 클래스 (분기 1회)
- 카페 사장님 인터뷰 프로젝트

예쁜 카페에서 맛있는 커피 마시며
일상의 소소한 행복을 나누어요 ☕✨`,
    rules: [
      "사진 촬영 시 다른 손님 배려하기",
      "카페 매너 지키기",
      "개인 취향 존중하기",
      "SNS 업로드 전 동의 구하기",
      "조용히 대화하기"
    ]
  },
];

const HomeGroupSection = () => {
  const navigate = useNavigate();
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleArrowClick = () => {
    navigate("/meetings");
  };

  const handleViewClick = (group) => {
    setSelectedMeeting(group);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMeeting(null);
  };

  const handleModalAction = (meetingId) => {
    console.log(`모임 ${meetingId} 가입 신청`);
    alert(`모임 ${meetingId}에 가입 신청하시겠습니까?`);
    setIsModalOpen(false);
  };

  return (
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>직접 모여 소통해요</SectionTitle>
          <SectionArrow onClick={handleArrowClick} />
        </SectionHeader>
        {groupList.map((group) => (
            <GroupCard key={group.meetingId}>
              <GroupImage src={group.image_url} alt={group.title} />
              <GroupInfo>
                <GroupTitle>{group.title}</GroupTitle>
                <GroupDesc>{group.description}</GroupDesc>
                <TagRow>
                  <TagBadge
                      type="location"
                      text={getLocationKorean(group.location)}
                  />
                  <TagBadge
                      type={getScheduleTagType(group.schedule)}
                      text={getScheduleKorean(group.schedule)}
                      className="last"
                  />
                </TagRow>
              </GroupInfo>
              <ViewButton onClick={() => handleViewClick(group)}>자세히</ViewButton>
            </GroupCard>
        ))}

        <MeetingDetailModal
            meeting={selectedMeeting}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onAction={handleModalAction}
            actionButtonText="가입 신청하기"
            isActionDisabled={false}
            meetingStatus="available"
        />
      </SectionContainer>
  );
};

export default HomeGroupSection;