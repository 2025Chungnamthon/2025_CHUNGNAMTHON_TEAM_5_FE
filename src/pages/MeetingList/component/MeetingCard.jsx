import React from "react";
import styled from "styled-components";
import { getLocationKorean } from "../../../utils/locationUtils";
import TagBadge from "../../../components/TagBadge";

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
    background: #ff4757;
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
`;

const CardContainer = styled.div`
    background: #fff;
    border-radius: 0;
    box-shadow: none;
    padding: 16px 0;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    border-bottom: 1px solid #f3f4f6;
    transform: translateX(${props => props.swiped ? '-80px' : '0'});
    position: relative;
    z-index: 2;

    &:hover {
        background: #fafbfc;
    }

    &:last-child {
        border-bottom: none;
    }
`;

const CrownIcon = styled.img`
    width: 16px;
    height: 16px;
    margin-right: 6px;
    vertical-align: middle;
`;

const MeetingImage = styled.img`
    width: 64px;
    height: 64px;
    border-radius: 12px;
    object-fit: cover;
    background: #f3f4f6;
    flex-shrink: 0;
    position: relative;
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

const ActionButton = styled.button`
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

const MeetingCard = ({
                         meeting,
                         onCardClick,
                         onActionClick,
                         onLeaveClick,
                         showSwipeAction = false,
                         swiped = false,
                         actionButtonText = "보기"
                     }) => {

    const handleActionClick = (e) => {
        e.stopPropagation(); // 카드 클릭 이벤트 방지
        onActionClick?.(meeting.meetingId);
    };

    const handleLeaveClick = (e) => {
        e.stopPropagation();
        onLeaveClick?.(meeting.meetingId);
    };

    const handleCardClick = () => {
        onCardClick?.(meeting.meetingId);
    };

    return (
        <MeetingCardWrapper>
            {/* 스와이프 액션 (필요할 때만 표시) */}
            {showSwipeAction && (
                <SwipeAction show={swiped}>
                    <LeaveButton onClick={handleLeaveClick}>
                        나가기
                    </LeaveButton>
                </SwipeAction>
            )}

            <CardContainer onClick={handleCardClick} swiped={swiped}>
                <MeetingInfo>
                    <MeetingTitle>
                        {meeting.isHost && <CrownIcon src="/UI/crown.svg" alt="모임장" />}
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

                <ActionButton onClick={handleActionClick}>
                    {actionButtonText}
                </ActionButton>
            </CardContainer>
        </MeetingCardWrapper>
    );
};

export default MeetingCard;