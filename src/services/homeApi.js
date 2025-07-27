import axios from "axios";
import { getAuthToken } from "@/stores/authStore";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const getHomeData = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/api/home`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("[homeApi] 홈 정보:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("[homeApi] 홈 정보 조회 실패:", error);
    throw error;
  }
};

export const getAffiliatedStores = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/api/home/affiliate`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("[homeApi] 제휴 업체 정보:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("[homeApi] 제휴 업체 조회 실패:", error);
    throw error;
  }
};
