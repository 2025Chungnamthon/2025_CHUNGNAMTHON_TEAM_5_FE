import React from "react";
import styled from "styled-components";

const HeaderWrap = styled.div`
  padding: 32px 24px 0 24px;
  background: #f3f6f7;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #222;
  margin-bottom: 22px;
`;

const ProfileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 22px;
`;

const ProfileImg = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  background: #e5e7eb;
`;

const Name = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #374151;
`;

const MypageHeader = ({ name, profileImg }) => (
  <HeaderWrap>
    <Title>마이페이지</Title>
    <ProfileRow>
      <ProfileImg src={profileImg} alt={name} />
      <Name>{name}</Name>
    </ProfileRow>
  </HeaderWrap>
);

export default MypageHeader;
