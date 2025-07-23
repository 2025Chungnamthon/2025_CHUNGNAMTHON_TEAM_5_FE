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

const Content = styled.div`
  padding: 0 20px;
  padding-bottom: 100px;
`;

const StoreItem = styled.div`
  display: flex;
  gap: 16px;
  padding: 20px 0;
  border-bottom: 1px solid #f3f4f6;
`;

const StoreImageContainer = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const StoreImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  background: #f3f4f6;
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 4px;
  left: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
`;

const ImageBottomText = styled.div`
  position: absolute;
  bottom: 4px;
  left: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
  text-align: center;
`;

const StoreInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StoreName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #222;
  margin: 0 0 8px 0;
`;

const StoreAddress = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 4px 0;
  line-height: 1.4;
`;

const StorePhone = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
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

const AffiliatedStoresPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  // 더미 데이터 (실제 연동 시 API 사용)
  const stores = [
    {
      id: 1,
      name: "한결가치칼국수 성정점",
      address: "충남 천안시 서북구 성정공원1길 9-4 지하1층 101-9호",
      phone: "041-555-0426",
      image:
        "https://www.onlmenu.com/data/file/sb/2040321633_9sUAX5GY_23dd04579a9ee8fb463c129a1b090c2adf37f485.JPG",
    },
    {
      id: 2,
      name: "한결가치칼국수 성정점",
      address: "충남 천안시 서북구 성정공원1길 9-4 지하1층 101-9호",
      phone: "041-555-0426",
      image:
        "https://www.onlmenu.com/data/file/sb/2040321633_9sUAX5GY_23dd04579a9ee8fb463c129a1b090c2adf37f485.JPG",
    },
    {
      id: 3,
      name: "한결가치칼국수 성정점",
      address: "충남 천안시 서북구 성정공원1길 9-4 지하1층 101-9호",
      phone: "041-555-0426",
      image:
        "https://www.onlmenu.com/data/file/sb/2040321633_9sUAX5GY_23dd04579a9ee8fb463c129a1b090c2adf37f485.JPG",
    },
    {
      id: 4,
      name: "한결가치칼국수 성정점",
      address: "충남 천안시 서북구 성정공원1길 9-4 지하1층 101-9호",
      phone: "041-555-0426",
      image:
        "https://www.onlmenu.com/data/file/sb/2040321633_9sUAX5GY_23dd04579a9ee8fb463c129a1b090c2adf37f485.JPG",
    },
    {
      id: 5,
      name: "한결가치칼국수 성정점",
      address: "충남 천안시 서북구 성정공원1길 9-4 지하1층 101-9호",
      phone: "041-555-0426",
      image:
        "https://www.onlmenu.com/data/file/sb/2040321633_9sUAX5GY_23dd04579a9ee8fb463c129a1b090c2adf37f485.JPG",
    },
    {
      id: 6,
      name: "한결가치칼국수 성정점",
      address: "충남 천안시 서북구 성정공원1길 9-4 지하1층 101-9호",
      phone: "041-555-0426",
      image:
        "https://www.onlmenu.com/data/file/sb/2040321633_9sUAX5GY_23dd04579a9ee8fb463c129a1b090c2adf37f485.JPG",
    },
    {
      id: 7,
      name: "한결가치칼국수 성정점",
      address: "충남 천안시 서북구 성정공원1길 9-4 지하1층 101-9호",
      phone: "041-555-0426",
      image:
        "https://www.onlmenu.com/data/file/sb/2040321633_9sUAX5GY_23dd04579a9ee8fb463c129a1b090c2adf37f485.JPG",
    },
    {
      id: 8,
      name: "한결가치칼국수 성정점",
      address: "충남 천안시 서북구 성정공원1길 9-4 지하1층 101-9호",
      phone: "041-555-0426",
      image:
        "https://www.onlmenu.com/data/file/sb/2040321633_9sUAX5GY_23dd04579a9ee8fb463c129a1b090c2adf37f485.JPG",
    },
  ];

  return (
    <PageContainer>
      <Header>
        <HeaderLeft>
          <BackButton onClick={handleBack}>
            <FaArrowLeft />
          </BackButton>
          <Title>이번 주 제휴 업체</Title>
        </HeaderLeft>
      </Header>

      <Content>
        {stores.length > 0 ? (
          stores.map((store) => (
            <StoreItem key={store.id}>
              <StoreImageContainer>
                <StoreImage src={store.image} alt={store.name} />
                <ImageOverlay>Delivery / Take out</ImageOverlay>
                <ImageBottomText>배달 / 포장 전문점</ImageBottomText>
              </StoreImageContainer>
              <StoreInfo>
                <StoreName>{store.name}</StoreName>
                <StoreAddress>{store.address}</StoreAddress>
                <StorePhone>{store.phone}</StorePhone>
              </StoreInfo>
            </StoreItem>
          ))
        ) : (
          <EmptyState>
            <EmptyIcon>🏪</EmptyIcon>
            <EmptyText>제휴 업체가 없습니다</EmptyText>
          </EmptyState>
        )}
      </Content>
    </PageContainer>
  );
};

export default AffiliatedStoresPage;
