import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiService from "../services/api.js";

// 가맹점 관련 API 함수들
const storesApi = {
  // 전체 가맹점 목록 조회
  getStores: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/api/stores${queryParams ? `?${queryParams}` : ""}`;
    return await apiService.get(endpoint);
  },

  // 주변 가맹점 검색
  getNearbyStores: async ({
    latitude,
    longitude,
    radius = 1000,
    category = null,
  }) => {
    const params = {
      latitude,
      longitude,
      radius,
      ...(category && { category }),
    };
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/api/stores/nearby?${queryParams}`;
    return await apiService.get(endpoint);
  },

  // 가맹점 검색
  searchStores: async ({ query, category = null, page = 1, size = 20 }) => {
    const params = { query, page, size, ...(category && { category }) };
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/api/stores/search?${queryParams}`;
    return await apiService.get(endpoint);
  },

  // 가맹점 상세 정보 조회
  getStoreDetail: async (storeId) => {
    const endpoint = `/api/stores/${storeId}`;
    return await apiService.get(endpoint);
  },

  // 카테고리별 가맹점 조회
  getStoresByCategory: async (category, params = {}) => {
    const queryParams = new URLSearchParams({ category, ...params }).toString();
    const endpoint = `/api/stores/category?${queryParams}`;
    return await apiService.get(endpoint);
  },

  // 카테고리 목록 조회
  getCategories: async () => {
    const endpoint = "/api/stores/categories";
    return await apiService.get(endpoint);
  },
};

// 전체 가맹점 목록 조회 훅
export const useStores = (params = {}) => {
  return useQuery({
    queryKey: ["stores", "list", params],
    queryFn: () => storesApi.getStores(params),
    staleTime: 5 * 60 * 1000, // 5분간 신선한 데이터로 간주
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  });
};

// 주변 가맹점 검색 훅
export const useNearbyStores = ({
  latitude,
  longitude,
  radius = 1000,
  category = null,
}) => {
  return useQuery({
    queryKey: ["stores", "nearby", { latitude, longitude, radius, category }],
    queryFn: () =>
      storesApi.getNearbyStores({ latitude, longitude, radius, category }),
    enabled: !!latitude && !!longitude, // 위도, 경도가 있을 때만 실행
    staleTime: 2 * 60 * 1000, // 2분간 신선한 데이터로 간주
  });
};

// 가맹점 검색 훅
export const useSearchStores = ({
  query,
  category = null,
  page = 1,
  size = 20,
}) => {
  return useQuery({
    queryKey: ["stores", "search", { query, category, page, size }],
    queryFn: () => storesApi.searchStores({ query, category, page, size }),
    enabled: !!query, // 검색어가 있을 때만 실행
    staleTime: 2 * 60 * 1000, // 2분간 신선한 데이터로 간주
  });
};

// 가맹점 상세 정보 조회 훅
export const useStoreDetail = (storeId) => {
  return useQuery({
    queryKey: ["stores", "detail", storeId],
    queryFn: () => storesApi.getStoreDetail(storeId),
    enabled: !!storeId, // storeId가 있을 때만 실행
    staleTime: 10 * 60 * 1000, // 10분간 신선한 데이터로 간주
  });
};

// 카테고리별 가맹점 조회 훅
export const useStoresByCategory = (category, params = {}) => {
  return useQuery({
    queryKey: ["stores", "category", category, params],
    queryFn: () => storesApi.getStoresByCategory(category, params),
    enabled: !!category, // 카테고리가 있을 때만 실행
    staleTime: 5 * 60 * 1000, // 5분간 신선한 데이터로 간주
  });
};

// 카테고리 목록 조회 훅
export const useCategories = () => {
  return useQuery({
    queryKey: ["stores", "categories"],
    queryFn: storesApi.getCategories,
    staleTime: 30 * 60 * 1000, // 30분간 신선한 데이터로 간주 (카테고리는 자주 변경되지 않음)
  });
};

// 가맹점 데이터 프리페치 훅 (선택사항)
export const usePrefetchStoreDetail = () => {
  const queryClient = useQueryClient();

  return (storeId) => {
    queryClient.prefetchQuery({
      queryKey: ["stores", "detail", storeId],
      queryFn: () => storesApi.getStoreDetail(storeId),
      staleTime: 10 * 60 * 1000,
    });
  };
};

// 가맹점 캐시 무효화 훅 (선택사항)
export const useInvalidateStores = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["stores"] });
  };
};
