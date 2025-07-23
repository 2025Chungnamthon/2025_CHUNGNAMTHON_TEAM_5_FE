import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { PiTicketFill } from "react-icons/pi";
import PointDisplay from "../../components/PointDisplay";
import {
  getExchangeCoupons,
  getMyCoupons,
  getUserPoints,
} from "../../utils/couponData";

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

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`;

const TabSection = styled.div`
  display: flex;
  background: #fff;
  position: relative;
`;

const TabItem = styled.div`
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 16px;
  font-weight: ${(props) => (props.isActive ? "600" : "500")};
  color: ${(props) => (props.isActive ? "#111827" : "#9ca3af")};
  cursor: pointer;
  position: relative;
  user-select: none;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${(props) => (props.isActive ? "#111827" : "transparent")};
    transition: all 0.3s ease;
  }
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
  const [activeTab, setActiveTab] = useState("exchange"); // "exchange" 또는 "my-coupons"

  const handleBack = () => {
    navigate(-1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleExchange = (couponId) => {
    // 실제 교환 로직 구현 필요
    alert(`${couponId}번 쿠폰을 교환하시겠습니까?`);
  };

  // 쿠폰 데이터 (실제 연동 시 API 사용)
  const exchangeCoupons = getExchangeCoupons();
  const myCoupons = getMyCoupons();
  const userPoints = getUserPoints();

  return (
    <PageContainer>
      <Header>
        <HeaderLeft>
          <BackButton onClick={handleBack}>
            <FaArrowLeft />
          </BackButton>
        </HeaderLeft>

        <HeaderRight>
          <PointDisplay points={userPoints} />
        </HeaderRight>
      </Header>

      <TabSection>
        <TabItem
          isActive={activeTab === "exchange"}
          onClick={() => handleTabChange("exchange")}
        >
          교환하기
        </TabItem>
        <TabItem
          isActive={activeTab === "my-coupons"}
          onClick={() => handleTabChange("my-coupons")}
        >
          내 쿠폰함
        </TabItem>
      </TabSection>

      <Content>
        {activeTab === "exchange"
          ? // 교환하기 탭
            exchangeCoupons.map((coupon) => (
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
            ))
          : // 내 쿠폰함 탭
            myCoupons.map((coupon) => (
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
