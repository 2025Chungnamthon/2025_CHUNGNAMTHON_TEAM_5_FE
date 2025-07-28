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
}

export const storeApi = new StoreApiService();
