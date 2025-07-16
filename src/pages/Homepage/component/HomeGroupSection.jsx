import React from "react";
import styled from "styled-components";
import { FiChevronRight, FiMapPin } from "react-icons/fi";

const SectionContainer = styled.div`
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 2px 8px 0 rgb(0 0 0 / 0.06);
  padding: 18px 20px 12px 20px;
  margin-bottom: 24px;
`;
const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
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
const SectionArrowButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin-left: 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const GroupCard = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 8px 0 rgb(0 0 0 / 0.06);
  padding: 12px 10px 12px 10px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;
const GroupImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 14px;
  object-fit: cover;
  background: #f3f4f6;
  flex-shrink: 0;
`;
const GroupInfo = styled.div`
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  max-width: 100%;
  white-space: normal;
  word-break: break-all;
`;
const GroupTitle = styled.div`
  font-weight: 800;
  font-size: 15px;
  color: #181818;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const GroupMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6b7280;
`;
const GroupMetaIcon = styled(FiMapPin)`
  color: #bdbdbd;
  font-size: 15px;
  margin-right: 1px;
`;
const GroupBadge = styled.div`
  display: inline-block;
  background: #fdd756;
  color: #d18000;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  padding: 3px 10px 3px 10px;
  margin-top: 6px;
  letter-spacing: -0.5px;
  max-width: 120px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const JoinButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  height: 100%;
  flex-shrink: 0;
`;
const JoinButton = styled.button`
  background: #f3f4f6;
  color: #222;
  border: none;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;
  padding: 10px 20px;
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 0.06);
  transition: background 0.18s, box-shadow 0.18s;
  cursor: pointer;
  &:hover {
    background: #e5e7eb;
    box-shadow: 0 2px 8px 0 rgb(0 0 0 / 0.1);
  }
  &:active {
    background: #e5e7eb;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.04);
  }
`;

const HomeGroupSection = () => (
  <SectionContainer>
    <SectionHeader>
      <SectionTitle>직접 모여 소통해요</SectionTitle>
      <SectionArrowButton
        aria-label="더보기"
        onClick={() => {
          /* TODO: implement show more */
        }}
      >
        <SectionArrow />
      </SectionArrowButton>
    </SectionHeader>
    <GroupCard>
      <GroupImage
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
        alt="맛집"
      />
      <GroupInfo>
        <GroupTitle>30대 초반 맛집 투어 모임</GroupTitle>
        <GroupMetaRow>
          <GroupMetaIcon />
          성정동 · 8/19(토) 오후 4:00
        </GroupMetaRow>
        <GroupBadge>인원 현황: 1/4명</GroupBadge>
      </GroupInfo>
      <JoinButtonWrapper>
        <JoinButton>가입</JoinButton>
      </JoinButtonWrapper>
    </GroupCard>
    <GroupCard>
      <GroupImage
        src="https://www.ekn.kr/mnt/file/202412/20241223001203509_1.png"
        alt="보드게임 카페"
      />
      <GroupInfo>
        <GroupTitle>신불당 보드게임 카페 다녀요</GroupTitle>
        <GroupMetaRow>
          <GroupMetaIcon />
          불당동 · 7/28(금) 오전 11:00
        </GroupMetaRow>
        <GroupBadge>인원 현황: 2/4명</GroupBadge>
      </GroupInfo>
      <JoinButtonWrapper>
        <JoinButton>가입</JoinButton>
      </JoinButtonWrapper>
    </GroupCard>
    <GroupCard>
      <GroupImage
        src="https://img.kr.gcp-karroter.net/community/community/20240824/14c3cfff-9a94-45d5-a578-d0ddf80ee338.jpeg?q=95&s=1200x630&t=cover"
        alt="카페"
      />
      <GroupInfo>
        <GroupTitle>분위기 좋은 카페 다니실 분 ~</GroupTitle>
        <GroupMetaRow>
          <GroupMetaIcon />
          신부동 · 7/20(월) 오후 2:00
        </GroupMetaRow>
        <GroupBadge>인원 현황: 1/3명</GroupBadge>
      </GroupInfo>
      <JoinButtonWrapper>
        <JoinButton>가입</JoinButton>
      </JoinButtonWrapper>
    </GroupCard>
  </SectionContainer>
);

export default HomeGroupSection;
