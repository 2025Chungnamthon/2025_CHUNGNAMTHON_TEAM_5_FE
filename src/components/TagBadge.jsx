import React from "react";
import styled, { css } from "styled-components";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";

// 태그 타입별 스타일 정의
const TAG_STYLES = {
  location: {
    bg: "#0090FF1F", // 연한 하늘색 배경
    color: "#0090FF", // 진한 파란색 텍스트
    icon: (
        <FaMapMarkerAlt
            size={14}
            style={{ marginRight: 3, verticalAlign: "middle", color: "#0094FF" }}
        />
    ),
  },
  weekday: {
    bg: "#EDFBE5", // 연한 초록색 배경
    color: "#4CA314", // 진한 초록색 텍스트
    icon: (
        <FaCalendarAlt
            size={14}
            style={{ marginRight: 3, verticalAlign: "middle", color: "#4CA314" }}
        />
    ),
  },
  weekend: {
    bg: "#FFF6E1", // 연한 노란색 배경
    color: "#D18000", // 진한 갈색 텍스트
    icon: (
        <FaCalendarAlt
            size={14}
            style={{ marginRight: 3, verticalAlign: "middle", color: "#D18000" }}
        />
    ),
  },
  all: {
    bg: "#F5EDFF", // 연한 보라색 배경
    color: "#B44BD7", // 진한 보라색 텍스트
    icon: (
        <FaCalendarAlt
            size={14}
            style={{ marginRight: 3, verticalAlign: "middle", color: "#8B3FD9" }}
        />
    ),
  },
};

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 500;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, system-ui,
  Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR",
  "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
  sans-serif;
  border-radius: 999px;
  padding: 0 12px 0 8px;
  min-width: 44px;
  height: 28px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  line-height: 1;
  user-select: none;
  box-shadow: none;
  border: none;
  letter-spacing: -0.3px;
  margin-right: 8px;
  > svg {
    margin-right: 1px;
    margin-left: 0;
    display: inline-block;
    vertical-align: middle;
  }
  &.last {
    margin-right: 0;
  }
`;

/**
 * TagBadge 컴포넌트
 * @param {('location'|'weekday'|'weekend'|'all')} type 태그 타입
 * @param {string} text 태그에 표시할 텍스트
 * @param {boolean} forceShow 강제로 표시할지 여부 (숨겨진 페이지에서도 보이게 하려면 true)
 */
function TagBadge({ type = "location", text, className, forceShow = false }) {
  const location = useLocation();
  const style = TAG_STYLES[type] || TAG_STYLES.location;

  // 모임 생성/수정/멤버 관리 페이지에서는 숨김
  const isHiddenPage = location.pathname === '/create-meeting' ||
      location.pathname.includes('/create') ||
      location.pathname.includes('/members')

  // 숨겨야 할 페이지면 렌더링하지 않음 (forceShow가 true가 아닌 경우)
  if (isHiddenPage && !forceShow) {
    return null;
  }

  // FULL 일정일 때 "전체"로 표시
  const displayText = text === "FULL" ? "전체" : text;

  return (
      <Badge $bg={style.bg} $color={style.color} className={className}>
        {style.icon}
        {displayText}
      </Badge>
  );
}

export default TagBadge;