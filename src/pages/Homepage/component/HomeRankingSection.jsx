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

const HomeRankingSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const displayData = isExpanded ? rankingData : [rankingData[0]];

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>이번 주 파워 유저 Top 5</SectionTitle>
        <SectionArrow onClick={handleToggle}>
          {isExpanded ? <FiChevronDown /> : <FiChevronUp />}
        </SectionArrow>
      </SectionHeader>
      <RankingBox>
        {displayData.map((user) => (
          <RankItem key={user.rank}>
            <RankNumber>{user.rank}.</RankNumber>
            <Avatar src={user.avatar} alt={user.name} />
            <RankName>{user.name}</RankName>
            <RankPoint>{user.points}</RankPoint>
          </RankItem>
        ))}
      </RankingBox>
    </SectionContainer>
  );
};

export default HomeRankingSection;
