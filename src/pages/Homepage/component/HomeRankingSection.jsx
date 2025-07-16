import React from "react";
import styled from "styled-components";
import { FiChevronRight } from "react-icons/fi";

const SectionContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 rgb(0 0 0 / 0.06);
  padding: 18px 20px 12px 20px;
  margin-bottom: 24px; /* 섹션 간 간격 통일 */
`;
const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;
const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  font-family: "Inter", sans-serif;
  color: #111;
`;
const SectionArrow = styled(FiChevronRight)`
  color: #bdbdbd;
  font-size: 26px;
  cursor: pointer;
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
const RankName = styled.span`
  font-weight: 600;
  color: #222;
`;
const RankPoint = styled.span`
  margin-left: auto;
  color: #a8aaaa;
  font-size: 15px;
`;

const HomeRankingSection = () => (
  <SectionContainer>
    <SectionHeader>
      <SectionTitle>이번 주 파워 유저 ?? Top 5</SectionTitle>
      <SectionArrow />
    </SectionHeader>
    <RankingBox>
      <RankItem>
        <Avatar
          src="https://randomuser.me/api/portraits/men/1.jpg"
          alt="김천안"
        />
        <RankName>1. 김천안</RankName>
        <RankPoint>1,620p</RankPoint>
      </RankItem>
    </RankingBox>
  </SectionContainer>
);

export default HomeRankingSection;
