import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { pointApi } from "@/services/pointApi";
import PointDisplay from "@/components/PointDisplay";
import { useUIStore } from "@/stores/uiStore";

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

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #ef4444;
`;

const PointHistoryPage = () => {
  const navigate = useNavigate();
  const { points, setPoints } = useUIStore();
  const [pointHistory, setPointHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleBack = () => {
    navigate(-1);
  };

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
        setLoading(true);
        setError(null);

        const res = await pointApi.getPointHistory();
        console.log("Point History Response:", res);

        const formatted = res.data.map((item) => ({
          ...item,
          changePoint: item.changedPoint, // normalize key
        }));

        setPointHistory(formatted);

        // 전역 포인트 상태도 업데이트
        const total = formatted.reduce(
          (acc, item) => acc + item.changePoint,
          0
        );
        setPoints(total);
      } catch (error) {
        console.error("포인트 데이터 로드 실패:", error);
        setError(error.message || "포인트 데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPointHistory();
  }, [setPoints]);

  if (loading) {
    return (
      <PageContainer>
        <Header>
          <HeaderLeft>
            <BackButton onClick={handleBack}>
              <FaArrowLeft />
            </BackButton>
            <Title>포인트 내역</Title>
          </HeaderLeft>
        </Header>
        <Content>
          <LoadingState>포인트 내역을 불러오는 중...</LoadingState>
        </Content>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Header>
          <HeaderLeft>
            <BackButton onClick={handleBack}>
              <FaArrowLeft />
            </BackButton>
            <Title>포인트 내역</Title>
          </HeaderLeft>
        </Header>
        <Content>
          <ErrorState>
            <div>포인트 내역을 불러오는데 실패했습니다.</div>
            <div style={{ fontSize: "14px", marginTop: "8px" }}>{error}</div>
          </ErrorState>
        </Content>
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
          <Title>포인트 내역</Title>
        </HeaderLeft>
        <HeaderRight>
          <PointDisplay points={points.currentPoints || 0} variant="header" />
        </HeaderRight>
      </Header>

      <Content>
        {pointHistory.length > 0 ? (
          pointHistory.map((item) => (
            <HistoryItem key={item.id}>
              <HistoryLeft>
                <HistoryDate>
                  {(() => {
                    // 백엔드에서 보내주는 시간이 UTC라고 가정하고 처리
                    const utcDate = new Date(item.usedAt + "Z"); // 'Z'를 추가하여 UTC로 명시
                    return utcDate.toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "Asia/Seoul",
                    });
                  })()}
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
