// 쿠폰 관련 더미 데이터 (실제 연동 시 API로 대체)
export const getExchangeCoupons = () => [
  {
    id: 1,
    title: "도리하다 5000원 할인 쿠폰",
    points: 5000,
    expiry: "기한: 발급일로부터 30일 이내",
  },
  {
    id: 2,
    title: "도리하다 5000원 할인 쿠폰",
    points: 5000,
    expiry: "기한: 발급일로부터 30일 이내",
  },
  {
    id: 3,
    title: "도리하다 5000원 할인 쿠폰",
    points: 5000,
    expiry: "기한: 발급일로부터 30일 이내",
  },
  {
    id: 4,
    title: "도리하다 5000원 할인 쿠폰",
    points: 5000,
    expiry: "기한: 발급일로부터 30일 이내",
  },
  {
    id: 5,
    title: "도리하다 5000원 할인 쿠폰",
    points: 5000,
    expiry: "기한: 발급일로부터 30일 이내",
  },
  {
    id: 6,
    title: "도리하다 5000원 할인 쿠폰",
    points: 5000,
    expiry: "기한: 발급일로부터 30일 이내",
  },
];

export const getMyCoupons = () => [
  {
    id: 1,
    title: "도리하다 5000원 할인 쿠폰",
    points: 5000,
    expiry: "2025.08.28까지 사용가능",
  },
  {
    id: 2,
    title: "도리하다 5000원 할인 쿠폰",
    points: 5000,
    expiry: "2025.08.28까지 사용가능",
  },
  {
    id: 3,
    title: "도리하다 5000원 할인 쿠폰",
    points: 5000,
    expiry: "2025.08.28까지 사용가능",
  },
];

// 쿠폰 개수 계산 함수
export const getCouponCount = () => {
  return getMyCoupons().length;
};

// 사용자 포인트 (실제 연동 시 API 사용)
export const getUserPoints = () => {
  return 1620;
};
