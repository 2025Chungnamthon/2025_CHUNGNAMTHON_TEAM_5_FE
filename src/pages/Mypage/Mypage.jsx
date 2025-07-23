import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// 기존 컴포넌트들 (게스트 모드 지원)
import MypageHeader from "./component/MypageHeader";
import MypageSummaryCard from "./component/MypageSummaryCard";
import MypageLogout from "./component/MypageLogout";

// 인증 유틸리티
import { isAuthenticated } from "../../utils/auth";
import { getUserPoints, getCouponCount } from "../../utils/couponData";

const PageContainer = styled.div`
  background: #f3f6f7;
  min-height: 100vh;
  padding: 0 0 32px 0;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const CouponLinkCard = styled.div`
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 8px 0 rgb(0 0 0 / 0.06);
  padding: 20px 24px;
  margin: 16px;
  font-size: 15px;
  font-weight: 600;
  color: #111;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: #f9f9f9;
    transform: translateY(-2px);
  }
`;

const MyPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();

  // 더미 데이터 (실제 연동 시 API/Context 사용)
  const user = {
    name: "김천안",
    profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
    point: getUserPoints(),
    couponCount: getCouponCount(),
  };

  const handleGuestCouponClick = () => {
    if (isLoggedIn) {
      navigate("/coupon");
    } else {
      navigate("/login");
    }
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
        <CouponLinkCard onClick={handleGuestCouponClick}>
          쿠폰 교환하러 가기
        </CouponLinkCard>
        {isLoggedIn && <MypageLogout />}
      </Section>
    </PageContainer>
  );
};

export default MyPage;
