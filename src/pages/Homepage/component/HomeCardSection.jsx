import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

const SectionContainer = styled.div`
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 2px 8px 0 rgb(0 0 0 / 0.06);
  padding: 18px;
  margin-bottom: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px 0 rgb(0 0 0 / 0.1);
    transform: translateY(-1px);
  }
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const CardInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
`;

const CardImage = styled.img`
  width: 60px;
  height: 92px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
`;

const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #111;
`;

const ArrowIcon = styled(FiChevronRight)`
  color: #bdbdbd;
  font-size: 20px;
  transition: all 0.2s ease;

  ${SectionContainer}:hover & {
    color: #9ca3af;
    transform: translateX(2px);
  }
`;

const HomeCardSection = () => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // 카드 신청 페이지로 이동 (나중에 구현)
    alert("천안 사랑 카드 신청 페이지로 이동합니다.");
    // navigate("/card-application");
  };

  return (
    <SectionContainer onClick={handleCardClick}>
      <CardContent>
        <CardInfo>
          <CardImage src="/UI/card.png" alt="천안사랑카드" />
          <CardTitle>천안사랑카드 신청하러 가기</CardTitle>
        </CardInfo>
        <ArrowIcon />
      </CardContent>
    </SectionContainer>
  );
};

export default HomeCardSection;
