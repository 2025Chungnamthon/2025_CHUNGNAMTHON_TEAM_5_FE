// 쿠폰 관련 유틸리티 함수들

// 사용자 포인트 조회 (더미 데이터)
export const getUserPoints = () => {
  // 실제로는 API에서 가져와야 하지만, 현재는 더미 데이터 반환
  return 1620;
};

// 쿠폰 개수 조회 (더미 데이터)
export const getCouponCount = () => {
  // 실제로는 API에서 가져와야 하지만, 현재는 더미 데이터 반환
  return 3;
};

// 포인트를 포맷팅하는 함수
export const formatPoints = (points) => {
  return points.toLocaleString();
};

// 쿠폰 상태를 확인하는 함수
export const isCouponExpired = (expiryDate) => {
  if (!expiryDate) return false;

  const today = new Date();
  const expiry = new Date(expiryDate);

  return today > expiry;
};

// 쿠폰 사용 가능 여부 확인
export const isCouponUsable = (coupon) => {
  if (!coupon) return false;

  // 만료되지 않았고 사용되지 않은 쿠폰만 사용 가능
  return !isCouponExpired(coupon.expiry) && !coupon.used;
};
