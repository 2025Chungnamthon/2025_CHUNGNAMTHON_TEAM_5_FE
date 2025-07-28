import { useEffect, useRef, useCallback, useState } from "react";
import { CHEONAN_CENTER } from "../../../utils/locationUtils";

// 지도 설정 상수
const MAP_OPTIONS = {
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
  minLevel: 1, // 최소 줌 레벨 (1: 전국 단위)
  maxLevel: 5, // 최대 줌 레벨 (5: 구 단위)
};

const BOUNDS_CHANGE_DELAY = 300;
const KAKAO_MAP_TIMEOUT = 10000;
const KAKAO_MAP_CHECK_INTERVAL = 100;

export function useKakaoMap(mapRef, onBoundsChange, currentLocation) {
  const mapInstanceRef = useRef(null);
  const boundsChangeTimeoutRef = useRef(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapError, setMapError] = useState(null);

  // 카카오맵 API 로딩 확인
  const waitForKakaoMap = useCallback(() => {
    return new Promise((resolve, reject) => {
      const checkKakaoMap = () => {
        if (window.kakao && window.kakao.maps) {
          resolve();
        } else {
          setTimeout(checkKakaoMap, KAKAO_MAP_CHECK_INTERVAL);
        }
      };
      checkKakaoMap();

      setTimeout(() => {
        reject(new Error("카카오맵 API 로딩 타임아웃"));
      }, KAKAO_MAP_TIMEOUT);
    });
  }, []);

  // 지도 중심 위치 계산
  const getCenterPosition = useCallback(() => {
    if (currentLocation) {
      return new window.kakao.maps.LatLng(
        currentLocation.latitude,
        currentLocation.longitude
      );
    }
    return new window.kakao.maps.LatLng(
      CHEONAN_CENTER.latitude,
      CHEONAN_CENTER.longitude
    );
  }, [currentLocation]);

  // 지도 줌 레벨 계산
  const getZoomLevel = useCallback(() => {
    return currentLocation ? 5 : 8;
  }, [currentLocation]);

  // bounds 변경 이벤트 핸들러
  const handleBoundsChange = useCallback(
    (map) => {
      if (!onBoundsChange) return;

      window.kakao.maps.event.addListener(map, "idle", () => {
        if (boundsChangeTimeoutRef.current) {
          clearTimeout(boundsChangeTimeoutRef.current);
        }

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
        }, BOUNDS_CHANGE_DELAY);
      });
    },
    [onBoundsChange]
  );

  // 카카오맵 초기화
  const initializeMap = useCallback(async () => {
    try {
      await waitForKakaoMap();

      const container = mapRef.current;
      if (!container) {
        throw new Error("지도 컨테이너를 찾을 수 없습니다.");
      }

      const centerPosition = getCenterPosition();
      const zoomLevel = getZoomLevel();

      const options = {
        center: centerPosition,
        level: zoomLevel,
        ...MAP_OPTIONS,
      };

      const map = new window.kakao.maps.Map(container, options);
      mapInstanceRef.current = map;

      // 지도 로딩 완료 이벤트 리스너 추가
      window.kakao.maps.event.addListener(map, "tilesloaded", () => {
        setIsMapLoading(false);
      });

      // 줌 레벨 제한 강제 적용
      const enforceZoomLimits = () => {
        const currentLevel = map.getLevel();
        if (currentLevel < 1) {
          map.setLevel(1);
        } else if (currentLevel > 5) {
          map.setLevel(5);
        }
      };

      // 줌 변경 이벤트 리스너 추가
      window.kakao.maps.event.addListener(
        map,
        "zoom_changed",
        enforceZoomLimits
      );

      handleBoundsChange(map);

      // 지도가 완전히 로드될 때까지 기다림
      setTimeout(() => {
        if (isMapLoading) {
          setIsMapLoading(false);
        }
      }, 2000);

      return map;
    } catch (error) {
      console.error("카카오맵 초기화 실패:", error);
      setMapError(error.message);
      setIsMapLoading(false);
      return null;
    }
  }, [
    waitForKakaoMap,
    getCenterPosition,
    getZoomLevel,
    handleBoundsChange,
    mapRef,
    isMapLoading,
  ]);

  // 컴포넌트 마운트 시 지도 초기화
  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  return {
    mapInstanceRef,
    isMapLoading,
    mapError,
  };
}
