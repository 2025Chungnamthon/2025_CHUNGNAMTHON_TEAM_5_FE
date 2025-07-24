import React from "react";
import styled from "styled-components";
import { getLocationKorean } from "../../../services/locationUtils";
import TagBadge from "../../../components/TagBadge";

const CardContainer = styled.div`
  background: #fff;
  border-radius: 0;
  box-shadow: none;
  padding: 16px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f3f4f6;

  &:hover {
    background: #fafbfc;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const MeetingImage = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  object-fit: cover;
  background: #f3f4f6;
  flex-shrink: 0;
`;

const MeetingInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

const MeetingTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #181818;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MeetingDescription = styled.div`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TagContainer = styled.div`
  display: flex;
  gap: 0;
  align-items: center;
`;

const JoinButton = styled.button`
  background: #f3f4f6;
  color: #222;
  border: none;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  box-shadow: none;

  &:hover {
    background: #e5e7eb;
    transform: scale(1.05);
  }

  &:active {
    background: #d1d5db;
    transform: scale(0.98);
  }
`;

// 스케줄을 한글로 변환하는 함수
const getScheduleKorean = (schedule) => {
  const scheduleMap = {
    WEEKDAY: "평일",
    WEEKEND: "주말",
    ALL: "전체",
  };
  return scheduleMap[schedule] || schedule;
};

// 스케줄에 따른 TagBadge 타입 결정
const getScheduleTagType = (schedule) => {
  const typeMap = {
    WEEKDAY: "weekday",
    WEEKEND: "weekend",
    ALL: "all",
  };
  return typeMap[schedule] || "all";
};

const MeetingCard = ({ meeting, onCardClick, onJoinClick }) => {
  const handleImageError = (e) => {
    e.target.src =
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80";
  };

  const handleJoinClick = (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    onJoinClick?.(meeting.meetingId);
  };

  const handleCardClick = () => {
    onCardClick?.(meeting.meetingId);
  };

  return (
    <CardContainer onClick={handleCardClick}>
      <MeetingImage
        src={
          meeting.image_url ||
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
        }
        alt={meeting.title}
        onError={handleImageError}
      />

      <MeetingInfo>
        <MeetingTitle>{meeting.title}</MeetingTitle>
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

      <JoinButton onClick={handleJoinClick}>보기</JoinButton>
    </CardContainer>
  );
};

export default MeetingCard;
