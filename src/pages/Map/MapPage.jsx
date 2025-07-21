import React from "react";
import styled from "styled-components";
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
`;

const MapPage = () => {
    const {
        stores,
        filteredStores,
        selectedStore,
        currentLocation,
        isLoading,
        searchQuery,
        handleSearch,
        handleStoreSelect,
        handleLocationUpdate,
        getCurrentLocation
    } = useMapStore();

    return (
        <PageContainer>
            <Header>
                <HeaderTitle>천안사랑카드 가맹점 조회</HeaderTitle>
                <SearchBar
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="장소를 검색해보세요"
                />
            </Header>

            <MapContainer>
                <KakaoMap
                    stores={filteredStores}
                    selectedStore={selectedStore}
                    currentLocation={currentLocation}
                    onStoreSelect={handleStoreSelect}
                    onLocationUpdate={handleLocationUpdate}
                />

                <LocationButton
                    onClick={getCurrentLocation}
                    disabled={isLoading}
                />

                <StoreList
                    stores={filteredStores}
                    selectedStore={selectedStore}
                    onStoreSelect={handleStoreSelect}
                    isLoading={isLoading}
                />
            </MapContainer>
        </PageContainer>
    );
};

export default MapPage;