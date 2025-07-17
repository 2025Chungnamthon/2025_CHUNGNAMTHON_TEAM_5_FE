import React, { useState } from "react";
import HomeGroupSection from "./component/HomeGroupSection";
import HomeRankingSection from "./component/HomeRankingSection";
import HomeStoreSection from "./component/HomeStoreSection";
import FloatingActionButton from "./component/FloatingActionButton";
import ActionMenu from "./component/ActionMenu";

function Homepage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCreateGroup = () => {
    alert("모임 생성하기 클릭!");
    setMenuOpen(false);
  };
  const handleCertifyReceipt = () => {
    alert("영수증 인증하기 클릭!");
    setMenuOpen(false);
  };

  return (
    <div>
      <HomeGroupSection />
      <HomeRankingSection />
      <HomeStoreSection />
      <FloatingActionButton
        onClick={() => setMenuOpen(!menuOpen)}
        isOpen={menuOpen}
      />
      {menuOpen && (
        <ActionMenu
          onClose={() => setMenuOpen(false)}
          onCreateGroup={handleCreateGroup}
          onCertifyReceipt={handleCertifyReceipt}
        />
      )}
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
