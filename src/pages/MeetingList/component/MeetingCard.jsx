import React from "react";
import styled from "styled-components";
import { FiMapPin } from "react-icons/fi";

const CardContainer = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 8px 0 rgb(0 0 0 / 0.06);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px 0 rgb(0 0 0 / 0.1);
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

const MeetingMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #6b7280;
`;

const LocationIcon = styled(FiMapPin)`
  color: #bdbdbd;
  font-size: 14px;
  flex-shrink: 0;
`;

const MeetingBadge = styled.div`
  display: inline-block;
  background: #fdd756;
  color: #d18000;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 8px;
  margin-top: 2px;
  letter-spacing: -0.2px;
  max-width: fit-content;
`;

const JoinButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  height: 100%;
  flex-shrink: 0;
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

const MeetingCard = ({ meeting, onCardClick, onJoinClick }) => {
    const handleImageError = (e) => {
        e.target.src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80";
    };

    const handleJoinClick = (e) => {
        e.stopPropagation(); // 카드 클릭 이벤트 방지
        onJoinClick?.(meeting.id);
    };

    const handleCardClick = () => {
        onCardClick?.(meeting.id);
    };

    return (
        <CardContainer onClick={handleCardClick}>
            <MeetingImage
                src={meeting.image}
                alt={meeting.title}
                onError={handleImageError}
            />

            <MeetingInfo>
                <MeetingTitle>{meeting.title}</MeetingTitle>
                <MeetingMeta>
                    <LocationIcon />
                    {meeting.location} · {meeting.date} {meeting.time}
                </MeetingMeta>
                <MeetingBadge>
                    인원 현황: {meeting.currentMembers}/{meeting.maxMembers}명
                </MeetingBadge>
            </MeetingInfo>

            <JoinButtonWrapper>
                <JoinButton onClick={handleJoinClick}>
                    가입
                </JoinButton>
            </JoinButtonWrapper>
        </CardContainer>
    );
};

export default MeetingCard;