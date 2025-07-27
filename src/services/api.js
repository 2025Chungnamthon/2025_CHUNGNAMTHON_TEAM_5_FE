import axios from "axios";
import { getAuthToken, logout } from "./auth.js";

// API 기본 설정
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://43.200.175.218:8080";

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 요청 인터셉터 - 토큰 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리 및 토큰 갱신
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status}`, response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 토큰 갱신 시도
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/api/auth/refresh`,
            {
              refreshToken,
            }
          );

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            response.data;

          if (newAccessToken) {
            // Zustand 스토어 업데이트
            const { refreshTokens } = await import("../stores/authStore");
            refreshTokens({
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            });
          }

          // 원래 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error("토큰 갱신 실패:", refreshError);
        // 토큰 갱신 실패 시 로그아웃 처리
        logout();
      }
    }

    console.error(`API Request Failed: ${originalRequest.url}`, error);
    return Promise.reject(error);
  }
);

// API 서비스 클래스
class ApiService {
  // GET 요청
  async get(url, config = {}) {
    const response = await apiClient.get(url, config);
    return response.data;
  }

  // POST 요청
  async post(url, data = {}, config = {}) {
    const response = await apiClient.post(url, data, config);
    return response.data;
  }

  // PUT 요청
  async put(url, data = {}, config = {}) {
    const response = await apiClient.put(url, data, config);
    return response.data;
  }

  // PATCH 요청
  async patch(url, data = {}, config = {}) {
    const response = await apiClient.patch(url, data, config);
    return response.data;
  }

  // DELETE 요청
  async delete(url, config = {}) {
    const response = await apiClient.delete(url, config);
    return response.data;
  }
}

export default new ApiService();
