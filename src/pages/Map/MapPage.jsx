import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
// import KakaoMap from "./component/KakaoMap";
import KakaoMap from "./component/KakaoMap";
import SearchBar from "./component/SearchBar";
import StoreList from "./component/StoreList";
import LocationButton from "./component/LocationButton";
import ResearchButton from "./component/ResearchButton";
import ToastNotification from "../../components/ToastNotification";
import { useMapStore } from "./hooks/useMapStore";
import { useToast } from "../../hooks/useToast";

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
  height: calc(100vh - 120px); /* 헤더 높이를 고려한 지도 높이 */
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
  const [pendingBounds, setPendingBounds] = useState(null);
  const [isListExpanded, setIsListExpanded] = useState(false); // 리스트 확장 상태 추가

  const { toast, showToast, hideToast } = useToast();

  const {
    filteredStores,
    selectedStore,
    currentLocation,
    isLoading,
    error: storeError,
    searchQuery,
    isSearchMode,
    currentBounds,
    hasInitialData,
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

  // 지도 bounds 변경 핸들러 - 자동 로딩 비활성화
  const handleBoundsChange = useCallback((bounds) => {
    // 자동으로 데이터를 로드하지 않고 pendingBounds에 저장
    setPendingBounds(bounds);
  }, []);

  // 수동 검색 버튼 클릭 핸들러
  const handleManualSearch = useCallback(() => {
    if (pendingBounds) {
      loadStoresByBounds(pendingBounds);
    }
  }, [pendingBounds, loadStoresByBounds]);

  // 가맹점 데이터 변경 시 토스트 메시지 표시
  useEffect(() => {
    if (
      hasInitialData &&
      !isLoading &&
      filteredStores.length === 0 &&
      !isSearchMode &&
      currentBounds // 현재 bounds가 있을 때만 (수동 검색 후)
    ) {
      showToast("해당 지역에 가맹점이 없습니다.", { type: "error" });
    }
  }, [
    filteredStores.length,
    hasInitialData,
    isLoading,
    isSearchMode,
    currentBounds,
    showToast,
  ]);

  // 에러 상태 통합
  const hasError = storeError || mapError;

  // 리스트 확장 상태 변경 핸들러
  const handleListExpandedChange = useCallback((expanded) => {
    setIsListExpanded(expanded);
  }, []);

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

        {/* 리스트가 확장되지 않았을 때만 LocationButton 표시 */}
        {!isListExpanded && (
          <LocationButton
            onClick={getCurrentLocation}
            disabled={isLoading || !isMapReady}
          />
        )}

        {/* 수동 검색 버튼 - 지도 이동 후 새로운 데이터 로드가 필요할 때만 표시하고, 리스트가 확장되지 않았을 때만 표시 */}
        {pendingBounds &&
          !isLoading &&
          !isListExpanded &&
          (!currentBounds ||
            JSON.stringify(pendingBounds) !==
              JSON.stringify(currentBounds)) && (
            <ResearchButton
              onClick={handleManualSearch}
              disabled={!pendingBounds || isLoading}
              isLoading={isLoading}
            />
          )}

        <StoreList
          stores={filteredStores}
          selectedStore={selectedStore}
          onStoreSelect={handleStoreSelect}
          isLoading={isLoading}
          searchQuery={searchQuery}
          isSearchMode={isSearchMode}
          currentBounds={currentBounds}
          pendingBounds={pendingBounds}
          onExpandedChange={handleListExpandedChange}
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

      {/* 토스트 알림 */}
      <ToastNotification
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
        type={toast.type}
        showIcon={toast.showIcon}
      />
    </PageContainer>
  );
};

export default MapPage;
