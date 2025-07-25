import { useAuthStore } from "../stores/authStore";

// API 기본 설정
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// ============================================================================
// 인증 상태 관리 (Zustand 스토어 래퍼)
// ============================================================================

export const getAuthToken = () => {
  return useAuthStore.getState().accessToken;
};

export const getRefreshToken = () => {
  return useAuthStore.getState().refreshToken;
};

export const isAuthenticated = () => {
  return useAuthStore.getState().isAuthenticated;
};

export const getCurrentUser = () => {
  return useAuthStore.getState().user;
};

// ============================================================================
// 토큰 관리 유틸리티
// ============================================================================

export const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("토큰 디코딩 실패:", error);
    return null;
  }
};

export const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const decoded = decodeToken(token);
    if (!decoded) return false;
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};

// ============================================================================
// OAuth 관련 함수들
// ============================================================================

export const getSocialLoginUrl = (provider = "kakao") => {
  return `${API_BASE_URL}/api/auth/${provider}`;
};

export const startSocialLogin = (provider = "kakao") => {
  const loginUrl = getSocialLoginUrl(provider);
  window.location.href = loginUrl;
};

// ============================================================================
// URL 파라미터 처리
// ============================================================================

export const getTokenFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("accessToken");
};

export const getErrorFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("error");
};

export const getCodeFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("code");
};

export const cleanUrl = () => {
  const url = new URL(window.location);
  url.searchParams.delete("accessToken");
  url.searchParams.delete("refreshToken");
  url.searchParams.delete("error");
  url.searchParams.delete("code");
  window.history.replaceState({}, document.title, url.toString());
};

// ============================================================================
// 인증 상태 변경 함수들
// ============================================================================

export const login = (tokens, user = null) => {
  const loginAction = useAuthStore.getState().login;
  loginAction(tokens, user);
};

export const logout = () => {
  const logoutAction = useAuthStore.getState().logout;
  logoutAction();
  window.location.href = "/login";
};

export const refreshTokens = (tokens) => {
  const refreshTokensAction = useAuthStore.getState().refreshTokens;
  refreshTokensAction(tokens);
};

// ============================================================================
// 인증 보호 함수
// ============================================================================

export const requireAuth = (navigate, targetPath = "/") => {
  if (!isAuthenticated()) {
    const currentPath = window.location.pathname + window.location.search;
    localStorage.setItem("redirectAfterLogin", currentPath);
    navigate("/login");
    return false;
  }
  return true;
};

// ============================================================================
// API 요청 헬퍼
// ============================================================================

export const createAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ============================================================================
// 콜백 처리 함수
// ============================================================================

export const handleOAuthCallback = async () => {
  const accessToken = getTokenFromUrl();
  const refreshToken = new URLSearchParams(window.location.search).get(
    "refreshToken"
  );
  const error = getErrorFromUrl();
  const code = getCodeFromUrl();

  if (error) {
    throw new Error(`로그인에 실패했습니다: ${error}`);
  }

  // accessToken이 있으면 바로 처리
  if (accessToken) {
    login(
      {
        accessToken,
        refreshToken: refreshToken || null,
      },
      null
    );
    cleanUrl();
    return { success: true };
  }

  // code가 있으면 서버에 요청
  if (code) {
    const apiUrl = `${API_BASE_URL}/api/auth/kakao/callback?code=${code}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (data.data && data.data.accessToken) {
      login(
        {
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
        },
        null
      );
      cleanUrl();
      return { success: true };
    } else {
      throw new Error("서버에서 토큰을 받지 못했습니다.");
    }
  }

  throw new Error("로그인 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
};
