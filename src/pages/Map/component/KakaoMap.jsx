import React, { useEffect, useRef, useState, useCallback } from "react";
import styled from "styled-components";
import {
  geocodeAddress,
  CHEONAN_CENTER,
  refineAddress,
  createAlternativeAddress,
} from "../../../utils/locationUtils";
import MapControls from "./MapControls";
import StoreInfoWindow from "./StoreInfoWindow";

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const LoadingText = styled.div`
  color: #666;
  font-size: 14px;
`;

const ErrorOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 14px;
  text-align: center;
  padding: 20px;
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
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const infowindowsRef = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [geocodedStores, setGeocodedStores] = useState([]);
  const [clickedMarkerId, setClickedMarkerId] = useState(null);
  const boundsChangeTimeoutRef = useRef(null);

  // 카카오맵 API 로딩 확인
  const waitForKakaoMap = useCallback(() => {
    return new Promise((resolve, reject) => {
      const checkKakaoMap = () => {
        if (window.kakao && window.kakao.maps) {
          resolve();
        } else {
          setTimeout(checkKakaoMap, 100);
        }
      };
      checkKakaoMap();

      setTimeout(() => {
        reject(new Error("카카오맵 API 로딩 타임아웃"));
      }, 10000);
    });
  }, []);

  // 카카오맵 초기화
  const initializeMap = useCallback(async () => {
    try {
      await waitForKakaoMap();

      const container = mapRef.current;
      if (!container) {
        throw new Error("지도 컨테이너를 찾을 수 없습니다.");
      }

      // 현재 위치가 있으면 현재 위치를 중심으로, 없으면 천안 중심으로 설정
      const centerPosition = currentLocation
        ? new window.kakao.maps.LatLng(
            currentLocation.latitude,
            currentLocation.longitude
          )
        : new window.kakao.maps.LatLng(
            CHEONAN_CENTER.latitude,
            CHEONAN_CENTER.longitude
          );

      const options = {
        center: centerPosition,
        level: currentLocation ? 5 : 8, // 현재 위치가 있으면 더 가까운 줌 레벨
        draggable: true,
        scrollwheel: true,
        disableDoubleClick: true,
        disableDoubleTapZoom: true,
        keyboardShortcuts: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        overviewMapControl: false,
      };

      const map = new window.kakao.maps.Map(container, options);
      mapInstanceRef.current = map;
      setIsMapLoading(false);

      // 지도 이동/줌 완료 시 bounds 변경 감지
      if (onBoundsChange) {
        window.kakao.maps.event.addListener(map, "idle", () => {
          // 디바운싱을 위해 이전 타임아웃 취소
          if (boundsChangeTimeoutRef.current) {
            clearTimeout(boundsChangeTimeoutRef.current);
          }

          // 300ms 후에 bounds 변경 이벤트 발생
          boundsChangeTimeoutRef.current = setTimeout(() => {
            const bounds = map.getBounds();
            const swLat = bounds.getSouthWest().getLat();
            const swLng = bounds.getSouthWest().getLng();
            const neLat = bounds.getNorthEast().getLat();
            const neLng = bounds.getNorthEast().getLng();

            onBoundsChange({
              swLat,
              swLng,
              neLat,
              neLng,
            });
          }, 300);
        });
      }

      return map;
    } catch (error) {
      console.error("카카오맵 초기화 실패:", error);
      setMapError(error.message);
      setIsMapLoading(false);
      return null;
    }
  }, [waitForKakaoMap, onBoundsChange]);

  // 가맹점 정보를 HTML로 변환
  const createStoreInfoContent = useCallback((store) => {
    return StoreInfoWindow({ store });
  }, []);

  // 마커 클릭 핸들러
  const handleMarkerClick = useCallback((storeId, infowindow) => {
    // 다른 마커의 인포윈도우 닫기
    infowindowsRef.current.forEach((infowindow) => {
      if (infowindow) {
        infowindow.close();
      }
    });
    setClickedMarkerId(storeId);
  }, []);

  // 마커 생성
  const createMarker = useCallback(
    (store, map) => {
      if (!store.latitude || !store.longitude) return null;

      const position = new window.kakao.maps.LatLng(
        store.latitude,
        store.longitude
      );

      const imageSrc =
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png";
      const imageSize = new window.kakao.maps.Size(31, 35);
      const imageOption = { offset: new window.kakao.maps.Point(27, 69) };

      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );

      const marker = new window.kakao.maps.Marker({
        position: position,
        map: map,
        image: markerImage,
      });

      const infowindow = new window.kakao.maps.InfoWindow({
        content: createStoreInfoContent(store),
        removable: false,
        zIndex: 1,
      });

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, "click", () => {
        onStoreSelect(store);
        handleMarkerClick(store.id, infowindow);
        infowindow.open(map, marker);
      });

      // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록
      window.kakao.maps.event.addListener(marker, "mouseover", () => {
        infowindow.open(map, marker);
      });

      window.kakao.maps.event.addListener(marker, "mouseout", () => {
        if (clickedMarkerId !== store.id) {
          infowindow.close();
        }
      });

      return { marker, infowindow };
    },
    [onStoreSelect, createStoreInfoContent, handleMarkerClick, clickedMarkerId]
  );

  // 주소를 좌표로 변환
  const geocodeStores = useCallback(async (storesToGeocode) => {
    if (!window.kakao || !window.kakao.maps) {
      console.warn("카카오맵 API가 로드되지 않아 주소 변환을 건너뜁니다.");
      setGeocodedStores(storesToGeocode);
      return;
    }

    setIsLoading(true);
    const geocoded = [];

    for (const store of storesToGeocode) {
      try {
        if (store.latitude && store.longitude) {
          geocoded.push(store);
          continue;
        }

        if (store.address) {
          const refinedAddress = refineAddress(store.address);

          try {
            const result = await geocodeAddress(refinedAddress);
            geocoded.push({
              ...store,
              latitude: result.latitude,
              longitude: result.longitude,
            });
          } catch (geocodeError) {
            console.warn(
              `주소 변환 실패 (${store.name}):`,
              geocodeError.message
            );

            try {
              const alternativeAddress = createAlternativeAddress(
                store.address
              );
              const alternativeResult = await geocodeAddress(
                alternativeAddress
              );
              geocoded.push({
                ...store,
                latitude: alternativeResult.latitude,
                longitude: alternativeResult.longitude,
              });
              console.log(
                `대체 주소로 변환 성공 (${store.name}): ${alternativeAddress}`
              );
            } catch (alternativeError) {
              console.warn(
                `대체 주소 변환도 실패 (${store.name}):`,
                alternativeError.message
              );
              geocoded.push({
                ...store,
                latitude:
                  CHEONAN_CENTER.latitude + (Math.random() - 0.5) * 0.01,
                longitude:
                  CHEONAN_CENTER.longitude + (Math.random() - 0.5) * 0.01,
              });
            }
          }
        } else {
          geocoded.push({
            ...store,
            latitude: CHEONAN_CENTER.latitude + (Math.random() - 0.5) * 0.01,
            longitude: CHEONAN_CENTER.longitude + (Math.random() - 0.5) * 0.01,
          });
        }

        await new Promise((resolve) => setTimeout(resolve, 150));
      } catch (error) {
        console.warn(`주소 변환 실패 (${store.name}):`, error.message);
        geocoded.push({
          ...store,
          latitude: CHEONAN_CENTER.latitude + (Math.random() - 0.5) * 0.01,
          longitude: CHEONAN_CENTER.longitude + (Math.random() - 0.5) * 0.01,
        });
      }
    }

    setGeocodedStores(geocoded);
    setIsLoading(false);
  }, []);

  // 마커 업데이트
  const updateMarkers = useCallback(
    (stores, map) => {
      if (!map) return;

      markersRef.current.forEach(({ marker }) => {
        if (marker) {
          marker.setMap(null);
        }
      });
      infowindowsRef.current.forEach((infowindow) => {
        if (infowindow) {
          infowindow.close();
        }
      });

      markersRef.current = [];
      infowindowsRef.current = [];

      stores.forEach((store) => {
        const markerData = createMarker(store, map);
        if (markerData) {
          markersRef.current.push(markerData);
          infowindowsRef.current.push(markerData.infowindow);
        }
      });
    },
    [createMarker]
  );

  // 선택된 가맹점 마커 강조
  const highlightSelectedStore = useCallback((selectedStore, map) => {
    if (!selectedStore || !map) return;

    markersRef.current.forEach(({ marker }) => {
      if (marker) {
        marker.setImage(
          new window.kakao.maps.MarkerImage(
            "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
            new window.kakao.maps.Size(31, 35),
            { offset: new window.kakao.maps.Point(27, 69) }
          )
        );
      }
    });

    const selectedMarkerData = markersRef.current.find(({ marker }) => {
      if (!marker) return false;
      const position = marker.getPosition();
      return (
        position.getLat() === selectedStore.latitude &&
        position.getLng() === selectedStore.longitude
      );
    });

    if (selectedMarkerData) {
      selectedMarkerData.marker.setImage(
        new window.kakao.maps.MarkerImage(
          "/UI/Subtract.png",
          new window.kakao.maps.Size(31, 35),
          { offset: new window.kakao.maps.Point(27, 69) }
        )
      );

      const position = new window.kakao.maps.LatLng(
        selectedStore.latitude,
        selectedStore.longitude
      );
      map.panTo(position);

      selectedMarkerData.infowindow.open(map, selectedMarkerData.marker);
      setClickedMarkerId(selectedStore.id);
    }
  }, []);

  // 현재 위치 마커 표시
  const showCurrentLocation = useCallback((location, map) => {
    if (!location || !map) return;

    const position = new window.kakao.maps.LatLng(
      location.latitude,
      location.longitude
    );

    // 현재 위치 마커 생성
    const currentLocationMarker = new window.kakao.maps.Marker({
      position: position,
      map: map,
      image: new window.kakao.maps.MarkerImage(
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
        new window.kakao.maps.Size(24, 35),
        { offset: new window.kakao.maps.Point(12, 35) }
      ),
    });

    // 3초 후 마커 제거
    setTimeout(() => {
      currentLocationMarker.setMap(null);
    }, 3000);

    // 지도 중심을 현재 위치로 이동
    map.panTo(position);

    // 줌 레벨 조정 (현재 위치 주변을 더 잘 보이도록)
    map.setLevel(5);
  }, []);

  // 컴포넌트 마운트 시 지도 초기화 (현재 위치 변경 시에도 재초기화)
  useEffect(() => {
    initializeMap();
  }, [initializeMap, currentLocation]);

  // 가맹점 데이터 변경 시 마커 업데이트
  useEffect(() => {
    if (mapInstanceRef.current && geocodedStores.length > 0) {
      updateMarkers(geocodedStores, mapInstanceRef.current);
    }
  }, [geocodedStores, updateMarkers]);

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

  // 초기 가맹점 데이터가 있으면 마커 생성
  useEffect(() => {
    if (mapInstanceRef.current && stores.length > 0 && !isMapLoading) {
      geocodeStores(stores);
    }
  }, [stores, isMapLoading, geocodeStores]);

  if (mapError) {
    return (
      <MapContainer>
        <ErrorOverlay>
          <ErrorText>
            <div>❌ 지도를 불러올 수 없습니다</div>
            <div style={{ marginTop: "8px", fontSize: "12px" }}>{mapError}</div>
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
          </ErrorText>
        </ErrorOverlay>
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
      {(isLoading || isMapLoading) && (
        <LoadingOverlay>
          <LoadingText>
            {isMapLoading
              ? "지도를 불러오는 중..."
              : "가맹점 위치를 찾는 중..."}
          </LoadingText>
        </LoadingOverlay>
      )}
    </MapContainer>
  );
};

export default KakaoMap;
