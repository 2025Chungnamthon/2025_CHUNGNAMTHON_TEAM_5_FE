import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../stores/authStore";
import apiService from "../services/api.js";

// 쿠폰 관련 API 함수들
const couponsApi = {
  // 교환 가능한 쿠폰 목록 조회
  getExchangeCoupons: async () => {
    const response = await apiService.get("/api/coupons/exchange");
    return response;
  },

  // 내 쿠폰 목록 조회
  getMyCoupons: async () => {
    const response = await apiService.get("/api/coupons/my");
    return response;
  },

  // 쿠폰 교환
  exchangeCoupon: async (couponId) => {
    const response = await apiService.post("/api/coupons/exchange", {
      couponId,
    });
    return response;
  },

  // 사용자 포인트 조회
  getUserPoints: async () => {
    const response = await apiService.get("/api/user/points");
    return response;
  },

  // 포인트 히스토리 조회
  getPointHistory: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/api/user/points/history${
      queryParams ? `?${queryParams}` : ""
    }`;
    const response = await apiService.get(endpoint);
    return response;
  },
};

// 교환 가능한 쿠폰 목록 조회 훅
export const useExchangeCoupons = () => {
  return useQuery({
    queryKey: ["coupons", "exchange"],
    queryFn: couponsApi.getExchangeCoupons,
    staleTime: 5 * 60 * 1000, // 5분간 신선한 데이터로 간주
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  });
};

// 내 쿠폰 목록 조회 훅
export const useMyCoupons = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["coupons", "my"],
    queryFn: couponsApi.getMyCoupons,
    enabled: isAuthenticated, // 인증된 경우에만 실행
    staleTime: 2 * 60 * 1000, // 2분간 신선한 데이터로 간주
  });
};

// 쿠폰 교환 뮤테이션 훅
export const useExchangeCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: couponsApi.exchangeCoupon,
    onSuccess: () => {
      // 쿠폰 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("쿠폰 교환 실패:", error);
    },
  });
};

// 사용자 포인트 조회 훅
export const useUserPoints = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["user", "points"],
    queryFn: couponsApi.getUserPoints,
    enabled: isAuthenticated, // 인증된 경우에만 실행
    staleTime: 1 * 60 * 1000, // 1분간 신선한 데이터로 간주
  });
};

// 포인트 히스토리 조회 훅
export const usePointHistory = (params = {}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["user", "points", "history", params],
    queryFn: () => couponsApi.getPointHistory(params),
    enabled: isAuthenticated, // 인증된 경우에만 실행
    staleTime: 5 * 60 * 1000, // 5분간 신선한 데이터로 간주
  });
};

// 쿠폰 개수 계산 훅
export const useCouponCount = () => {
  const { data: myCoupons } = useMyCoupons();

  return {
    count: myCoupons?.data?.length || 0,
    isLoading: !myCoupons,
  };
};

// 개발용 더미 데이터 (API 연동 전까지 사용)
export const useDummyCoupons = () => {
  const exchangeCoupons = [
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

  const myCoupons = [
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

  return {
    exchangeCoupons: { data: exchangeCoupons },
    myCoupons: { data: myCoupons },
    userPoints: { data: { points: 1620 } },
  };
};
