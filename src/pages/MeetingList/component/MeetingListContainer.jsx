import React from "react";
import styled from "styled-components";
import MeetingCard from "./MeetingCard";

const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0;
    padding-bottom: 100px; /* 하단 탭바 공간 확보 */
    background: #fff;
`;

const MeetingListContainer = ({ meetings, onMeetingClick, onJoinMeeting }) => {
    return (
        <ListContainer>
            {meetings.map((meeting) => (
                <MeetingCard
                    key={meeting.meetingId}
                    meeting={meeting}
                    onCardClick={onMeetingClick}
                    onJoinClick={onJoinMeeting}
                />
            ))}
        </ListContainer>
    );
};

export default MeetingListContainer;