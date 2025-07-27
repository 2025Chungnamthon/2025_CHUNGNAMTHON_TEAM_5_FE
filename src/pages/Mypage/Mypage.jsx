import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// 기존 컴포넌트들 (게스트 모드 지원)
import MypageHeader from "./component/MypageHeader";
import MypageSummaryCard from "./component/MypageSummaryCard";
import MypageLogout from "./component/MypageLogout";

// 인증 유틸리티
import { isAuthenticated } from "../../services/auth";
import { mypageApi } from "../../services/mypageApi";

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

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      // 로그인하지 않은 경우 API 호출하지 않음
      if (!isLoggedIn) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await mypageApi.getMypage();
        setUser({
          name: data.userName,
          profileImg: data.profileImageUrl,
          point: data.currentPoint,
          couponCount: data.couponCount,
        });
      } catch (error) {
        console.error("마이페이지 정보 불러오기 실패:", error);
        // 에러 발생시 기본값 설정 (로그인된 상태에서 에러가 난 경우)
        setUser({
          name: "",
          profileImg: "",
          point: 0,
          couponCount: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isLoggedIn]);

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
            name={user?.name || ""}
            profileImg={user?.profileImg || ""}
            isGuest={!isLoggedIn}
        />
        <Section>
          <MypageSummaryCard
              point={user?.point || 0}
              couponCount={user?.couponCount || 0}
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