import axios from "axios";
import { getAuthToken } from "@/stores/authStore";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const pointApi = {
  getPointHistory: async () => {
    try {
      const token = getAuthToken();
      console.log("Access Token:", token);
      const response = await axios.get(`${API_BASE_URL}/api/points`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Point History Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("포인트 조회 실패:", error);
      throw error;
    }
  },
};
