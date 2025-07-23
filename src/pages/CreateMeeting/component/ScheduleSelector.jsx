// ScheduleSelector.jsx - 활동 일시 선택 컴포넌트
import React from "react";
import styled from "styled-components";

const ScheduleTags = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ScheduleTag = styled.button`
  background: ${props => props.selected ? '#80c7bc' : '#f3f4f6'};
  color: ${props => props.selected ? '#fff' : '#6b7280'};
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.selected ? '#5fa89e' : '#e5e7eb'};
  }

  &:active {
    transform: scale(0.98);
  }
`;

// 활동 일시 옵션
const SCHEDULE_OPTIONS = [
    { value: "ALL", label: "전체" },
    { value: "WEEKDAY", label: "평일" },
    { value: "WEEKEND", label: "주말" }
];

const ScheduleSelector = ({ selectedSchedule, onScheduleSelect }) => {
    return (
        <ScheduleTags>
            {SCHEDULE_OPTIONS.map((option) => (
                <ScheduleTag
                    key={option.value}
                    selected={selectedSchedule === option.value}
                    onClick={() => onScheduleSelect(option.value)}
                >
                    {option.label}
                </ScheduleTag>
            ))}
        </ScheduleTags>
    );
};

export default ScheduleSelector;