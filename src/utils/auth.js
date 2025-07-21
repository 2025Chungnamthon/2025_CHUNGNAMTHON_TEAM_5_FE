// import apiService from "../services/apiClient";

// URL에서 토큰 추출
export const getTokenFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  console.log("[getTokenFromUrl] 추출된 token 값:", token, typeof token);
  return token;
};

// URL에서 에러 추출
export const getErrorFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("error");
};

// 쿠키에서 토큰 추출
export const getTokenFromCookie = (cookieName = "token") => {
  try {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === cookieName) {
        return decodeURIComponent(value);
      }
    }
    return null;
  } catch (error) {
    console.error("쿠키에서 토큰 추출 실패:", error);
    return null;
  }
};

// URL 또는 쿠키에서 토큰 추출 (fallback 로직)
export const getTokenFromUrlOrCookie = () => {
  const urlToken = getTokenFromUrl();
  if (urlToken) {
    return urlToken;
  }
  return getTokenFromCookie();
};

// JWT 토큰 디코딩 (페이로드만)
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

// 토큰 유효성 검사
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

// 현재 사용자 정보 가져오기
export const getCurrentUser = () => {
  const token = apiService.getToken();
  return token && isTokenValid(token) ? decodeToken(token) : null;
};

// 로그인 상태 확인
export const isAuthenticated = () => {
  const token = apiService.getToken();
  return token && isTokenValid(token);
};

// 로그아웃
export const logout = () => {
  apiService.removeToken();
  window.location.href = "/login";
};

// 소셜 로그인 시작
export const startSocialLogin = (provider) => {
  const loginUrl = apiService.getSocialLoginUrl(provider);
  window.location.href = loginUrl;
};

// URL 파라미터 정리
export const cleanUrl = () => {
  const url = new URL(window.location);
  url.searchParams.delete("token");
  url.searchParams.delete("error");
  window.history.replaceState({}, document.title, url.toString());
};

// 로그인 확인 후 페이지 이동
export const requireAuth = (navigate, targetPath = "/") => {
  if (!isAuthenticated()) {
    const currentPath = window.location.pathname + window.location.search;
    localStorage.setItem("redirectAfterLogin", currentPath);
    navigate("/login");
    return false;
  }
  return true;
};
