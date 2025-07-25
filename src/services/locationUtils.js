// 위치 관련 유틸리티 함수들

// 위치 정보를 한국어로 변환하는 함수
export const getLocationKorean = (location) => {
  if (!location) return "위치 정보 없음";

  // location이 문자열인 경우 그대로 반환
  if (typeof location === "string") {
    return location;
  }

  // location이 객체인 경우 주소 정보 추출
  if (typeof location === "object") {
    return location.address || location.name || "위치 정보 없음";
  }

  return "위치 정보 없음";
};

// 위도, 경도로 거리 계산 (Haversine 공식)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // 지구 반지름 (미터)
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// 거리를 사람이 읽기 쉬운 형태로 변환
export const formatDistance = (distanceInMeters) => {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)}m`;
  } else {
    return `${(distanceInMeters / 1000).toFixed(1)}km`;
  }
};
