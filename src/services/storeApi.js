import { useAuthStore } from "../stores/authStore";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://43.200.175.218:8080";

// 개발용 더미 데이터 (API 연동 전까지 사용)
const DUMMY_STORES = [
  {
    id: 1,
    name: "봉담방동대엽마켓휘이천안신부점",
    category: "의료기기/제약",
    address: "충남 천안시 동남구 신부동",
    phoneNumber: "041-555-0426",
    latitude: 36.8151,
    longitude: 127.1139,
    businessHours: "09:00-22:00",
    isOpen: true,
  },
  {
    id: 2,
    name: "랑스터디카페천안터미널점",
    category: "학원",
    address: "충남 천안시 동남구 만남로 32",
    phoneNumber: "041-555-0426",
    latitude: 36.8121,
    longitude: 127.1189,
    businessHours: "08:00-24:00",
    isOpen: true,
  },
  {
    id: 3,
    name: "천안역 CGV",
    category: "영화관",
    address: "충남 천안시 동남구 역전6길",
    phoneNumber: "041-555-1234",
    latitude: 36.8095,
    longitude: 127.1478,
    businessHours: "10:00-24:00",
    isOpen: true,
  },
  {
    id: 4,
    name: "신세계백화점 천안점",
    category: "백화점",
    address: "충남 천안시 서북구 신세계6길",
    phoneNumber: "041-555-5678",
    latitude: 36.8176,
    longitude: 127.1136,
    businessHours: "10:30-20:00",
    isOpen: true,
  },
  {
    id: 5,
    name: "이마트 천안점",
    category: "대형마트",
    address: "충남 천안시 서북구 두정동",
    phoneNumber: "041-555-9999",
    latitude: 36.819,
    longitude: 127.1145,
    businessHours: "10:00-23:00",
    isOpen: true,
  },
  {
    id: 6,
    name: "스타벅스 천안터미널점",
    category: "카페",
    address: "충남 천안시 동남구 만남로 45",
    phoneNumber: "041-555-1111",
    latitude: 36.813,
    longitude: 127.119,
    businessHours: "07:00-23:00",
    isOpen: true,
  },
  {
    id: 7,
    name: "롯데마트 천안점",
    category: "대형마트",
    address: "충남 천안시 서북구 공단로 123",
    phoneNumber: "041-555-2222",
    latitude: 36.82,
    longitude: 127.115,
    businessHours: "10:00-24:00",
    isOpen: true,
  },
  {
    id: 8,
    name: "올리브영 천안터미널점",
    category: "화장품",
    address: "충남 천안시 동남구 만남로 67",
    phoneNumber: "041-555-3333",
    latitude: 36.814,
    longitude: 127.12,
    businessHours: "10:00-22:00",
    isOpen: true,
  },
  {
    id: 9,
    name: "다이소 천안점",
    category: "생활용품",
    address: "충남 천안시 서북구 공단로 89",
    phoneNumber: "041-555-4444",
    latitude: 36.821,
    longitude: 127.116,
    businessHours: "10:00-22:00",
    isOpen: true,
  },
  {
    id: 10,
    name: "버거킹 천안터미널점",
    category: "패스트푸드",
    address: "충남 천안시 동남구 만남로 89",
    phoneNumber: "041-555-5555",
    latitude: 36.815,
    longitude: 127.121,
    businessHours: "10:00-22:00",
    isOpen: true,
  },
  {
    id: 11,
    name: "맥도날드 천안점",
    category: "패스트푸드",
    address: "충남 천안시 서북구 공단로 156",
    phoneNumber: "041-555-6666",
    latitude: 36.822,
    longitude: 127.117,
    businessHours: "10:00-22:00",
    isOpen: true,
  },
  {
    id: 12,
    name: "GS25 천안터미널점",
    category: "편의점",
    address: "충남 천안시 동남구 만남로 111",
    phoneNumber: "041-555-7777",
    latitude: 36.816,
    longitude: 127.122,
    businessHours: "24시간",
    isOpen: true,
  },
  {
    id: 13,
    name: "CU 천안점",
    category: "편의점",
    address: "충남 천안시 서북구 공단로 223",
    phoneNumber: "041-555-8888",
    latitude: 36.823,
    longitude: 127.118,
    businessHours: "24시간",
    isOpen: true,
  },
  {
    id: 14,
    name: "세븐일레븐 천안터미널점",
    category: "편의점",
    address: "충남 천안시 동남구 만남로 133",
    phoneNumber: "041-555-9999",
    latitude: 36.817,
    longitude: 127.123,
    businessHours: "24시간",
    isOpen: true,
  },
  {
    id: 15,
    name: "롯데리아 천안점",
    category: "패스트푸드",
    address: "충남 천안시 서북구 공단로 290",
    phoneNumber: "041-555-0000",
    latitude: 36.824,
    longitude: 127.119,
    businessHours: "10:00-22:00",
    isOpen: true,
  },
];

// 거리 계산 함수
const calculateDistance = (lat1, lon1, lat2, lon2) => {
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

// 기존 API 클래스 구조 유지
class StoreApiService {
  // 전체 가맹점 목록 조회
  async getStores(params = {}) {
    const token = useAuthStore.getState().accessToken;
    try {
      // 실제 API 호출 시도
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
        }/api/merchants${
          new URLSearchParams(params).toString()
            ? `?${new URLSearchParams(params).toString()}`
            : ""
        }`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log("API 연결 실패, 더미 데이터 사용");
    }

    // 더미 데이터 반환
    return {
      data: DUMMY_STORES,
      pagination: {
        page: 1,
        size: 20,
        totalElements: DUMMY_STORES.length,
        totalPages: 1,
      },
    };
  }

  // 주변 가맹점 검색
  async getNearbyStores({
    latitude,
    longitude,
    radius = 1000,
    category = null,
  }) {
    const token = useAuthStore.getState().accessToken;
    try {
      const params = {
        latitude,
        longitude,
        radius,
        ...(category && { category }),
      };
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
        }/api/affiliate-stores?${new URLSearchParams(params).toString()}`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log("주변 검색용 더미 데이터 사용");
    }

    // 거리 계산하여 더미 데이터 필터링
    const filteredStores = DUMMY_STORES.filter((store) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        store.latitude,
        store.longitude
      );
      return distance <= radius;
    });

    return {
      data: filteredStores,
      searchInfo: {
        centerLatitude: latitude,
        centerLongitude: longitude,
        radius,
        totalCount: filteredStores.length,
      },
    };
  }

  // 가맹점 검색
  async searchStores({ query, category = null, page = 1, size = 20 }) {
    const token = useAuthStore.getState().accessToken;
    try {
      const params = {
        keyword: query,
        page,
        size,
        ...(category && { category }),
      };
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
        }/api/search?${new URLSearchParams(params).toString()}`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log("검색용 더미 데이터 사용");
    }

    // 더미 데이터에서 검색
    const filteredStores = DUMMY_STORES.filter(
      (store) =>
        store.name.toLowerCase().includes(query.toLowerCase()) ||
        store.category.toLowerCase().includes(query.toLowerCase()) ||
        store.address.toLowerCase().includes(query.toLowerCase())
    );

    return {
      data: filteredStores,
      pagination: {
        page: 1,
        size: 20,
        totalElements: filteredStores.length,
        totalPages: 1,
      },
    };
  }

  // 가맹점 상세 정보 조회
  async getStoreDetail(storeId) {
    const token = useAuthStore.getState().accessToken;
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
        }/api/merchants/${storeId}`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log("상세 정보용 더미 데이터 사용");
    }

    const store = DUMMY_STORES.find((s) => s.id === parseInt(storeId, 10));
    return {
      data: store || null,
    };
  }

  // 카테고리별 가맹점 조회
  async getStoresByCategory(category, params = {}) {
    const token = useAuthStore.getState().accessToken;
    try {
      const queryParams = new URLSearchParams({
        category,
        ...params,
      }).toString();
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
        }/api/merchants?${queryParams}`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log("카테고리 검색용 더미 데이터 사용");
    }

    const filteredStores = DUMMY_STORES.filter((store) =>
      store.category.toLowerCase().includes(category.toLowerCase())
    );

    return {
      data: filteredStores,
    };
  }

  // 카테고리 목록 조회
  async getCategories() {
    const token = useAuthStore.getState().accessToken;
    try {
      // const response = await fetch(
      //   `${
      //     import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
      //   }/api/stores/categories`,
      //   {
      //     headers: {
      //       ...(token && { Authorization: `Bearer ${token}` }),
      //     },
      //   }
      // );
      // if (response.ok) {
      //   return await response.json();
      // }
    } catch (error) {
      console.log("카테고리 목록용 더미 데이터 사용");
    }

    const categories = [
      ...new Set(DUMMY_STORES.map((store) => store.category)),
    ];
    return {
      data: categories,
    };
  }

  // 키워드 기반 스토어 검색 (search bar용)
  async searchStoresByKeyword(keyword) {
    const token = useAuthStore.getState().accessToken;
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
        }/api/search?keyword=${encodeURIComponent(keyword)}`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error("키워드 검색 실패:", error);
    }

    // 더미 데이터에서 더 정확한 검색
    const keywordLower = keyword.toLowerCase();
    const filtered = DUMMY_STORES.filter((store) => {
      const nameMatch = store.name.toLowerCase().includes(keywordLower);
      const categoryMatch = store.category.toLowerCase().includes(keywordLower);
      const addressMatch = store.address.toLowerCase().includes(keywordLower);

      return nameMatch || categoryMatch || addressMatch;
    });

    console.log(`검색어 "${keyword}"에 대한 결과: ${filtered.length}개`);
    return {
      data: filtered,
    };
  }

  // bounds 기반 가맹점 조회 (지도 영역 내 가맹점)
  async getStoresByBounds({ swLat, swLng, neLat, neLng }) {
    const token = useAuthStore.getState().accessToken;
    try {
      const params = {
        swLat,
        swLng,
        neLat,
        neLng,
      };
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"
        }/api/merchants/bounds?${new URLSearchParams(params).toString()}`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log("bounds 검색용 더미 데이터 사용");
    }

    // 더미 데이터에서 bounds 내 가맹점 필터링
    const filteredStores = DUMMY_STORES.filter((store) => {
      return (
        store.latitude >= swLat &&
        store.latitude <= neLat &&
        store.longitude >= swLng &&
        store.longitude <= neLng
      );
    });

    return {
      data: filteredStores,
      bounds: {
        swLat,
        swLng,
        neLat,
        neLng,
      },
      totalCount: filteredStores.length,
    };
  }
}

export const storeApi = new StoreApiService();
