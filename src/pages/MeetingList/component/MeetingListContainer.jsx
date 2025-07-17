import React from "react";
import styled from "styled-components";
import MeetingCard from "./MeetingCard";

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 100px; /* 하단 탭바 공간 확보 */
`;

// 더미 데이터 - 실제로는 API에서 받아올 예정
const DUMMY_MEETINGS = [
    {
        id: 1,
        title: "30대 초반 맛집 투어 모임",
        location: "성정동",
        date: "8/19(토)",
        time: "오후 4:00",
        currentMembers: 1,
        maxMembers: 4,
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 2,
        title: "신불당 보드게임 카페 다녀요",
        location: "불당동",
        date: "7/28(금)",
        time: "오후 11:00",
        currentMembers: 2,
        maxMembers: 4,
        image: "https://www.ekn.kr/mnt/file/202412/20241223001203509_1.png"
    },
    {
        id: 3,
        title: "분위기 좋은 카페 다니실 분 ~",
        location: "신부동",
        date: "7/20(월)",
        time: "오후 2:00",
        currentMembers: 1,
        maxMembers: 3,
        image: "https://img.kr.gcp-karroter.net/community/community/20240824/14c3cfff-9a94-45d5-a578-d0ddf80ee338.jpeg?q=95&s=1200x630&t=cover"
    },
    {
        id: 4,
        title: "분위기 좋은 카페 다니실 분 ~",
        location: "신부동",
        date: "7/20(월)",
        time: "오후 4:00",
        currentMembers: 1,
        maxMembers: 3,
        image: "https://img.kr.gcp-karroter.net/community/community/20240824/14c3cfff-9a94-45d5-a578-d0ddf80ee338.jpeg?q=95&s=1200x630&t=cover"
    },
    {
        id: 5,
        title: "분위기 좋은 카페 다니실 분 ~",
        location: "신부동",
        date: "7/20(월)",
        time: "오후 4:00",
        currentMembers: 1,
        maxMembers: 3,
        image: "https://img.kr.gcp-karroter.net/community/community/20240824/14c3cfff-9a94-45d5-a578-d0ddf80ee338.jpeg?q=95&s=1200x630&t=cover"
    },
    {
        id: 6,
        title: "분위기 좋은 카페 다니실 분 ~",
        location: "신부동",
        date: "7/20(월)",
        time: "오후 4:00",
        currentMembers: 1,
        maxMembers: 3,
        image: "https://img.kr.gcp-karroter.net/community/community/20240824/14c3cfff-9a94-45d5-a578-d0ddf80ee338.jpeg?q=95&s=1200x630&t=cover"
    },
    {
        id: 7,
        title: "분위기 좋은 카페 다니실 분 ~",
        location: "신부동",
        date: "7/20(월)",
        time: "오후 4:00",
        currentMembers: 1,
        maxMembers: 3,
        image: "https://img.kr.gcp-karroter.net/community/community/20240824/14c3cfff-9a94-45d5-a578-d0ddf80ee338.jpeg?q=95&s=1200x630&t=cover"
    },
    {
        id: 8,
        title: "분위기 좋은 카페 다니실 분 ~",
        location: "신부동",
        date: "7/20(월)",
        time: "오후 4:00",
        currentMembers: 1,
        maxMembers: 3,
        image: "https://img.kr.gcp-karroter.net/community/community/20240824/14c3cfff-9a94-45d5-a578-d0ddf80ee338.jpeg?q=95&s=1200x630&t=cover"
    }
];

const MeetingListContainer = ({ meetings = DUMMY_MEETINGS, onMeetingClick, onJoinMeeting }) => {
    return (
        <ListContainer>
            {meetings.map((meeting) => (
                <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    onCardClick={onMeetingClick}
                    onJoinClick={onJoinMeeting}
                />
            ))}
        </ListContainer>
    );
};

export default MeetingListContainer;