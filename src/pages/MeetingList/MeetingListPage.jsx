import React from "react";
import styled from "styled-components";
import MeetingListContainer from "./component/MeetingListContainer";

const MOBILE_MAX_WIDTH = 430;

const PageContainer = styled.div`
  max-width: ${MOBILE_MAX_WIDTH}px;
  margin: 0 auto;
  background: #fafbfc;
  min-height: 100vh;
  padding: 0 20px;
`;

const PageHeader = styled.div`
  padding: 20px 0 16px 0;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #111;
  margin: 0;
  font-family: "Inter", sans-serif;
`;

const MeetingListPage = () => {
    // 모임 카드 클릭 핸들러
    const handleMeetingClick = (meetingId) => {
        console.log(`모임 ${meetingId} 상세 페이지로 이동`);
        // TODO: 라우터로 상세 페이지 이동
        // navigate(`/meetings/${meetingId}`);
        alert(`모임 ${meetingId} 상세 페이지로 이동합니다!`);
    };

    // 가입 버튼 클릭 핸들러
    const handleJoinMeeting = (meetingId) => {
        console.log(`모임 ${meetingId}에 가입 신청`);
        // TODO: API 호출로 가입 처리
        alert(`모임 ${meetingId}에 가입 신청했습니다!`);
    };

    return (
        <PageContainer>
            <PageHeader>
                <PageTitle>모임</PageTitle>
            </PageHeader>

            <MeetingListContainer
                onMeetingClick={handleMeetingClick}
                onJoinMeeting={handleJoinMeeting}
            />
        </PageContainer>
    );
};

export default MeetingListPage;