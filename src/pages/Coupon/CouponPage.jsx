import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { PiTicketFill } from "react-icons/pi";

const PageContainer = styled.div`
  background: #ffffff;
  min-height: 100vh;
`;

const Header = styled.div`
  background: #ffffff;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #374151;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;

  &:hover {
    opacity: 0.8;
  }
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 700;
  color: #222;
  margin: 0;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PointIcon = styled.div`
  width: 24px;
  height: 24px;
  background: #fdd756;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d18000;
  font-weight: 700;
  font-size: 12px;
`;

const PointText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #222;
`;

const Content = styled.div`
  padding: 20px;
  padding-bottom: 100px;
`;

const CouponCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CouponIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #f1f5f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const CouponContent = styled.div`
  flex: 1;
`;

const CouponTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #222;
  margin: 0 0 4px 0;
`;

const CouponPoints = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
`;

const CouponPointsIcon = styled.div`
  width: 16px;
  height: 16px;
  background: #fdd756;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d18000;
  font-weight: 700;
  font-size: 10px;
`;

const CouponPointsText = styled.span`
  font-size: 14px;
  color: #6b7280;
`;

const CouponExpiry = styled.div`
  font-size: 12px;
  color: #9ca3af;
`;

const ExchangeButton = styled.button`
  background: #e5e7eb;
  color: #374151;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover {
    background: #d1d5db;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CouponPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleExchange = (couponId) => {
    // 실제 교환 로직 구현 필요
    alert(`${couponId}번 쿠폰을 교환하시겠습니까?`);
  };

  // 더미 데이터 (실제 연동 시 API 사용)
  const coupons = [
    {
      id: 1,
      title: "도리하다 5000원 할인 쿠폰",
      points: 5000,
      expiry: "기한: 발급일로부터 30일 이내",
    },
    {
      id: 2,
      title: "도리하다 5000원 할인 쿠폰",
      points: 5000,
      expiry: "기한: 발급일로부터 30일 이내",
    },
    {
      id: 3,
      title: "도리하다 5000원 할인 쿠폰",
      points: 5000,
      expiry: "기한: 발급일로부터 30일 이내",
    },
    {
      id: 4,
      title: "도리하다 5000원 할인 쿠폰",
      points: 5000,
      expiry: "기한: 발급일로부터 30일 이내",
    },
    {
      id: 5,
      title: "도리하다 5000원 할인 쿠폰",
      points: 5000,
      expiry: "기한: 발급일로부터 30일 이내",
    },
    {
      id: 6,
      title: "도리하다 5000원 할인 쿠폰",
      points: 5000,
      expiry: "기한: 발급일로부터 30일 이내",
    },
  ];

  // 사용자 포인트 (실제 연동 시 API 사용)
  const userPoints = 1620;

  return (
    <PageContainer>
      <Header>
        <HeaderLeft>
          <BackButton onClick={handleBack}>
            <FaArrowLeft />
          </BackButton>
          <Title>쿠폰</Title>
        </HeaderLeft>
        <HeaderRight>
          <PointIcon>P</PointIcon>
          <PointText>{userPoints.toLocaleString()}p</PointText>
        </HeaderRight>
      </Header>

      <Content>
        {coupons.map((coupon) => (
          <CouponCard key={coupon.id}>
            <CouponIcon>
              <PiTicketFill color="#4F8DFD" size={20} />
            </CouponIcon>
            <CouponContent>
              <CouponTitle>{coupon.title}</CouponTitle>
              <CouponPoints>
                <CouponPointsIcon>P</CouponPointsIcon>
                <CouponPointsText>
                  {coupon.points.toLocaleString()}p
                </CouponPointsText>
              </CouponPoints>
              <CouponExpiry>{coupon.expiry}</CouponExpiry>
            </CouponContent>
            <ExchangeButton onClick={() => handleExchange(coupon.id)}>
              교환
            </ExchangeButton>
          </CouponCard>
        ))}
      </Content>
    </PageContainer>
  );
};

export default CouponPage;
