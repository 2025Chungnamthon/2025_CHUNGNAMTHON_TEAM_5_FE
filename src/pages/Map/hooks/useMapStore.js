import { useState, useEffect, useCallback, useMemo } from "react";
import { storeApi } from "../../../services/storeApi";

export const useMapStore = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [currentBounds, setCurrentBounds] = useState(null);

  // 가맹점 데이터 로드
  const loadStores = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsSearchMode(false);

    try {
      const response = await storeApi.getStores();
      console.log("가맹점 데이터 로드 성공:", response);

      // 백엔드 API 응답 구조에 맞게 데이터 변환
      const storeData = response.data || [];
      const transformedStores = storeData.map((store, index) => ({
        id: store.id || store.merchantSeq || index + 1,
        merchantSeq: store.merchantSeq,
        name: store.name || store.storeName || `가맹점 ${index + 1}`,
        address: store.address || store.storeAddress || "",
        tel: store.tel || store.phoneNumber || store.telephone || null,
        category: store.category || "기타",
        // 기존 더미 데이터와의 호환성을 위한 필드들
        phoneNumber: store.tel || store.phoneNumber || store.telephone || null,
        businessHours: store.businessHours || "09:00-18:00",
        isOpen: store.isOpen !== undefined ? store.isOpen : true,
        // 좌표 정보 (백엔드 API 명세에 맞게 lat, lng 사용)
        latitude: store.lat || store.latitude || null,
        longitude: store.lng || store.longitude || null,
      }));

      setStores(transformedStores);
    } catch (err) {
      console.error("가맹점 데이터 로드 실패:", err);
      setError(`가맹점 정보를 불러올 수 없습니다: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // bounds 기반 가맹점 조회
  const loadStoresByBounds = useCallback(async (bounds) => {
    if (!bounds) return;

    setIsLoading(true);
    setError(null);
    setIsSearchMode(false);
    setCurrentBounds(bounds);

    try {
      const response = await storeApi.getStoresByBounds(bounds);
      console.log("bounds 기반 가맹점 조회 성공:", response);

      // 백엔드 API 응답 구조에 맞게 데이터 변환
      const storeData = response.data || [];
      const transformedStores = storeData.map((store, index) => ({
        id: store.id || store.merchantSeq || index + 1,
        merchantSeq: store.merchantSeq,
        name: store.name || store.storeName || `가맹점 ${index + 1}`,
        address: store.address || store.storeAddress || "",
        tel: store.tel || store.phoneNumber || store.telephone || null,
        category: store.category || "기타",
        phoneNumber: store.tel || store.phoneNumber || store.telephone || null,
        businessHours: store.businessHours || "09:00-18:00",
        isOpen: store.isOpen !== undefined ? store.isOpen : true,
        latitude: store.lat || store.latitude || null,
        longitude: store.lng || store.longitude || null,
      }));

      setStores(transformedStores);
    } catch (err) {
      console.error("bounds 기반 가맹점 조회 실패:", err);
      setError(`해당 영역의 가맹점 정보를 불러올 수 없습니다: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 검색어 입력값 업데이트 (실시간)
  const handleSearchInputChange = useCallback(
    (value) => {
      setSearchQuery(value);
      if (!value.trim()) {
        setIsSearchMode(false);
        // 검색어가 비어있으면 현재 bounds로 다시 조회
        if (currentBounds) {
          loadStoresByBounds(currentBounds);
        } else {
          loadStores();
        }
      }
    },
    [loadStores, loadStoresByBounds, currentBounds]
  );

  // 키워드로 가맹점 검색 (검색 실행)
  const searchStoresByKeyword = useCallback(
    async (keyword) => {
      if (!keyword.trim()) {
        if (currentBounds) {
          loadStoresByBounds(currentBounds);
        } else {
          loadStores();
        }
        return;
      }

      setIsLoading(true);
      setError(null);
      setIsSearchMode(true);

      try {
        const response = await storeApi.searchStoresByKeyword(keyword);
        console.log("서버 검색 결과:", response);

        // 백엔드 API 응답 구조에 맞게 데이터 변환
        const searchResults = response.data || [];

        // 검색 결과도 동일한 구조로 변환
        const transformedResults = searchResults.map((store, index) => ({
          id: store.id || store.merchantSeq || index + 1,
          merchantSeq: store.merchantSeq,
          name: store.name || store.storeName || `가맹점 ${index + 1}`,
          address: store.address || store.storeAddress || "",
          tel: store.tel || store.phoneNumber || store.telephone || null,
          category: store.category || "기타",
          phoneNumber:
            store.tel || store.phoneNumber || store.telephone || null,
          businessHours: store.businessHours || "09:00-18:00",
          isOpen: store.isOpen !== undefined ? store.isOpen : true,
          latitude: store.lat || store.latitude || null,
          longitude: store.lng || store.longitude || null,
        }));

        setStores(transformedResults);
      } catch (err) {
        console.error("검색 실패:", err);
        setError(`가맹점 검색에 실패했습니다: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [loadStores, loadStoresByBounds, currentBounds]
  );

  // 검색 실행 핸들러
  const handleSearch = useCallback(
    (query) => {
      setSelectedStore(null); // 검색 시 선택 해제
      searchStoresByKeyword(query);
    },
    [searchStoresByKeyword]
  );

  // 검색어 기반 필터링 (클라이언트 사이드)
  const filteredStores = useMemo(() => {
    if (!searchQuery.trim() || isSearchMode) return stores;

    const query = searchQuery.toLowerCase();
    return stores.filter(
      (store) =>
        store.name.toLowerCase().includes(query) ||
        (store.category && store.category.toLowerCase().includes(query)) ||
        store.address.toLowerCase().includes(query)
    );
  }, [stores, searchQuery, isSearchMode]);

  // 가맹점 선택 핸들러
  const handleStoreSelect = useCallback((store) => {
    setSelectedStore(store);
  }, []);

  // 위치 업데이트 핸들러
  const handleLocationUpdate = useCallback((location) => {
    setCurrentLocation(location);
  }, []);

  // 현재 위치 가져오기
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("이 브라우저는 위치 서비스를 지원하지 않습니다.");
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCurrentLocation(location);
        setIsLoading(false);
      },
      (error) => {
        console.error("위치 가져오기 실패:", error);
        alert("현재 위치를 가져올 수 없습니다.");
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5분
      }
    );
  }, []);

  // 주변 가맹점 검색
  const searchNearbyStores = useCallback(
    async (latitude, longitude, radius = 1000) => {
      setIsLoading(true);
      setError(null);
      setIsSearchMode(false);

      try {
        const response = await storeApi.getNearbyStores({
          latitude,
          longitude,
          radius,
        });

        const nearbyResults = response.data || [];
        const transformedResults = nearbyResults.map((store, index) => ({
          id: store.id || store.merchantSeq || index + 1,
          merchantSeq: store.merchantSeq,
          name: store.name || store.storeName || `가맹점 ${index + 1}`,
          address: store.address || store.storeAddress || "",
          tel: store.tel || store.phoneNumber || store.telephone || null,
          category: store.category || "기타",
          phoneNumber:
            store.tel || store.phoneNumber || store.telephone || null,
          businessHours: store.businessHours || "09:00-18:00",
          isOpen: store.isOpen !== undefined ? store.isOpen : true,
          latitude: store.lat || store.latitude || null,
          longitude: store.lng || store.longitude || null,
        }));

        setStores(transformedResults);
      } catch (err) {
        console.error("주변 가맹점 검색 실패:", err);
        setError(`주변 가맹점을 찾을 수 없습니다: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 가맹점 상세 정보 가져오기
  const getStoreDetail = useCallback(async (storeId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await storeApi.getStoreDetail(storeId);
      return response.data;
    } catch (err) {
      console.error("가맹점 상세 정보 로드 실패:", err);
      setError(`가맹점 상세 정보를 불러올 수 없습니다: ${err.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadStores();
  }, [loadStores]);

  // 현재 위치 변경 시 주변 가맹점 검색 - 자동 호출 제거
  // useEffect(() => {
  //   if (currentLocation) {
  //     searchNearbyStores(currentLocation.latitude, currentLocation.longitude);
  //   }
  // }, [currentLocation, searchNearbyStores]);

  return {
    // 상태
    stores,
    filteredStores,
    selectedStore,
    currentLocation,
    searchQuery,
    isLoading,
    error,
    isSearchMode,
    currentBounds,

    // 액션
    handleSearchInputChange,
    handleSearch,
    handleStoreSelect,
    handleLocationUpdate,
    getCurrentLocation,
    searchNearbyStores,
    getStoreDetail,
    loadStores,
    searchStoresByKeyword,
    loadStoresByBounds,
  };
};
