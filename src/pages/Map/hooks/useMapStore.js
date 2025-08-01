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
  const [hasInitialData, setHasInitialData] = useState(false);
  // 위치 권한 관련 상태 추가
  const [locationPermissionError, setLocationPermissionError] = useState(false);

  // 가맹점 데이터 로드
  const loadStores = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsSearchMode(false);

    try {
      const response = await storeApi.getStores();

      // 백엔드 API 응답 구조에 맞게 데이터 변환
      // response.data가 객체이고 실제 데이터는 response.data.content에 있음
      const storeData = response.data?.content || response.data || [];
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
        // 제휴업체 여부
        isAffiliate: store.isAffiliate || false,
      }));

      setStores(transformedStores);
      setHasInitialData(true);
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

      // 백엔드 API 응답 구조에 맞게 데이터 변환
      // response.data가 객체이고 실제 데이터는 response.data.content에 있음
      const storeData = response.data?.content || response.data || [];
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
        // 제휴업체 여부
        isAffiliate: store.isAffiliate || false,
      }));

      setStores(transformedStores);
      setHasInitialData(true);
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

        // 백엔드 API 응답 구조에 맞게 데이터 변환
        // response.data가 객체이고 실제 데이터는 response.data.content에 있음
        const searchResults = response.data?.content || response.data || [];

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
          // 제휴업체 여부
          isAffiliate: store.isAffiliate || false,
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

  // 검색어 기반 필터링 및 제휴업체 우선 정렬 (클라이언트 사이드)
  const filteredStores = useMemo(() => {
    let filtered = stores;

    // 검색어가 있고 검색 모드가 아닌 경우 필터링
    if (searchQuery.trim() && !isSearchMode) {
      const query = searchQuery.toLowerCase();
      filtered = stores.filter(
        (store) =>
          store.name.toLowerCase().includes(query) ||
          (store.category && store.category.toLowerCase().includes(query)) ||
          store.address.toLowerCase().includes(query)
      );
    }

    // 제휴업체를 우선적으로 정렬
    return filtered.sort((a, b) => {
      // 제휴업체가 아닌 경우를 먼저 처리
      if (!a.isAffiliate && !b.isAffiliate) return 0;
      if (!a.isAffiliate && b.isAffiliate) return 1; // a가 제휴업체가 아니면 뒤로
      if (a.isAffiliate && !b.isAffiliate) return -1; // a가 제휴업체면 앞으로
      return 0; // 둘 다 제휴업체이거나 둘 다 제휴업체가 아닌 경우 순서 유지
    });
  }, [stores, searchQuery, isSearchMode]);

  // 가맹점 선택 핸들러 - 같은 가맹점을 다시 클릭하면 선택 해제
  const handleStoreSelect = useCallback(
    (store) => {
      // 같은 가맹점을 다시 클릭한 경우 선택 해제
      if (selectedStore && selectedStore.id === store.id) {
        setSelectedStore(null);
      } else {
        setSelectedStore(store);
      }
    },
    [selectedStore]
  );

  // 위치 업데이트 핸들러 - 현재 위치가 이미 설정되어 있으면 변경하지 않음
  const handleLocationUpdate = useCallback(
    (location) => {
      // 현재 위치가 이미 설정되어 있으면 변경하지 않음 (고정)
      if (currentLocation) {
        return;
      }
      setCurrentLocation(location);
    },
    [currentLocation]
  );

  // 현재 위치 가져오기
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      console.warn("이 브라우저는 위치 서비스를 지원하지 않습니다.");
      return;
    }

    setIsLoading(true);
    setLocationPermissionError(false); // 에러 상태 초기화

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
        // 에러 메시지를 더 구체적으로 표시
        let errorMessage = "현재 위치를 가져올 수 없습니다.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.";
            setLocationPermissionError(true); // 위치 권한 에러 상태 설정
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다.";
            break;
          case error.TIMEOUT:
            errorMessage = "위치 정보 요청 시간이 초과되었습니다.";
            break;
          default:
            errorMessage = "위치 정보를 가져오는 중 오류가 발생했습니다.";
        }
        console.warn(errorMessage);
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

        // response.data가 객체이고 실제 데이터는 response.data.content에 있음
        const nearbyResults = response.data?.content || response.data || [];
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
          // 제휴업체 여부
          isAffiliate: store.isAffiliate || false,
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

  // 컴포넌트 마운트 시 초기 데이터 로드 및 현재 위치 가져오기
  useEffect(() => {
    loadStores();
    // 페이지 진입 시 현재 위치 자동 가져오기
    getCurrentLocation();
  }, [loadStores, getCurrentLocation]);

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
    hasInitialData,
    locationPermissionError, // 위치 권한 에러 상태 추가

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
    setLocationPermissionError, // 위치 권한 에러 상태 설정 함수 추가
  };
};
