import { useRef, useCallback } from "react";
import StoreInfoWindow from "../component/StorePopup";

// 마커 이미지 설정 상수
const MARKER_IMAGES = {
  default: "/UI/Subtract.png",
  selected: "/UI/Subtract.png",
  affiliate: "/UI/specialstore.png",
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
    background: "linear-gradient(135deg, #80c7bc, #6bb3a8)",
    borderRadius: "50%",
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "14px",
    lineHeight: "40px",
    border: "3px solid #fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  {
    width: "50px",
    height: "50px",
    background: "linear-gradient(135deg, #6bb3a8, #5a9a8f)",
    borderRadius: "50%",
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "16px",
    lineHeight: "50px",
    border: "3px solid #fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  {
    width: "60px",
    height: "60px",
    background: "linear-gradient(135deg, #5a9a8f, #4a8a7f)",
    borderRadius: "50%",
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "18px",
    lineHeight: "60px",
    border: "3px solid #fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
];

export const useMarkers = () => {
  const markersRef = useRef([]);
  const infowindowsRef = useRef([]);
  const clickedMarkerIdRef = useRef(null);
  const clustererRef = useRef(null);
  const currentOpenInfowindowRef = useRef(null);

  // 가맹점 정보를 HTML로 변환
  const createStoreInfoContent = useCallback((store) => {
    return StoreInfoWindow({ store });
  }, []);

  // 마커 이미지 생성
  const createMarkerImage = useCallback((imageSrc, size = "default") => {
    try {
      const { width, height, offset } = MARKER_SIZES[size];

      if (!imageSrc) {
        return null;
      }

      return new window.kakao.maps.MarkerImage(
        imageSrc,
        new window.kakao.maps.Size(width, height),
        { offset: new window.kakao.maps.Point(offset.x, offset.y) }
      );
    } catch (error) {
      return null;
    }
  }, []);

  // 클러스터러 초기화
  const initializeClusterer = useCallback((map) => {
    if (!map || clustererRef.current) return;

    if (!window.kakao) {
      return;
    }

    if (!window.kakao.maps) {
      return;
    }

    if (!window.kakao.maps.MarkerClusterer) {
      const checkMarkerClusterer = () => {
        if (window.kakao.maps.MarkerClusterer) {
          initializeClusterer(map);
        } else {
          setTimeout(checkMarkerClusterer, 100);
        }
      };
      checkMarkerClusterer();
      return;
    }

    try {
      clustererRef.current = new window.kakao.maps.MarkerClusterer({
        map: map,
        averageCenter: true,
        minLevel: 3,
        gridSize: 60,
        minClusterSize: 2,
        calculator: [10, 30, 50, 100, 200],
        styles: CLUSTER_STYLES,
        disableClickZoom: false,
        hoverable: true,
      });

      window.kakao.maps.event.addListener(
        clustererRef.current,
        "clusterclick",
        (cluster) => {
          const markers = cluster.getMarkers();

          const validMarkers = markers.filter((marker) => {
            const position = marker.getPosition();
            return (
              position &&
              !isNaN(position.getLat()) &&
              !isNaN(position.getLng()) &&
              position.getLat() !== 0 &&
              position.getLng() !== 0
            );
          });

          if (validMarkers.length === 0) {
            return;
          }

          const bounds = new window.kakao.maps.LatLngBounds();

          validMarkers.forEach((marker) => {
            bounds.extend(marker.getPosition());
          });

          const sw = bounds.getSouthWest();
          const ne = bounds.getNorthEast();

          if (
            isNaN(sw.getLat()) ||
            isNaN(sw.getLng()) ||
            isNaN(ne.getLat()) ||
            isNaN(ne.getLng())
          ) {
            return;
          }

          // 클러스터 클릭 시 부드러운 줌 애니메이션
          map.setBounds(bounds, {
            padding: [50, 50, 50, 50], // 상하좌우 패딩 추가
          });

          // 적절한 줌 레벨로 조정
          setTimeout(() => {
            const currentLevel = map.getLevel();
            const markerCount = validMarkers.length;

            // 마커 개수에 따라 적절한 줌 레벨 설정
            let targetLevel;
            if (markerCount <= 5) {
              targetLevel = Math.min(currentLevel + 2, 5);
            } else if (markerCount <= 15) {
              targetLevel = Math.min(currentLevel + 1, 4);
            } else {
              targetLevel = Math.max(currentLevel - 1, 2);
            }

            map.setLevel(targetLevel);
          }, 300);
        }
      );
    } catch (error) {
      // 클러스터러 초기화 실패 시 무시
    }
  }, []);

  // 마커 클릭 핸들러
  const handleMarkerClick = useCallback((storeId, infowindow, marker, map) => {
    // 현재 열린 인포윈도우가 있다면 닫기
    if (currentOpenInfowindowRef.current) {
      currentOpenInfowindowRef.current.close();
    }

    // 같은 마커를 다시 클릭한 경우 닫기
    if (clickedMarkerIdRef.current === storeId) {
      clickedMarkerIdRef.current = null;
      currentOpenInfowindowRef.current = null;
      return;
    }

    // 새로운 마커 클릭 시 인포윈도우 열기
    clickedMarkerIdRef.current = storeId;
    currentOpenInfowindowRef.current = infowindow;
    infowindow.open(map, marker);
  }, []);

  // 마커 생성
  const createMarker = useCallback(
    (store, map, onStoreSelect) => {
      if (!store.latitude || !store.longitude) {
        return null;
      }

      const position = new window.kakao.maps.LatLng(
        store.latitude,
        store.longitude
      );

      // isAffiliate 속성에 따라 마커 이미지 결정
      const markerImageSrc = store.isAffiliate
        ? MARKER_IMAGES.affiliate
        : MARKER_IMAGES.default;
      const markerImage = createMarkerImage(markerImageSrc);

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
          handleMarkerClick(store.id, infowindow, marker, map);
        });

        window.kakao.maps.event.addListener(marker, "mouseover", () => {
          // 마우스오버 시에는 인포윈도우를 열지 않음
        });

        window.kakao.maps.event.addListener(marker, "mouseout", () => {
          // 마우스아웃 시에도 인포윈도우를 닫지 않음
        });
      };

      addMarkerEventListeners();

      return { marker, infowindow };
    },
    [createStoreInfoContent, createMarkerImage, handleMarkerClick]
  );

  // 기존 마커들 정리
  const clearMarkers = useCallback(() => {
    // 클러스터러에서 마커 제거
    if (clustererRef.current) {
      clustererRef.current.clear();
    }

    // 개별 마커들도 정리 (클러스터러가 없는 경우를 대비)
    markersRef.current.forEach(({ marker }) => {
      if (marker) {
        marker.setMap(null);
      }
    });

    // 인포윈도우들 닫기
    infowindowsRef.current.forEach((infowindow) => {
      if (infowindow) {
        infowindow.close();
      }
    });

    // 참조 정리
    markersRef.current = [];
    infowindowsRef.current = [];
    clickedMarkerIdRef.current = null;
    currentOpenInfowindowRef.current = null;
  }, []);

  // 마커 업데이트
  const updateMarkers = useCallback(
    (stores, map, onStoreSelect) => {
      if (!map) {
        return;
      }

      clearMarkers();

      // 클러스터러 초기화
      initializeClusterer(map);

      const markers = [];
      stores.forEach((store) => {
        const markerData = createMarker(store, map, onStoreSelect);
        if (markerData) {
          markers.push(markerData.marker);
          markersRef.current.push({ ...markerData, store }); // store 정보도 함께 저장
          infowindowsRef.current.push(markerData.infowindow);
        }
      });

      // 클러스터러가 있으면 클러스터러에 마커 추가, 없으면 지도에 직접 추가
      if (clustererRef.current) {
        clustererRef.current.addMarkers(markers);
      } else {
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
      if (!map) return;

      // selectedStore가 null인 경우 모든 마커를 기본 상태로 되돌리고 팝업 닫기
      if (!selectedStore) {
        // 모든 마커를 기본 이미지로 리셋
        markersRef.current.forEach(({ marker, store }) => {
          if (marker) {
            const markerImageSrc = store?.isAffiliate
              ? MARKER_IMAGES.affiliate
              : MARKER_IMAGES.default;
            marker.setImage(createMarkerImage(markerImageSrc));
          }
        });

        // 열린 팝업 닫기
        if (currentOpenInfowindowRef.current) {
          currentOpenInfowindowRef.current.close();
          currentOpenInfowindowRef.current = null;
        }
        clickedMarkerIdRef.current = null;
        return;
      }

      // 모든 마커를 기본 이미지로 리셋
      markersRef.current.forEach(({ marker, store }) => {
        if (marker) {
          const markerImageSrc = store?.isAffiliate
            ? MARKER_IMAGES.affiliate
            : MARKER_IMAGES.default;
          marker.setImage(createMarkerImage(markerImageSrc));
        }
      });

      // 선택된 마커 찾기 및 강조 (좌표 비교를 더 정확하게)
      const selectedMarkerData = markersRef.current.find(({ marker }) => {
        if (!marker) return false;
        const position = marker.getPosition();
        const latDiff = Math.abs(position.getLat() - selectedStore.latitude);
        const lngDiff = Math.abs(position.getLng() - selectedStore.longitude);

        // 부동소수점 정밀도 문제를 고려하여 작은 차이는 허용
        return latDiff < 0.0001 && lngDiff < 0.0001;
      });

      if (selectedMarkerData) {
        // 선택된 마커는 selected 이미지로 강조하되, 제휴업체인 경우 affiliate 이미지 기반으로 선택
        const selectedImageSrc = selectedMarkerData.store?.isAffiliate
          ? MARKER_IMAGES.affiliate
          : MARKER_IMAGES.selected;
        selectedMarkerData.marker.setImage(createMarkerImage(selectedImageSrc));

        const position = new window.kakao.maps.LatLng(
          selectedStore.latitude,
          selectedStore.longitude
        );

        // 지도 중심을 선택된 마커로 이동 (부드러운 애니메이션)
        map.panTo(position);

        // 선택된 마커의 인포윈도우 열기
        if (currentOpenInfowindowRef.current) {
          currentOpenInfowindowRef.current.close();
        }
        selectedMarkerData.infowindow.open(map, selectedMarkerData.marker);
        clickedMarkerIdRef.current = selectedStore.id;
        currentOpenInfowindowRef.current = selectedMarkerData.infowindow;
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

      setTimeout(() => {
        currentLocationMarker.setMap(null);
      }, 3000);

      map.panTo(position);

      const targetLevel = 5;
      const minLevel = 3;
      const maxLevel = 19;
      const safeLevel = Math.max(minLevel, Math.min(maxLevel, targetLevel));
      map.setLevel(safeLevel);
    },
    [createMarkerImage]
  );

  return {
    updateMarkers,
    highlightSelectedStore,
    showCurrentLocation,
  };
};
