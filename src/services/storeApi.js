import { useAuthStore } from "../stores/authStore";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// 기존 API 클래스 구조 유지
class StoreApiService {
  // 전체 가맹점 목록 조회
  async getStores(params = {}) {
    const response = await fetch(
      `${API_BASE_URL}/api/merchants${
        new URLSearchParams(params).toString()
          ? `?${new URLSearchParams(params).toString()}`
          : ""
      }`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `API 호출 실패: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  }

  // 주변 가맹점 검색
  async getNearbyStores({
    latitude,
    longitude,
    radius = 1000,
    category = null,
  }) {
    const params = {
      latitude,
      longitude,
      radius,
      ...(category && { category }),
    };
    const response = await fetch(
      `${API_BASE_URL}/api/affiliate-stores?${new URLSearchParams(
        params
      ).toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `API 호출 실패: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  }

  // 가맹점 검색
  async searchStores({ query, category = null, page = 1, size = 20 }) {
    const params = {
      keyword: query,
      page,
      size,
      ...(category && { category }),
    };
    const response = await fetch(
      `${API_BASE_URL}/api/search?${new URLSearchParams(params).toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `API 호출 실패: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  }

  // 가맹점 상세 정보 조회
  async getStoreDetail(storeId) {
    const response = await fetch(`${API_BASE_URL}/api/merchants/${storeId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `API 호출 실패: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  }

  // 카테고리별 가맹점 조회
  async getStoresByCategory(category, params = {}) {
    const queryParams = new URLSearchParams({
      category,
      ...params,
    }).toString();
    const response = await fetch(
      `${API_BASE_URL}/api/merchants?${queryParams}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `API 호출 실패: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  }

  // 카테고리 목록 조회
  async getCategories() {
    const response = await fetch(`${API_BASE_URL}/api/stores/categories`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `API 호출 실패: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  }

  // 키워드 기반 스토어 검색 (search bar용)
  async searchStoresByKeyword(keyword) {
    const response = await fetch(
      `${API_BASE_URL}/api/search?keyword=${encodeURIComponent(keyword)}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `API 호출 실패: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  }

  // bounds 기반 가맹점 조회 (지도 영역 내 가맹점)
  async getStoresByBounds({ swLat, swLng, neLat, neLng }) {
    const params = {
      swLat,
      swLng,
      neLat,
      neLng,
    };
    const response = await fetch(
      `${API_BASE_URL}/api/merchants/range?${new URLSearchParams(
        params
      ).toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `API 호출 실패: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  }

  // 중심 좌표 기준 가맹점 조회 (기존 엔드포인트 사용, 프론트에서 필터링)
  async getStoresByCenter({ latitude, longitude, radius = 5000, limit = 50 }) {
    console.log("getStoresByCenter 호출:", {
      latitude,
      longitude,
      radius,
      limit,
    });

    // 기존 전체 가맹점 조회 엔드포인트 사용
    const response = await fetch(`${API_BASE_URL}/api/merchants`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `API 호출 실패: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const allStores = data.data?.content || data.data || [];
    console.log("전체 가맹점 데이터:", allStores.length, "개");

    // 프론트에서 중심 좌표 기준으로 필터링
    const filteredStores = allStores
      .filter((store) => {
        if (!store.lat || !store.lng) {
          console.log("좌표가 없는 가맹점 제외:", store.name);
          return false;
        }

        // 중심 좌표로부터의 거리 계산
        const distance = this.calculateDistance(
          latitude,
          longitude,
          store.lat,
          store.lng
        );

        const isWithinRadius = distance <= radius / 1000; // radius를 km 단위로 변환
        console.log(
          `가맹점 ${store.name}: 거리 ${distance.toFixed(
            2
          )}km, 반경 내: ${isWithinRadius}`
        );

        return isWithinRadius;
      })
      .sort((a, b) => {
        // 거리순으로 정렬
        const distanceA = this.calculateDistance(
          latitude,
          longitude,
          a.lat,
          a.lng
        );
        const distanceB = this.calculateDistance(
          latitude,
          longitude,
          b.lat,
          b.lng
        );
        return distanceA - distanceB;
      })
      .slice(0, limit); // 최대 50개만 반환

    console.log("필터링된 가맹점:", filteredStores.length, "개");
    console.log(
      "필터링된 가맹점 목록:",
      filteredStores.map((s) => s.name)
    );

    return {
      data: {
        content: filteredStores,
        totalElements: filteredStores.length,
        totalPages: 1,
        currentPage: 1,
      },
    };
  }

  // 거리 계산 함수 (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 지구 반지름 (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // km 단위
  }
}

export const storeApi = new StoreApiService();
