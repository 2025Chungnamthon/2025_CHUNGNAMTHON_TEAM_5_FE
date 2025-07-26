import React, { useEffect, useState } from "react";
import { getHomeData } from "@/services/homeApi";
import HomeGroupSection from "./component/HomeGroupSection";
import HomeRankingSection from "./component/HomeRankingSection";
import HomeStoreSection from "./component/HomeStoreSection";
import HomeCardSection from "./component/HomeCardSection";
import FloatingActionButton from "./component/FloatingActionButton";
import ActionMenu from "./component/ActionMenu";
import Header from "./component/Header";

function Homepage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHomeData();
        setHomeData(res); // 실제 응답 구조에 맞게 조정
        console.log("홈 데이터:", res);
      } catch (error) {
        console.error("홈 데이터 로딩 실패:", error);
      }
    };
    fetchData();
  }, []);

  const handleFloatingButtonClick = () => {
    console.log("플로팅 버튼 클릭 - 메뉴 토글");
    setMenuOpen(!menuOpen);
  };

  const handleMenuClose = () => {
    console.log("액션 메뉴 닫기");
    setMenuOpen(false);
  };

  return (
    <div>
      <Header />
      <HomeGroupSection meetings={homeData?.recentMeetings || []} />
      <HomeRankingSection powerUsers={homeData?.powerUsers || []} />
      <HomeStoreSection affiliates={homeData?.topAffiliates || []} />
      <HomeCardSection />

      <FloatingActionButton
        onClick={handleFloatingButtonClick}
        isOpen={menuOpen}
      />

      {menuOpen && <ActionMenu onClose={handleMenuClose} />}

      {/* 스크롤 테스트용 더미 데이터
      <div
        style={{
          height: 400,
          background: "#e5e7eb",
          margin: "32px 0",
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          color: "#333",
        }}
      >
        스크롤 테스트용 더미 데이터 (400px)
      </div> */}
    </div>
  );
}

export default Homepage;
