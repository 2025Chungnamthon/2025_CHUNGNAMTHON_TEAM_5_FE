import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// 기존 컴포넌트들 (게스트 모드 지원)
import MypageHeader from "./component/MypageHeader";
import MypageSummaryCard from "./component/MypageSummaryCard";
import MypageCouponLinkCard from "./component/MypageCouponLinkCard";
import MypageLogout from "./component/MypageLogout";

// 인증 유틸리티
import { isAuthenticated } from "../../utils/auth";

const PageContainer = styled.div`
  background: #f3f6f7;
  min-height: 100vh;
  padding: 0 0 32px 0;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const MyPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();

  // 더미 데이터 (실제 연동 시 API/Context 사용)
  const user = {
    name: "김천안",
    profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
    point: 1620,
    couponCount: 4,
  };

  const handleGuestCouponClick = () => {
    navigate("/login");
  };

  return (
    <PageContainer>
      <MypageHeader
        name={user.name}
        profileImg={user.profileImg}
        isGuest={!isLoggedIn}
      />
      <Section>
        <MypageSummaryCard
          point={user.point}
          couponCount={user.couponCount}
          isGuest={!isLoggedIn}
        />
      </Section>
      <Section>
        <MypageCouponLinkCard
          onClick={handleGuestCouponClick}
          isGuest={!isLoggedIn}
        />
        {isLoggedIn && <MypageLogout />}
      </Section>
    </PageContainer>
  );
};

export default MyPage;
