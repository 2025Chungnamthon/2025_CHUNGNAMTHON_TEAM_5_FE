import React from "react";
import styled, { css } from "styled-components";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";

// 태그 타입별 스타일 정의
const TAG_STYLES = {
  location: {
    bg: "#E8F4FF", // 연한 하늘색 배경
    color: "#0094FF", // 진한 파란색 텍스트
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
    color: "#8B3FD9", // 진한 보라색 텍스트
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
  font-weight: 600;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, system-ui,
    Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR",
    "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
    sans-serif;
  border-radius: 999px;
  padding: 0 12px 0 8px;
  min-width: 44px;
  height: 24px;
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
 */
function TagBadge({ type = "location", text, className }) {
  const style = TAG_STYLES[type] || TAG_STYLES.location;
  return (
    <Badge $bg={style.bg} $color={style.color} className={className}>
      {style.icon}
      {text}
    </Badge>
  );
}

export default TagBadge;
