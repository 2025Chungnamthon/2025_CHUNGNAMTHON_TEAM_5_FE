import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import LoadingOverlay from "./LoadingOverlay";
import ErrorOverlay from "./ErrorOverlay";
import MapControls from "./MapControls";
import { useMarkers } from "../hooks/useMapMarkers";
import { useGeocodeStores } from "../hooks/useStoreGeocoding";
import { useKakaoMap } from "../hooks/useMapInitialization";

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const KakaoMap = ({
  stores = [],
  selectedStore,
  currentLocation,
  onStoreSelect,
  onLocationUpdate,
  onBoundsChange,
}) => {
  const mapRef = useRef(null);
  const [geocodedStores, setGeocodedStores] = useState([]);

  // 커스텀 훅들 사용
  const { mapInstanceRef, isMapLoading, mapError } = useKakaoMap(
    mapRef,
    onBoundsChange,
    currentLocation
  );
  const { geocodeStores, isLoading: isGeocoding } = useGeocodeStores();
  const { updateMarkers, highlightSelectedStore, showCurrentLocation } =
    useMarkers();

  // 가맹점 데이터 변경 시 지오코딩 및 마커 업데이트
  useEffect(() => {
    if (mapInstanceRef.current && stores.length > 0 && !isMapLoading) {
      const processStores = async () => {
        const geocoded = await geocodeStores(stores);
        setGeocodedStores(geocoded);
      };
      processStores();
    }
  }, [stores, isMapLoading, geocodeStores]);

  // 지오코딩된 가맹점 데이터 변경 시 마커 업데이트
  useEffect(() => {
    if (mapInstanceRef.current && geocodedStores.length > 0) {
      updateMarkers(geocodedStores, mapInstanceRef.current, onStoreSelect);
    }
  }, [geocodedStores, updateMarkers, onStoreSelect]);

  // 선택된 가맹점 변경 시 마커 강조
  useEffect(() => {
    if (mapInstanceRef.current && selectedStore) {
      highlightSelectedStore(selectedStore, mapInstanceRef.current);
    }
  }, [selectedStore, highlightSelectedStore]);

  // 현재 위치 변경 시 마커 표시
  useEffect(() => {
    if (mapInstanceRef.current && currentLocation) {
      showCurrentLocation(currentLocation, mapInstanceRef.current);
    }
  }, [currentLocation, showCurrentLocation]);

  if (mapError) {
    return (
      <MapContainer>
        <ErrorOverlay message={mapError} />
      </MapContainer>
    );
  }

  return (
    <MapContainer>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      <MapControls
        map={mapInstanceRef.current}
        onLocationUpdate={onLocationUpdate}
      />
      {(isGeocoding || isMapLoading) && (
        <LoadingOverlay
          text={
            isMapLoading ? "지도를 불러오는 중..." : "가맹점 위치를 찾는 중..."
          }
        />
      )}
    </MapContainer>
  );
};

export default KakaoMap;
