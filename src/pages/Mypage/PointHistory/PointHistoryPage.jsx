import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { pointApi } from "@/services/pointApi";

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
  padding: 0 20px;
  padding-bottom: 100px;
`;

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;
`;

const HistoryLeft = styled.div`
  flex: 1;
`;

const HistoryDate = styled.div`
  font-size: 14px;
  color: #9ca3af;
  margin-bottom: 4px;
`;

const HistoryDescription = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #374151;
`;

const HistoryPoints = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isPositive",
})`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => (props.isPositive ? "#10b981" : "#ef4444")};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyText = styled.p`
  font-size: 16px;
  margin: 0;
`;

const PointHistoryPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const [pointHistory, setPointHistory] = useState([]);

  const [userPoints, setUserPoints] = useState(0);

  const paymentTypeLabels = {
    MEETING_PARTICIPATION: "모임 참여 보상",
    MEETING_CREATION: "모임 개설 보상",
    PAYMENT_VERIFICATION: "천안사랑카드 결제 인증 보상",
    PARTNER_STORE_BONUS: "제휴 상점 이용 보너스",
    WEEKLY_STREAK_BONUS: "주간 연속 참여 보너스",
    EXCHANGE_COUPON: "쿠폰 교환",
  };

  useEffect(() => {
    const fetchPointHistory = async () => {
      try {
        const res = await pointApi.getPointHistory();
        console.log("Point History Response:", res);

        const formatted = res.data.map((item) => ({
          ...item,
          changePoint: item.changedPoint, // normalize key
        }));

        setPointHistory(formatted);

        const total = formatted.reduce(
          (acc, item) => acc + item.changePoint,
          0
        );
        setUserPoints(total);
      } catch (error) {
        console.error("포인트 데이터 로드 실패:", error);
      }
    };

    fetchPointHistory();
  }, []);

  return (
    <PageContainer>
      <Header>
        <HeaderLeft>
          <BackButton onClick={handleBack}>
            <FaArrowLeft />
          </BackButton>
          <Title>포인트 내역</Title>
        </HeaderLeft>
        <HeaderRight>
          <PointIcon>P</PointIcon>
          <PointText>{userPoints.toLocaleString()}p</PointText>
        </HeaderRight>
      </Header>

      <Content>
        {pointHistory.length > 0 ? (
          pointHistory.map((item) => (
            <HistoryItem key={item.id}>
              <HistoryLeft>
                <HistoryDate>
                  {new Date(item.usedAt).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </HistoryDate>
                <HistoryDescription>
                  {paymentTypeLabels[item.paymentType] || item.paymentType}
                </HistoryDescription>
              </HistoryLeft>
              <HistoryPoints isPositive={item.changePoint > 0}>
                {item.changePoint > 0 ? "+ " : "- "}
                {Math.abs(item.changePoint).toLocaleString()}p
              </HistoryPoints>
            </HistoryItem>
          ))
        ) : (
          <EmptyState>
            <EmptyIcon>💰</EmptyIcon>
            <EmptyText>포인트 내역이 없습니다</EmptyText>
          </EmptyState>
        )}
      </Content>
    </PageContainer>
  );
};

export default PointHistoryPage;
