import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
// import KakaoMap from "./component/KakaoMap";
import KakaoMap from "./component/KakaoMap";
import SearchBar from "./component/SearchBar";
import StoreList from "./component/StoreList";
import LocationButton from "./component/LocationButton";
import { useMapStore } from "./hooks/useMapStore";

const MOBILE_MAX_WIDTH = 430;

const PageContainer = styled.div`
  max-width: ${MOBILE_MAX_WIDTH}px;
  margin: 0 auto;
  background: #fafbfc;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  background: #fff;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  position: relative;
  z-index: 10;
  flex-shrink: 0;
`;

const HeaderTitle = styled.h1`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin: 0 0 12px 0;
`;

const MapContainer = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 0px;
  display: flex;
  flex-direction: column;
`;

const LoadingContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  padding: 20px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #666;
  font-size: 16px;
`;

const ErrorContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  padding: 20px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #ef4444;
  font-size: 14px;
  max-width: 300px;
`;

const MapPage = () => {
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapError, setMapError] = useState(null);

  const {
    filteredStores,
    selectedStore,
    currentLocation,
    isLoading,
    error: storeError,
    searchQuery,
    isSearchMode,
    currentBounds,
    handleSearchInputChange,
    handleSearch,
    handleStoreSelect,
    handleLocationUpdate,
    getCurrentLocation,
    loadStoresByBounds,
  } = useMapStore();

  // 컴포넌트 마운트 후 지도 준비 상태 설정
  useEffect(() => {
    // DOM이 완전히 렌더링된 후 지도 준비
    const timer = setTimeout(() => {
      setIsMapReady(true);
    }, 500); // 500ms로 증가

    return () => clearTimeout(timer);
  }, []);

  // 지도 bounds 변경 핸들러
  const handleBoundsChange = useCallback(
    (bounds) => {
      console.log("지도 영역 변경:", bounds);
      loadStoresByBounds(bounds);
    },
    [loadStoresByBounds]
  );

  // 에러 상태 통합
  const hasError = storeError || mapError;

  return (
    <PageContainer>
      <Header>
        <HeaderTitle>천안사랑카드 가맹점 조회</HeaderTitle>
        <SearchBar
          value={searchQuery}
          onChange={handleSearchInputChange}
          onSubmit={handleSearch}
          placeholder="가맹점을 검색해보세요"
        />
      </Header>

      <MapContainer>
        {!isMapReady ? (
          <LoadingContainer>
            <LoadingMessage>
              지도 준비 중...
              <br />
              <small>잠시만 기다려주세요</small>
            </LoadingMessage>
          </LoadingContainer>
        ) : (
          <KakaoMap
            stores={filteredStores}
            selectedStore={selectedStore}
            currentLocation={currentLocation}
            onStoreSelect={handleStoreSelect}
            onLocationUpdate={handleLocationUpdate}
            onBoundsChange={handleBoundsChange}
          />
        )}

        <LocationButton
          onClick={getCurrentLocation}
          disabled={isLoading || !isMapReady}
        />

        <StoreList
          stores={filteredStores}
          selectedStore={selectedStore}
          onStoreSelect={handleStoreSelect}
          isLoading={isLoading}
          searchQuery={searchQuery}
          isSearchMode={isSearchMode}
          currentBounds={currentBounds}
        />
      </MapContainer>

      {hasError && (
        <ErrorContainer>
          <ErrorMessage>
            <div>❌ 오류가 발생했습니다</div>
            <div style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
              {storeError || mapError}
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                background: "#80c7bc",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              새로고침
            </button>
          </ErrorMessage>
        </ErrorContainer>
      )}
    </PageContainer>
  );
};

export default MapPage;
