import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useLayoutEffect,
} from "react";
import styled from "styled-components";

const MapWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 150px); // adjust as needed based on layout
  position: relative;
  background: #f8f9fa;
  overflow: hidden;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #666;
  font-size: 16px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #ef4444;
  font-size: 14px;
  padding: 20px;
`;

const KakaoMap = React.memo(
  ({
    stores,
    selectedStore,
    currentLocation,
    onStoreSelect,
    onLocationUpdate,
  }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);
    const infoWindowRef = useRef(null);
    const currentLocationMarkerRef = useRef(null);

    const [mapStatus, setMapStatus] = useState("loading"); // loading, success, error

    // 카카오맵 스크립트 동적 로드 및 지도 초기화
    useLayoutEffect(() => {
      let checkInterval;
      let timeoutTimer;

      const loadKakaoMapScript = () => {
        return new Promise((resolve, reject) => {
          // 이미 로드되어 있는지 확인
          if (window.kakao && window.kakao.maps) {
            resolve();
            return;
          }

          const script = document.createElement("script");
          script.type = "text/javascript";
          script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
            import.meta.env.VITE_KAKAO_MAP_KEY
          }&autoload=false`;
          script.onload = () => {
            window.kakao.maps.load(() => {
              resolve();
            });
          };
          script.onerror = () => {
            reject(new Error("카카오맵 스크립트 로드 실패"));
          };
          document.head.appendChild(script);
        });
      };

      const initializeMap = () => {
        if (!window.kakao || !window.kakao.maps) {
          return false;
        }

        if (!mapRef.current) {
          return false;
        }

        // 컨테이너가 DOM에 실제로 마운트되었는지 확인
        if (!document.contains(mapRef.current)) {
          return false;
        }

        // 컨테이너의 크기가 0인지 확인
        const rect = mapRef.current.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          return false;
        }

        try {
          const container = mapRef.current;
          const options = {
            center: new window.kakao.maps.LatLng(36.8151, 127.1139),
            level: 3,
          };

          mapInstanceRef.current = new window.kakao.maps.Map(
            container,
            options
          );

          // 지도 클릭 시 인포윈도우 닫기
          window.kakao.maps.event.addListener(
            mapInstanceRef.current,
            "click",
            () => {
              if (infoWindowRef.current) {
                infoWindowRef.current.close();
              }
            }
          );

          setMapStatus("success");
          return true;
        } catch (error) {
          setMapStatus("error");
          return false;
        }
      };

      const initMap = async () => {
        try {
          setMapStatus("loading");
          await loadKakaoMapScript();

          // 스크립트 로드 후 지도 초기화 시도
          if (initializeMap()) {
            return;
          }

          // 지도 컨테이너가 준비되지 않았다면 반복 체크
          checkInterval = setInterval(() => {
            if (initializeMap()) {
              clearInterval(checkInterval);
              clearTimeout(timeoutTimer);
            }
          }, 500);

          // 30초 후 타임아웃
          timeoutTimer = setTimeout(() => {
            clearInterval(checkInterval);
            setMapStatus("error");
          }, 30000);
        } catch (error) {
          setMapStatus("error");
        }
      };

      initMap();

      return () => {
        if (checkInterval) clearInterval(checkInterval);
        if (timeoutTimer) clearTimeout(timeoutTimer);
      };
    }, []);

    // 마커 생성 함수
    const createMarker = useCallback(
      (store, index) => {
        if (!window.kakao?.maps || !mapInstanceRef.current) return null;

        try {
          const position = new window.kakao.maps.LatLng(
            store.latitude,
            store.longitude
          );

          const markerImage = new window.kakao.maps.MarkerImage(
            `data:image/svg+xml;base64,${btoa(`
                    <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="14" fill="#80c7bc" stroke="#fff" stroke-width="2"/>
                        <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${
                          index + 1
                        }</text>
                    </svg>
                `)}`,
            new window.kakao.maps.Size(32, 32),
            { offset: new window.kakao.maps.Point(16, 16) }
          );

          const marker = new window.kakao.maps.Marker({
            position,
            image: markerImage,
          });

          // 마커 클릭 이벤트
          window.kakao.maps.event.addListener(marker, "click", () => {
            onStoreSelect(store);

            if (infoWindowRef.current) {
              infoWindowRef.current.close();
            }

            infoWindowRef.current = new window.kakao.maps.InfoWindow({
              content: `
                        <div style="padding: 8px; min-width: 150px; font-family: inherit;">
                            <div style="font-weight: 600; margin-bottom: 4px; font-size: 14px; color: #333;">${store.name}</div>
                            <div style="font-size: 12px; color: #80c7bc;">${store.category}</div>
                        </div>
                    `,
              removable: true,
            });

            infoWindowRef.current.open(mapInstanceRef.current, marker);
            mapInstanceRef.current.setCenter(position);
          });

          return marker;
        } catch (error) {
          return null;
        }
      },
      [onStoreSelect]
    );

    // 마커 업데이트
    useEffect(() => {
      if (mapStatus !== "success" || !stores) return;

      // 기존 마커 제거
      markersRef.current.forEach((marker) => {
        if (marker) marker.setMap(null);
      });
      markersRef.current = [];

      // 새 마커 생성
      stores.forEach((store, index) => {
        const marker = createMarker(store, index);
        if (marker) {
          marker.setMap(mapInstanceRef.current);
          markersRef.current.push(marker);
        }
      });
    }, [stores, createMarker, mapStatus]);

    // 현재 위치 마커 업데이트
    useEffect(() => {
      if (mapStatus !== "success" || !currentLocation) return;

      try {
        if (currentLocationMarkerRef.current) {
          currentLocationMarkerRef.current.setMap(null);
        }

        const position = new window.kakao.maps.LatLng(
          currentLocation.latitude,
          currentLocation.longitude
        );

        const currentLocationImage = new window.kakao.maps.MarkerImage(
          `data:image/svg+xml;base64,${btoa(`
                    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="8" fill="#4285f4" stroke="#fff" stroke-width="2"/>
                        <circle cx="10" cy="10" r="3" fill="#fff"/>
                    </svg>
                `)}`,
          new window.kakao.maps.Size(20, 20),
          { offset: new window.kakao.maps.Point(10, 10) }
        );

        currentLocationMarkerRef.current = new window.kakao.maps.Marker({
          position,
          image: currentLocationImage,
        });

        currentLocationMarkerRef.current.setMap(mapInstanceRef.current);
        mapInstanceRef.current.setCenter(position);
        mapInstanceRef.current.setLevel(2);
      } catch (error) {}
    }, [currentLocation, mapStatus]);

    // 컴포넌트 언마운트 시 정리
    useEffect(() => {
      return () => {
        markersRef.current.forEach((marker) => {
          if (marker) marker.setMap(null);
        });
        if (currentLocationMarkerRef.current) {
          currentLocationMarkerRef.current.setMap(null);
        }
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
      };
    }, []);

    // 상태별 렌더링
    if (mapStatus === "loading") {
      return (
        <MapWrapper>
          <LoadingMessage>
            🗺️ 지도를 불러오는 중...
            <br />
            <small>(최대 30초 소요)</small>
          </LoadingMessage>
        </MapWrapper>
      );
    }

    if (mapStatus === "error") {
      return (
        <MapWrapper>
          <ErrorMessage>
            ❌ 지도를 불러올 수 없습니다
            <br />
            <small>네트워크 연결을 확인해주세요</small>
            <br />
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
        </MapWrapper>
      );
    }

    return (
      <MapWrapper>
        <div
          ref={mapRef}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </MapWrapper>
    );
  }
);

KakaoMap.displayName = "KakaoMap";

export default KakaoMap;
