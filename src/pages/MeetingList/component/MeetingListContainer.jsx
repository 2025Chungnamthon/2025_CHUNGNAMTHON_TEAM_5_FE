import React from "react";
import styled from "styled-components";
import MeetingCard from "./MeetingCard";

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-bottom: 100px; /* 하단 탭바 공간 확보 - 원래대로 복원 */
  background: #fff;
`;

const MeetingListContainer = ({
  meetings,
  onMeetingClick,
  onActionClick,
  onLeaveClick,
  showSwipeAction = false,
  swipedCard = null,
  actionButtonText = "자세히",
}) => {
  return (
    <ListContainer>
      {meetings.map((meeting) => (
        <MeetingCard
          key={meeting.meetingId}
          meeting={meeting}
          onCardClick={onMeetingClick}
          onActionClick={onActionClick}
          onLeaveClick={onLeaveClick}
          showSwipeAction={showSwipeAction}
          swiped={swipedCard === meeting.meetingId}
          actionButtonText={actionButtonText}
        />
      ))}
    </ListContainer>
  );
};

export default MeetingListContainer;
