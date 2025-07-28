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
    // 사용자 기기 감지
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // iOS 기기 감지
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      window.open(
        "https://apps.apple.com/kr/app/%EC%B2%9C%EC%95%88%EC%82%AC%EB%9E%91%EC%B9%B4%EB%93%9C/id1499441122",
        "_blank"
      );
    }
    // Android 기기 감지
    else if (/android/i.test(userAgent)) {
      window.open(
        "https://play.google.com/store/apps/details?id=gov.cheonan.lovecard&hl=ko",
        "_blank"
      );
    }
    // 기타 기기 (데스크톱 등) - 기본적으로 Android 링크로 이동
    else {
      window.open(
        "https://play.google.com/store/apps/details?id=gov.cheonan.lovecard&hl=ko",
        "_blank"
      );
    }
  };

  return (
    <SectionContainer onClick={handleCardClick}>
      <CardContent>
        <CardInfo>
          <CardImage src="/UI/card.svg" alt="천안사랑카드" />
          <CardTitle>천안사랑카드 신청하러 가기</CardTitle>
        </CardInfo>
        <ArrowIcon />
      </CardContent>
    </SectionContainer>
  );
};

export default HomeCardSection;
