import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

const StoreSectionContainer = styled.div`
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 2px 8px 0 rgb(0 0 0 / 0.06);
  padding: 18px 20px 18px 20px;
  margin-bottom: 14px;
`;

const StoreSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
`;

const StoreSectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  font-family: "Inter", sans-serif;
  color: #111;
`;

const StoreSectionArrow = styled(FiChevronRight)`
  color: #bdbdbd;
  font-size: 26px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #9ca3af;
    transform: translateX(2px);
  }
`;

const StoreScrollRow = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 18px;
  padding-bottom: 2px;
`;

const StoreCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 90px;
  max-width: 90px;
`;

const StoreImage = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 18px;
  object-fit: cover;
  background: #f3f4f6;
  margin-bottom: 8px;
`;

const StoreImagePlaceholder = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 18px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const StoreName = styled.div`
  font-size: 15px;
  color: #181818;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90px;
`;

const HomeStoreSection = ({ affiliates = [] }) => {
  const navigate = useNavigate();
  const [imageErrors, setImageErrors] = useState(new Set());

  const handleArrowClick = () => {
    navigate("/affiliated-stores");
  };

  const handleImageError = (imageUrl) => {
    setImageErrors((prev) => new Set(prev).add(imageUrl));
  };

  const isValidImageUrl = (url) => {
    if (!url) return false;
    const invalidDomains = ["example.com", "image.com"];
    return !invalidDomains.some((domain) => url.includes(domain));
  };

  const getImageUrl = (store) => {
    // API 데이터는 imageUrl이 없으므로 null 반환
    return store.imageUrl;
  };

  // 기본 데이터 (API 데이터가 없을 때 사용)
  const defaultAffiliates = [
    {
      id: 1,
      name: "한결가지칼국수",
      imageUrl:
        "https://www.onlmenu.com/data/file/sb/2040321633_9sUAX5GY_23dd04579a9ee8fb463c129a1b090c2adf37f485.JPG",
    },
    {
      id: 2,
      name: "배포 갈비",
      imageUrl:
        "https://static.doeat.me/store-food/1092/6d987a0d-2c57-4808-b5a9-423f43efca27.png",
    },
    {
      id: 3,
      name: "더홀릭보드카페",
      imageUrl:
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 4,
      name: "샤브올데이",
      imageUrl:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    },
  ];

  // API 데이터가 있으면 사용하고, 없으면 기본 데이터 사용
  const storesToShow = affiliates.length > 0 ? affiliates : defaultAffiliates;

  return (
    <StoreSectionContainer>
      <StoreSectionHeader>
        <StoreSectionTitle>이번 주 제휴 업체</StoreSectionTitle>
        <StoreSectionArrow onClick={handleArrowClick} />
      </StoreSectionHeader>
      <StoreScrollRow>
        {storesToShow.map((store, index) => {
          const imageUrl = getImageUrl(store);
          const shouldShowPlaceholder =
            !imageUrl ||
            !isValidImageUrl(imageUrl) ||
            imageErrors.has(imageUrl);

          return (
            <StoreCard key={store.id || index}>
              {shouldShowPlaceholder ? (
                <StoreImagePlaceholder>
                  {store.name ? store.name.charAt(0) : "업"}
                </StoreImagePlaceholder>
              ) : (
                <StoreImage
                  src={imageUrl}
                  alt={store.name}
                  onError={() => handleImageError(imageUrl)}
                />
              )}
              <StoreName>{store.name}</StoreName>
            </StoreCard>
          );
        })}
      </StoreScrollRow>
    </StoreSectionContainer>
  );
};

export default HomeStoreSection;
