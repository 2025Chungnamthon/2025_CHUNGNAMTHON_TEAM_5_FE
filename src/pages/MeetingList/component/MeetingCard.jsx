import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { getLocationKorean } from "../../../utils/locationUtils";
import TagBadge from "../../../components/TagBadge";

// 개별 모임 카드 컨테이너 (스와이프 기능을 위한 래퍼)
const MeetingCardWrapper = styled.div`
    position: relative;
    overflow: hidden;
    background: #fff;
    touch-action: pan-y; /* 세로 스크롤은 허용, 가로 스와이프는 제어 */
    border-bottom: 1px solid #f3f4f6;

    &:last-child {
        border-bottom: none;
    }
`;

// 스와이프로 나타나는 삭제 버튼 (고정)
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
    z-index: 1;
`;

const LeaveButton = styled.button`
    background: none;
    border: none;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    padding: 8px 12px;
    outline: none;
    border-radius: 4px;

    &:focus {
        outline: none;
    }

    &:active {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
    }
`;

// 메인 카드 컨테이너 (움직이는 부분)
const CardContainer = styled.div`
    background: #fff;
    border-radius: 0;
    box-shadow: none;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: ${props => props.showSwipeAction ? 'grab' : 'pointer'};
    transition: ${props => props.isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'};
    transform: translateX(${props => props.translateX}px);
    position: relative;
    z-index: 2;
    user-select: none;

    &:hover {
        background: ${props => props.showSwipeAction ? '#fff' : '#fafafa'};
    }

    &:active {
        cursor: ${props => props.showSwipeAction ? 'grabbing' : 'pointer'};
    }
`;

const CrownIcon = styled.img`
    width: 20px;
    height: 20px;
    margin-right: 5px;
    margin-bottom: 3px;
    vertical-align: middle;
`;

const MeetingImage = styled.img`
    width: 75px;
    height: 75px;
    border-radius: 14px;
    object-fit: cover;
    background: #f3f4f6;
    flex-shrink: 0;
    position: relative;
`;

const MeetingInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
`;

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

const MeetingDescription = styled.div`
    font-size: 13px;
    color: #6b7280;
    line-height: 1.4;
    margin-bottom: 4px;
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

// 스케줄을 한글로 변환하는 함수
const getScheduleKorean = (schedule) => {
    const scheduleMap = {
        'WEEKDAY': '평일',
        'WEEKEND': '주말',
        'FULL': '전체'
    };
    return scheduleMap[schedule] || schedule;
};

// 스케줄에 따른 TagBadge 타입 결정
const getScheduleTagType = (schedule) => {
    const typeMap = {
        'WEEKDAY': 'weekday',
        'WEEKEND': 'weekend',
        'FULL': 'all'
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
                         actionButtonText = "자세히"
                     }) => {
    const [translateX, setTranslateX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const cardRef = useRef(null);
    const wrapperRef = useRef(null);

    const SWIPE_THRESHOLD = 40; // 스와이프 인식 임계값
    const SWIPE_DISTANCE = 80; // 최대 스와이프 거리

    // swiped prop이 변경될 때 translateX 동기화
    useEffect(() => {
        setTranslateX(swiped ? -SWIPE_DISTANCE : 0);
    }, [swiped]);

    // 외부 클릭 감지를 위한 이벤트 리스너
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showSwipeAction && swiped && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                // 외부 클릭시 스와이프 해제
                onCardClick?.(meeting.meetingId);
            }
        };

        if (swiped) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside, { passive: true });
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [swiped, showSwipeAction, onCardClick, meeting.meetingId]);

    // 터치/마우스 시작
    const handleStart = (clientX, e) => {
        if (!showSwipeAction) return;

        e.preventDefault();
        setStartX(clientX);
        setIsDragging(true);
    };

    // 터치/마우스 이동
    const handleMove = (clientX, e) => {
        if (!isDragging || !showSwipeAction) return;

        e.preventDefault();
        const deltaX = startX - clientX;

        let newTranslateX = 0;

        if (swiped) {
            // 이미 스와이프된 상태: 왼쪽으로 더 밀면 삭제 영역으로 이동
            // 현재 -80px 위치에서 시작해서 더 왼쪽으로 갈 수 있도록
            const currentDelta = deltaX;
            newTranslateX = Math.max(-SWIPE_DISTANCE - 40, -SWIPE_DISTANCE - currentDelta);
        } else {
            // 일반 상태: 오른쪽으로만 스와이프 허용 (deltaX > 0)
            if (deltaX > 0) {
                newTranslateX = Math.max(-SWIPE_DISTANCE, -deltaX);
            }
        }

        setTranslateX(newTranslateX);
    };

    // 터치/마우스 끝
    const handleEnd = () => {
        if (!isDragging || !showSwipeAction) return;

        setIsDragging(false);

        // 삭제 임계값 체크 (스와이프된 상태에서 더 멀리 밀었을 때)
        if (swiped && translateX <= -SWIPE_DISTANCE - 30) {
            // 스와이프된 상태에서 추가로 30px 더 밀면 삭제 실행
            setTranslateX(0);
            onLeaveClick?.(meeting.meetingId);
            return;
        }

        // 현재 위치에 따라 최종 위치 결정
        if (translateX <= -SWIPE_THRESHOLD) {
            // 임계값을 넘었으면 완전히 스와이프
            setTranslateX(-SWIPE_DISTANCE);
            if (!swiped) {
                // 처음 스와이프하는 경우에만 onCardClick 호출
                onCardClick?.(meeting.meetingId);
            }
        } else {
            // 임계값을 넘지 못했으면 원래 위치로
            if (swiped) {
                // 이미 스와이프된 상태에서 임계값 미달시 다시 스와이프 상태로
                setTranslateX(-SWIPE_DISTANCE);
            } else {
                // 일반 상태에서 임계값 미달시 원래 위치로
                setTranslateX(0);
            }
        }
    };

    // 터치 이벤트 핸들러
    const handleTouchStart = (e) => {
        handleStart(e.touches[0].clientX, e);
    };

    const handleTouchMove = (e) => {
        handleMove(e.touches[0].clientX, e);
    };

    const handleTouchEnd = () => {
        handleEnd();
    };

    // 마우스 이벤트 핸들러 (데스크톱 테스트용)
    const handleMouseDown = (e) => {
        handleStart(e.clientX, e);
    };

    const handleMouseMove = (e) => {
        handleMove(e.clientX, e);
    };

    const handleMouseUp = () => {
        handleEnd();
    };

    // 마우스 이벤트 등록/해제
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, startX, translateX, swiped]);

    const handleActionClick = (e) => {
        e.stopPropagation(); // 카드 클릭 이벤트 방지
        onActionClick?.(meeting.meetingId);
    };

    const handleLeaveClick = (e) => {
        e.stopPropagation();
        onLeaveClick?.(meeting.meetingId);
    };

    // 카드 클릭 (스와이프가 아닌 일반 클릭인 경우에만)
    const handleCardClick = (e) => {
        if (isDragging) return; // 드래그 중이면 클릭 무시

        // 스와이프 기능이 활성화된 경우
        if (showSwipeAction) {
            if (swiped) {
                // 이미 스와이프된 상태에서 클릭하면 제자리로 복귀
                onCardClick?.(meeting.meetingId);
            }
            // 스와이프 기능이 있지만 스와이프되지 않은 상태에서는 클릭 무시
            return;
        }

        // 스와이프 기능이 비활성화된 경우에만 일반 클릭 동작
        onCardClick?.(meeting.meetingId);
    };

    // 이미지 에러 핸들러
    const handleImageError = (e) => {
        e.target.src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80";
    };

    return (
        <MeetingCardWrapper ref={wrapperRef}>
            {/* 스와이프 액션 (필요할 때만 표시) */}
            {showSwipeAction && (
                <SwipeAction>
                    <LeaveButton onClick={handleLeaveClick}>
                        나가기
                    </LeaveButton>
                </SwipeAction>
            )}

            <CardContainer
                ref={cardRef}
                onClick={handleCardClick}
                translateX={translateX}
                isDragging={isDragging}
                showSwipeAction={showSwipeAction}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
            >
                <div style={{position: 'relative'}}>
                    <MeetingImage
                        src={meeting.imageUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"}
                        alt={meeting.title}
                        onError={handleImageError}
                        draggable={false} // 이미지 드래그 방지
                    />
                </div>

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