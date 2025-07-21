// import apiService from "./apiClient";

// 소셜 로그인 URL로 리디렉션 (카카오 등)
export const startSocialLogin = (provider = "kakao") => {
  const loginUrl = apiService.getSocialLoginUrl(provider);
  window.location.href = loginUrl;
};

// 소셜 로그인 콜백 처리 (URL에서 token, refreshToken 추출 및 저장)
export const handleOAuthCallback = () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const refreshToken = params.get("refreshToken");

  if (token) {
    localStorage.setItem("authToken", token);
    apiService.setToken(token);
  }

  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  // URL 정리
  const cleanUrl = new URL(window.location);
  cleanUrl.searchParams.delete("token");
  cleanUrl.searchParams.delete("refreshToken");
  window.history.replaceState({}, document.title, cleanUrl.toString());
};

// 사용자 프로필 불러오기
export const fetchUserProfile = async () => {
  try {
    const res = await apiService.post("/api/user/profile");
    return res;
  } catch (error) {
    console.error("사용자 프로필 불러오기 실패:", error);
    throw error;
  }
};

// 로그아웃 처리
export const logout = async () => {
  try {
    await apiService.post("/api/auth/logout");
  } catch (error) {
    console.warn("서버 로그아웃 요청 실패 (무시):", error);
  }
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
  apiService.removeToken();
  window.location.href = "/login";
};

// 액세스 토큰 재발급
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("리프레시 토큰이 없습니다.");
  }

  try {
    const res = await apiService.post("/api/auth/refresh", {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = res.data;
    if (accessToken) {
      localStorage.setItem("authToken", accessToken);
      apiService.setToken(accessToken);
    }
    if (newRefreshToken) {
      localStorage.setItem("refreshToken", newRefreshToken);
    }

    return accessToken;
  } catch (error) {
    console.error("토큰 재발급 실패:", error);
    throw error;
  }
};
