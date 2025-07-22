import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

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

const HistoryPoints = styled.div`
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

  // 더미 데이터 (실제 연동 시 API 사용)
  const pointHistory = [
    {
      id: 1,
      date: "2025.06.20 02:59",
      description: "모임 생성",
      points: 10,
      isPositive: true,
    },
    {
      id: 2,
      date: "2025.06.20 02:59",
      description: "모임 생성",
      points: 10,
      isPositive: true,
    },
    {
      id: 3,
      date: "2025.06.20 02:59",
      description: "모임 생성",
      points: 10,
      isPositive: true,
    },
    {
      id: 4,
      date: "2025.06.20 02:59",
      description: "모임 생성",
      points: 10,
      isPositive: true,
    },
    {
      id: 5,
      date: "2025.06.20 02:59",
      description: "모임 생성",
      points: 10,
      isPositive: true,
    },
    {
      id: 6,
      date: "2025.06.20 02:59",
      description: "모임 생성",
      points: 10,
      isPositive: true,
    },
    {
      id: 7,
      date: "2025.06.20 02:59",
      description: "모임 생성",
      points: 10,
      isPositive: true,
    },
    {
      id: 8,
      date: "2025.06.20 02:59",
      description: "모임 생성",
      points: 10,
      isPositive: true,
    },
    {
      id: 9,
      date: "2025.06.19 15:30",
      description: "쿠폰 교환",
      points: 5000,
      isPositive: false,
    },
    {
      id: 10,
      date: "2025.06.19 14:20",
      description: "모임 참여",
      points: 50,
      isPositive: true,
    },
    {
      id: 11,
      date: "2025.06.19 12:15",
      description: "모임 참여",
      points: 50,
      isPositive: true,
    },
    {
      id: 12,
      date: "2025.06.18 20:45",
      description: "모임 생성",
      points: 10,
      isPositive: true,
    },
    {
      id: 13,
      date: "2025.06.18 18:30",
      description: "쿠폰 교환",
      points: 3000,
      isPositive: false,
    },
    {
      id: 14,
      date: "2025.06.18 16:20",
      description: "모임 참여",
      points: 50,
      isPositive: true,
    },
    {
      id: 15,
      date: "2025.06.18 14:10",
      description: "모임 생성",
      points: 10,
      isPositive: true,
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
                <HistoryDate>{item.date}</HistoryDate>
                <HistoryDescription>{item.description}</HistoryDescription>
              </HistoryLeft>
              <HistoryPoints isPositive={item.isPositive}>
                {item.isPositive ? "+ " : "- "}
                {item.points.toLocaleString()}p
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
