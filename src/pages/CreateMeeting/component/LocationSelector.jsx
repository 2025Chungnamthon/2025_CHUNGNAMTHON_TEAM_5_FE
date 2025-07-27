import React from "react";
import styled from "styled-components";

const LocationTags = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
`;

const LocationTag = styled.button`
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

// 업데이트된 지역 옵션 (이미지와 동일하게)
const LOCATION_OPTIONS = ["검색", "백석동", "부성1동", "부성2동"];

const LocationSelector = ({ selectedLocation, onLocationSelect }) => {
    const handleLocationClick = (location) => {
        if (location === "검색") {
            console.log("검색 기능 준비 중...");
            return;
        }
        onLocationSelect(location);
    };

    return (
        <LocationTags>
            {LOCATION_OPTIONS.map((location) => (
                <LocationTag
                    key={location}
                    selected={selectedLocation === location}
                    onClick={() => handleLocationClick(location)}
                >
                    {location}
                </LocationTag>
            ))}
        </LocationTags>
    );
};

export default LocationSelector;