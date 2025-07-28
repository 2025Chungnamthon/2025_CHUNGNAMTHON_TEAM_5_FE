import { useRef, useCallback } from "react";
import StoreInfoWindow from "../component/StorePopup";

// 마커 이미지 설정 상수
const MARKER_IMAGES = {
  default: "/UI/Subtract.png",
  selected: "/UI/Subtract.png",
  currentLocation:
    "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
};

const MARKER_SIZES = {
  default: { width: 31, height: 35, offset: { x: 27, y: 69 } },
  currentLocation: { width: 24, height: 35, offset: { x: 12, y: 35 } },
};

// 클러스터 스타일 설정
const CLUSTER_STYLES = [
  {
    width: "40px",
    height: "40px",
    background: "#80c7bc",
    borderRadius: "50%",
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "14px",
    lineHeight: "40px",
    border: "2px solid #fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
  },
  {
    width: "50px",
    height: "50px",
    background: "#6bb3a8",
    borderRadius: "50%",
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "16px",
    lineHeight: "50px",
    border: "2px solid #fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
  },
  {
    width: "60px",
    height: "60px",
    background: "#5a9a8f",
    borderRadius: "50%",
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "18px",
    lineHeight: "60px",
    border: "2px solid #fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
  },
];

export const useMarkers = () => {
  const markersRef = useRef([]);
  const infowindowsRef = useRef([]);
  const clickedMarkerIdRef = useRef(null);
  const clustererRef = useRef(null);

  // 가맹점 정보를 HTML로 변환
  const createStoreInfoContent = useCallback((store) => {
    return StoreInfoWindow({ store });
  }, []);

  // 마커 이미지 생성
  const createMarkerImage = useCallback((imageSrc, size = "default") => {
    const { width, height, offset } = MARKER_SIZES[size];
    return new window.kakao.maps.MarkerImage(
      imageSrc,
      new window.kakao.maps.Size(width, height),
      { offset: new window.kakao.maps.Point(offset.x, offset.y) }
    );
  }, []);

  // 클러스터러 초기화
  const initializeClusterer = useCallback((map) => {
    if (!map || clustererRef.current) return;

    // MarkerClusterer가 사용 가능한지 확인 (더 상세한 체크)
    if (!window.kakao) {
      console.warn("Kakao Maps SDK not loaded");
      return;
    }

    if (!window.kakao.maps) {
      console.warn("Kakao Maps API not available");
      return;
    }

    if (!window.kakao.maps.MarkerClusterer) {
      console.warn(
        "MarkerClusterer is not available, falling back to regular markers"
      );
      console.log(
        "Available kakao.maps properties:",
        Object.keys(window.kakao.maps)
      );

      // MarkerClusterer가 로드될 때까지 기다리기
      const checkMarkerClusterer = () => {
        if (window.kakao.maps.MarkerClusterer) {
          console.log(
            "MarkerClusterer now available, retrying initialization..."
          );
          initializeClusterer(map);
        } else {
          setTimeout(checkMarkerClusterer, 100);
        }
      };
      checkMarkerClusterer();
      return;
    }

    try {
      console.log("Initializing MarkerClusterer...");

      // 공식 문서에 따른 클러스터러 생성
      clustererRef.current = new window.kakao.maps.MarkerClusterer({
        map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
        averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
        minLevel: 3, // 클러스터 할 최소 지도 레벨 (더 확대된 상태에서도 클러스터링)
        gridSize: 60, // 클러스터 그리드 크기
        minClusterSize: 2, // 최소 클러스터 크기
        calculator: [10, 30, 50, 100, 200], // 클러스터 크기별 계산
      });

      console.log("MarkerClusterer initialized successfully");

      // 클러스터 클릭 이벤트 처리
      window.kakao.maps.event.addListener(
        clustererRef.current,
        "clusterclick",
        (cluster) => {
          const markers = cluster.getMarkers();
          const bounds = new window.kakao.maps.LatLngBounds();

          markers.forEach((marker) => {
            bounds.extend(marker.getPosition());
          });

          map.setBounds(bounds);
        }
      );
    } catch (error) {
      console.error("Failed to initialize MarkerClusterer:", error);
      console.error("Error details:", error.message, error.stack);
    }
  }, []);

  // 마커 클릭 핸들러
  const handleMarkerClick = useCallback((storeId, infowindow) => {
    infowindowsRef.current.forEach((infowindow) => {
      if (infowindow) {
        infowindow.close();
      }
    });
    clickedMarkerIdRef.current = storeId;
  }, []);

  // 마커 생성 (클러스터링용)
  const createMarker = useCallback(
    (store, map, onStoreSelect) => {
      if (!store.latitude || !store.longitude) return null;

      const position = new window.kakao.maps.LatLng(
        store.latitude,
        store.longitude
      );

      const markerImage = createMarkerImage(MARKER_IMAGES.default);

      // 공식 문서에 따라 지도 객체를 설정하지 않고 마커 생성
      const marker = new window.kakao.maps.Marker({
        position: position,
        image: markerImage,
        shadow: null,
      });

      const infowindow = new window.kakao.maps.InfoWindow({
        content: createStoreInfoContent(store),
        removable: false,
        zIndex: 1,
      });

      // 마커 이벤트 리스너 등록
      const addMarkerEventListeners = () => {
        window.kakao.maps.event.addListener(marker, "click", () => {
          onStoreSelect(store);
          handleMarkerClick(store.id, infowindow);
          infowindow.open(map, marker);
        });

        window.kakao.maps.event.addListener(marker, "mouseover", () => {
          infowindow.open(map, marker);
        });

        window.kakao.maps.event.addListener(marker, "mouseout", () => {
          if (clickedMarkerIdRef.current !== store.id) {
            infowindow.close();
          }
        });
      };

      addMarkerEventListeners();

      return { marker, infowindow };
    },
    [createStoreInfoContent, createMarkerImage, handleMarkerClick]
  );

  // 기존 마커들 정리
  const clearMarkers = useCallback(() => {
    if (clustererRef.current) {
      clustererRef.current.clear();
    }

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
  }, []);

  // 마커 업데이트 (클러스터링 적용)
  const updateMarkers = useCallback(
    (stores, map, onStoreSelect) => {
      if (!map) return;

      // 클러스터러 초기화
      initializeClusterer(map);

      clearMarkers();

      const markers = [];
      stores.forEach((store) => {
        const markerData = createMarker(store, map, onStoreSelect);
        if (markerData) {
          markers.push(markerData.marker);
          markersRef.current.push(markerData);
          infowindowsRef.current.push(markerData.infowindow);
        }
      });

      // 공식 문서에 따라 클러스터러에 마커들을 추가
      if (clustererRef.current && markers.length > 0) {
        console.log(`Adding ${markers.length} markers to clusterer`);
        clustererRef.current.addMarkers(markers);
        console.log("Markers added to clusterer successfully");
      } else {
        console.log("Clusterer not available, using regular markers");
        // 클러스터러가 없으면 일반 마커로 표시
        markers.forEach((marker) => {
          marker.setMap(map);
        });
      }
    },
    [createMarker, clearMarkers, initializeClusterer]
  );

  // 선택된 가맹점 마커 강조
  const highlightSelectedStore = useCallback(
    (selectedStore, map) => {
      if (!selectedStore || !map) return;

      // 모든 마커를 기본 이미지로 리셋
      markersRef.current.forEach(({ marker }) => {
        if (marker) {
          marker.setImage(createMarkerImage(MARKER_IMAGES.default));
        }
      });

      // 선택된 마커 찾기 및 강조
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
          createMarkerImage(MARKER_IMAGES.selected)
        );

        const position = new window.kakao.maps.LatLng(
          selectedStore.latitude,
          selectedStore.longitude
        );
        map.panTo(position);

        selectedMarkerData.infowindow.open(map, selectedMarkerData.marker);
        clickedMarkerIdRef.current = selectedStore.id;
      }
    },
    [createMarkerImage]
  );

  // 현재 위치 마커 표시
  const showCurrentLocation = useCallback(
    (location, map) => {
      if (!location || !map) return;

      const position = new window.kakao.maps.LatLng(
        location.latitude,
        location.longitude
      );

      const currentLocationMarker = new window.kakao.maps.Marker({
        position: position,
        map: map,
        image: createMarkerImage(
          MARKER_IMAGES.currentLocation,
          "currentLocation"
        ),
        shadow: null,
      });

      // 3초 후 마커 제거
      setTimeout(() => {
        currentLocationMarker.setMap(null);
      }, 3000);

      // 지도 중심을 현재 위치로 이동
      map.panTo(position);
      map.setLevel(5);
    },
    [createMarkerImage]
  );

  return {
    updateMarkers,
    highlightSelectedStore,
    showCurrentLocation,
  };
};
