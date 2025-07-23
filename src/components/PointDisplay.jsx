import React from "react";
import styled from "styled-components";

const PointContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PointIcon = styled.div`
  width: ${(props) => props.size || "24px"};
  height: ${(props) => props.size || "24px"};
  background: #fdd756;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d18000;
  font-weight: 700;
  font-size: ${(props) => props.fontSize || "12px"};
`;

const PointText = styled.span`
  font-size: ${(props) => props.fontSize || "14px"};
  font-weight: 600;
  color: #222;
`;

const PointDisplay = ({
  points,
  size = "24px",
  fontSize = "14px",
  iconFontSize = "12px",
  showIcon = true,
}) => {
  return (
    <PointContainer>
      {showIcon && (
        <PointIcon size={size} fontSize={iconFontSize}>
          P
        </PointIcon>
      )}
      <PointText fontSize={fontSize}>{points.toLocaleString()}p</PointText>
    </PointContainer>
  );
};

export default PointDisplay;
