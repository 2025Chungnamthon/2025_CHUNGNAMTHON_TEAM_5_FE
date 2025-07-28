import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { PiTicketFill } from "react-icons/pi";
import toast from "react-hot-toast";
import { useUIStore } from "../../../stores/uiStore";
import dayjs from "dayjs";
import {
  getAllCoupons,
  getMyCoupons,
  useCoupon,
  exchangeCoupon,
} from "@/services/couponApi";
import PointDisplay from "@/components/PointDisplay";
import CouponUseModal from "./component/couponUseModal.jsx";
import ExchangeConfirmModal from "./component/ExchangeConfirmModal.jsx";

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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 40px;
  color: #6b7280;
`;

const CouponPage = () => {
  const navigate = useNavigate();
  const { tabs, setTab, points, refreshPoints } = useUIStore();
  const activeTab = tabs.coupon || "exchange";

  const [exchangeCouponsData, setExchangeCouponsData] = useState([]);
  const [myCouponsData, setMyCouponsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const [selectedExchangeCoupon, setSelectedExchangeCoupon] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const [all, mine] = await Promise.all([
          getAllCoupons(),
          getMyCoupons(),
        ]);
        setExchangeCouponsData(all);
        setMyCouponsData(mine);
      } catch (err) {
        console.error("쿠폰 조회 실패", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleTabChange = (tab) => {
    setTab("coupon", tab);
  };

  const handleUseCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCoupon(null);
  };

  const handleSubmitCouponUse = async (code) => {
    if (!selectedCoupon) return;

    try {
      const response = await useCoupon(selectedCoupon.id, code);
      toast.success("쿠폰을 사용했어요", {
        style: {
          background: "#ffffff",
          color: "#10b981",
          border: "none",
          borderRadius: "20px",
          padding: "12px 20px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          fontSize: "14px",
          fontWeight: "600",
        },
        icon: "✓",
        iconTheme: {
          primary: "#10b981",
          secondary: "#ffffff",
        },
      });
      handleCloseModal();
      // 쿠폰 목록 새로고침
      const updatedMyCoupons = await getMyCoupons();
      setMyCouponsData(updatedMyCoupons);
      // 포인트 새로고침
      refreshPoints();
    } catch (error) {
      console.error("쿠폰 사용 실패:", error);
      console.error("에러 응답 데이터:", error.response?.data);
      const errorMessage =
        error.response?.data?.message ||
        "쿠폰 사용에 실패했습니다. 확인 코드를 다시 입력해주세요.";
      toast.error(errorMessage, {
        style: {
          background: "#ffffff",
          color: "#ef4444",
          border: "none",
          borderRadius: "20px",
          padding: "12px 20px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          fontSize: "14px",
          fontWeight: "600",
        },
        icon: "✕",
        iconTheme: {
          primary: "#ef4444",
          secondary: "#ffffff",
        },
      });
    }
  };

  const handleExchangeCoupon = async (coupon) => {
    setSelectedExchangeCoupon(coupon);
    setIsExchangeModalOpen(true);
  };

  const handleCloseExchangeModal = () => {
    setIsExchangeModalOpen(false);
    setSelectedExchangeCoupon(null);
  };

  const handleConfirmExchange = async () => {
    if (!selectedExchangeCoupon) return;

    try {
      const response = await exchangeCoupon(selectedExchangeCoupon.id);
      toast.success("쿠폰으로 교환했어요", {
        style: {
          background: "#ffffff",
          color: "#10b981",
          border: "none",
          borderRadius: "20px",
          padding: "12px 20px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          fontSize: "14px",
          fontWeight: "600",
        },
        icon: "✓",
        iconTheme: {
          primary: "#10b981",
          secondary: "#ffffff",
        },
      });
      handleCloseExchangeModal();
      // 성공 메시지 표시
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      // 쿠폰 목록 새로고침
      const updatedMyCoupons = await getMyCoupons();
      setMyCouponsData(updatedMyCoupons);
      // 포인트 새로고침
      refreshPoints();
    } catch (error) {
      console.error("쿠폰 교환 실패:", error);
      console.error("에러 응답 데이터:", error.response?.data);
      const errorMessage =
        error.response?.data?.message ||
        "쿠폰 교환에 실패했습니다. 다시 시도해주세요.";
      toast.error(errorMessage, {
        style: {
          background: "#ffffff",
          color: "#ef4444",
          border: "none",
          borderRadius: "20px",
          padding: "12px 20px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          fontSize: "14px",
          fontWeight: "600",
        },
        icon: "✕",
        iconTheme: {
          primary: "#ef4444",
          secondary: "#ffffff",
        },
      });
      handleCloseExchangeModal();
    }
  };

  const calculateRemainDays = (expirationDate) => {
    const today = dayjs();
    const expiry = dayjs(expirationDate);
    const remainDays = expiry.diff(today, "day");
    return Math.max(0, remainDays);
  };

  // 전역 포인트 상태 사용
  useEffect(() => {
    // 포인트 데이터가 없거나 오래된 경우 새로고침
    if (points.currentPoints === 0 || !points.lastUpdated) {
      refreshPoints();
    }
  }, [points.currentPoints, points.lastUpdated, refreshPoints]);

  // 데이터 가공
  const exchangeCoupons = (exchangeCouponsData || []).map((coupon) => ({
    id: coupon.couponId,
    title: coupon.title,
    points: coupon.point,
    expiry: `기한: 발급일로부터 ${coupon.expirationPeriod}일 이내 사용`,
  }));

  const myCoupons = (myCouponsData || []).map((coupon) => ({
    id: coupon.couponId,
    title: coupon.title,
    points: coupon.point,
    expiry: dayjs(coupon.expirationPeriod).format("YYYY.MM.DD 까지 사용가능"),
    originalExpiry: coupon.expirationPeriod, // 원본 날짜 데이터 보존
  }));

  // 로딩 상태 처리
  if (loading) {
    return (
      <PageContainer>
        <Header>
          <HeaderLeft>
            <BackButton onClick={handleBack}>
              <FaArrowLeft />
            </BackButton>
          </HeaderLeft>
          <HeaderRight>
            <PointDisplay points={points.currentPoints || 0} variant="header" />
          </HeaderRight>
        </Header>
        <LoadingText>로딩 중...</LoadingText>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <HeaderLeft>
          <BackButton onClick={handleBack}>
            <FaArrowLeft />
          </BackButton>
        </HeaderLeft>
        {showSuccessMessage && (
          <SuccessMessage>
            <SuccessIcon>✓</SuccessIcon>
            쿠폰으로 교환했어요
          </SuccessMessage>
        )}
        <HeaderRight>
          <PointDisplay points={points.currentPoints || 0} variant="header" />
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
                <ExchangeButton onClick={() => handleExchangeCoupon(coupon)}>
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
                <ExchangeButton onClick={() => handleUseCoupon(coupon)}>
                  사용하기
                </ExchangeButton>
              </CouponCard>
            ))}
      </Content>

      {isModalOpen && selectedCoupon && (
        <CouponUseModal
          couponName={selectedCoupon.title}
          remainDays={calculateRemainDays(selectedCoupon.originalExpiry)}
          onSubmit={handleSubmitCouponUse}
          onClose={handleCloseModal}
        />
      )}

      {/* 교환 확인 모달 */}
      {isExchangeModalOpen && selectedExchangeCoupon && (
        <ExchangeConfirmModal
          coupon={selectedExchangeCoupon}
          onConfirm={handleConfirmExchange}
          onCancel={handleCloseExchangeModal}
        />
      )}
    </PageContainer>
  );
};

// 성공 메시지 스타일 컴포넌트
const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #10b981;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;
`;

const SuccessIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background: #10b981;
  color: white;
  border-radius: 50%;
  font-size: 10px;
  font-weight: bold;
`;

export default CouponPage;
