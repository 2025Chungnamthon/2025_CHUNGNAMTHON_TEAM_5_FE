import axios from "axios";
import { getAuthToken } from "@/stores/authStore";
// API 기본 설정
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://43.200.175.218:8080";

export const mypageApi = {
  getMypage: async () => {
    try {
      const token = getAuthToken();
      // console.log("불러온 토큰:", token);
      const response = await axios.get(`${API_BASE_URL}/api/mypage`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("마이페이지 전체 응답:", response);
      if (!response?.data?.data) {
        console.warn("마이페이지 데이터 없음:", response?.data);
      }
      return response?.data?.data || null;
    } catch (error) {
      console.error("마이페이지 정보 요청 실패:", error);
      throw error;
    }
  },
};
