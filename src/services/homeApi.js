import axios from "axios";
import { getAuthToken } from "@/stores/authStore";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://43.200.175.218:8080";

export const getHomeData = async () => {
  try {
    const token = getAuthToken();

    // 토큰이 있든 없든 API 호출 (선택적 인증)
    const headers = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.get(`${API_BASE_URL}/api/home`, {
      headers
    });

    console.log("[homeApi] 홈 정보:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("[homeApi] 홈 정보 조회 실패:", error);

    // 백엔드 문제로 401이 오는 경우 임시 기본 데이터 반환
    if (error.response?.status === 401) {
      console.log("[homeApi] 백엔드 401 에러 - 임시 기본 데이터 반환");
      return {
        recentMeetings: [],
        powerUsers: [],
        topAffiliates: []
      };
    }

    throw error;
  }
};

export const getAffiliatedStores = async () => {
  try {
    const token = getAuthToken();

    // 토큰이 있든 없든 API 호출 (선택적 인증)
    const headers = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.get(`${API_BASE_URL}/api/home/affiliate`, {
      headers
    });

    console.log("[homeApi] 제휴 업체 정보:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("[homeApi] 제휴 업체 조회 실패:", error);

    // 백엔드 문제로 401이 오는 경우 빈 배열 반환
    if (error.response?.status === 401) {
      console.log("[homeApi] 백엔드 401 에러 - 빈 제휴업체 데이터 반환");
      return [];
    }

    throw error;
  }
};