import { useState, useCallback } from "react";
import {
  geocodeAddress,
  CHEONAN_CENTER,
  refineAddress,
  createAlternativeAddress,
} from "../../../utils/locationUtils";

// 지오코딩 설정 상수
const GEOCODING_DELAY = 150;
const RANDOM_OFFSET = 0.01;

// 랜덤 좌표 생성
const generateRandomCoordinates = () => ({
  latitude: CHEONAN_CENTER.latitude + (Math.random() - 0.5) * RANDOM_OFFSET,
  longitude: CHEONAN_CENTER.longitude + (Math.random() - 0.5) * RANDOM_OFFSET,
});

// 주소 변환 시도
const attemptGeocoding = async (address, storeName) => {
  try {
    const refinedAddress = refineAddress(address);
    const result = await geocodeAddress(refinedAddress);
    return result;
  } catch (error) {
    console.warn(`주소 변환 실패 (${storeName}):`, error.message);

    // 대체 주소로 재시도
    try {
      const alternativeAddress = createAlternativeAddress(address);
      const alternativeResult = await geocodeAddress(alternativeAddress);
      console.log(
        `대체 주소로 변환 성공 (${storeName}): ${alternativeAddress}`
      );
      return alternativeResult;
    } catch (alternativeError) {
      console.warn(
        `대체 주소 변환도 실패 (${storeName}):`,
        alternativeError.message
      );
      throw alternativeError;
    }
  }
};

export const useGeocodeStores = () => {
  const [isLoading, setIsLoading] = useState(false);

  // 주소를 좌표로 변환
  const geocodeStores = useCallback(async (storesToGeocode) => {
    if (!window.kakao || !window.kakao.maps) {
      console.warn("카카오맵 API가 로드되지 않아 주소 변환을 건너뜁니다.");
      return storesToGeocode;
    }

    setIsLoading(true);
    const geocoded = [];

    for (const store of storesToGeocode) {
      try {
        // 이미 좌표가 있는 경우
        if (store.latitude && store.longitude) {
          geocoded.push(store);
          continue;
        }

        // 주소가 있는 경우 지오코딩 시도
        if (store.address) {
          try {
            const result = await attemptGeocoding(store.address, store.name);
            geocoded.push({
              ...store,
              latitude: result.latitude,
              longitude: result.longitude,
            });
          } catch (geocodeError) {
            // 지오코딩 실패 시 랜덤 좌표 사용
            geocoded.push({
              ...store,
              ...generateRandomCoordinates(),
            });
          }
        } else {
          // 주소가 없는 경우 랜덤 좌표 사용
          geocoded.push({
            ...store,
            ...generateRandomCoordinates(),
          });
        }

        await new Promise((resolve) => setTimeout(resolve, GEOCODING_DELAY));
      } catch (error) {
        console.warn(`주소 변환 실패 (${store.name}):`, error.message);
        geocoded.push({
          ...store,
          ...generateRandomCoordinates(),
        });
      }
    }

    setIsLoading(false);
    return geocoded;
  }, []);

  return {
    geocodeStores,
    isLoading,
  };
};
