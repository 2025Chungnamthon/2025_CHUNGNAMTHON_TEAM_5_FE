import React, { useState } from "react";
import styled from "styled-components";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

const SectionContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 rgb(0 0 0 / 0.06);
  padding: 18px 20px 12px 20px;
  margin-bottom: 14px;
`;
const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;
const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #111;
`;
const SectionArrow = styled.div`
  color: #bdbdbd;
  font-size: 26px;
  cursor: pointer;
  transition: transform 0.2s ease;
`;
const RankingBox = styled.div``;
const RankItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  font-size: 15px;
  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;
const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  background: #f3f4f6;
`;

const AvatarPlaceholder = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
`;
const RankNumber = styled.span`
  font-weight: 600;
  color: #222;
  font-size: 15px;
  min-width: 20px;
  margin-right: -8px;
`;
const RankName = styled.span`
  font-weight: 600;
  color: #222;
`;
const RankPoint = styled.span`
  margin-left: auto;
  color: #0094ff;
  font-size: 15px;
  font-weight: 600;
`;

const rankingData = [
  {
    rank: 1,
    name: "김천안",
    points: "1,620p",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    rank: 2,
    name: "김미소",
    points: "1,620p",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    rank: 3,
    name: "김구라",
    points: "1,620p",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    rank: 4,
    name: "김미새",
    points: "1,620p",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    rank: 5,
    name: "김은빈",
    points: "1,620p",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
];

const HomeRankingSection = ({ powerUsers = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageErrors, setImageErrors] = useState(new Set());

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleImageError = (imageUrl) => {
    setImageErrors((prev) => new Set(prev).add(imageUrl));
  };

  const isValidImageUrl = (url) => {
    if (!url) return false;
    const invalidDomains = ["example.com", "image.com"];
    return !invalidDomains.some((domain) => url.includes(domain));
  };

  // API 데이터가 있으면 사용하고, 없으면 기본 데이터 사용
  const dataToUse = powerUsers.length > 0 ? powerUsers : rankingData;
  const displayData = isExpanded ? dataToUse : [dataToUse[0]];

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>이번 주 파워 유저 Top 5</SectionTitle>
        <SectionArrow onClick={handleToggle}>
          {isExpanded ? <FiChevronDown /> : <FiChevronUp />}
        </SectionArrow>
      </SectionHeader>
      <RankingBox>
        {displayData.map((user, index) => {
          const imageUrl = user.image || user.avatar || user.imageUrl;
          const shouldShowPlaceholder =
            !isValidImageUrl(imageUrl) || imageErrors.has(imageUrl);

          return (
            <RankItem key={user.userId || user.id || user.rank || index}>
              <RankNumber>{user.rank || index + 1}.</RankNumber>
              {shouldShowPlaceholder ? (
                <AvatarPlaceholder>
                  {(
                    user.nickname ||
                    user.name ||
                    user.username ||
                    "사용자"
                  ).charAt(0)}
                </AvatarPlaceholder>
              ) : (
                <Avatar
                  src={imageUrl}
                  alt={user.nickname || user.name || user.username}
                  onError={() => handleImageError(imageUrl)}
                />
              )}
              <RankName>{user.nickname || user.name || user.username}</RankName>
              <RankPoint>
                {user.totalPoint ? `${user.totalPoint}p` : "0p"}
              </RankPoint>
            </RankItem>
          );
        })}
      </RankingBox>
    </SectionContainer>
  );
};

export default HomeRankingSection;
