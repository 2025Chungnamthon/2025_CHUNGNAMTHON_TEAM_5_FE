import axios from "axios";
import { getAuthToken } from "@/stores/authStore";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const pointApi = {
  getPointHistory: async () => {
    const token = getAuthToken();

    // 포인트는 반드시 로그인 필요 - 토큰 없으면 에러
    if (!token) {
      throw new Error("로그인이 필요한 서비스입니다.");
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/points`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("포인트 조회 실패:", error);
      throw error;
    }
  },
};