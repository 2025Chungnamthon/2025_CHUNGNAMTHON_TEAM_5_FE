import React, { useEffect, useState } from "react";
import { getHomeData } from "@/services/homeApi";
import HomeGroupSection from "./component/HomeGroupSection";
import HomeRankingSection from "./component/HomeRankingSection";
import HomeStoreSection from "./component/HomeStoreSection";
import HomeCardSection from "./component/HomeCardSection";
import FloatingActionButton from "./component/FloatingActionButton";
import ActionMenu from "./component/ActionMenu";
import Header from "./component/Header";
import { useUIStore } from "@/stores/uiStore";

function Homepage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [homeData, setHomeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { refreshPoints } = useUIStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await getHomeData();
        setHomeData(res);

        // 홈페이지 로드 시 포인트도 함께 로드
        await refreshPoints();
      } catch (error) {
        console.error("홈 데이터 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [refreshPoints]);

  const handleFloatingButtonClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  return (
    <div>
      <Header />
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            fontSize: "16px",
            color: "#666",
          }}
        >
          데이터를 불러오는 중...
        </div>
      ) : (
        <>
          <HomeGroupSection meetings={homeData?.recentMeetings || []} />
          <HomeRankingSection powerUsers={homeData?.powerUsers || []} />
          <HomeStoreSection affiliates={homeData?.topAffiliates || []} />
          <HomeCardSection />
        </>
      )}

      <FloatingActionButton
        onClick={handleFloatingButtonClick}
        isOpen={menuOpen}
      />

      {menuOpen && <ActionMenu onClose={handleMenuClose} />}
    </div>
  );
}

export default Homepage;
