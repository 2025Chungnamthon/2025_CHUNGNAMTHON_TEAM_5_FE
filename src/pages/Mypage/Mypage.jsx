import React from "react";
import MypageHeader from "./component/MypageHeader";
import MypageSummaryCard from "./component/MypageSummaryCard";
import MypageCouponLinkCard from "./component/MypageCouponLinkCard";
import MypageLogout from "./component/MypageLogout";
import styled from "styled-components";

const PageContainer = styled.div`
  background: #f3f6f7;
  min-height: 100vh;
  padding: 0 0 32px 0;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const MyPage = () => {
  // 더미 데이터 (실제 연동 시 API/Context 사용)
  const user = {
    name: "김천안",
    profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
    point: 1620,
    couponCount: 4,
  };

  return (
    <PageContainer>
      <MypageHeader name={user.name} profileImg={user.profileImg} />
      <Section>
        <MypageSummaryCard point={user.point} couponCount={user.couponCount} />
      </Section>
      <Section>
        <MypageCouponLinkCard />
      </Section>
      <MypageLogout />
    </PageContainer>
  );
};

export default MyPage;
