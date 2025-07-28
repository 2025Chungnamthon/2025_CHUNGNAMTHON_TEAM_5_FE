import { create } from "zustand";
import { persist } from "zustand/middleware";

// 사용자 정보 타입 (실제 API 응답에 맞게 조정)
export const User = {
  id: "",
  email: "",
  name: "",
  profileImage: "",
  point: 0,
  couponCount: 0,
};

// 인증 스토어 상태 타입
export const AuthState = {
  // 인증 상태
  isAuthenticated: false,

  // 토큰
  accessToken: null,
  refreshToken: null,

  // 사용자 정보
  user: null,

  // 로딩 상태
  isLoading: false,

  // 에러 상태
  error: null,
};

// 인증 스토어 액션 타입
export const AuthActions = {
  // 로그인
  login: (tokens, user) => {},

  // 로그아웃
  logout: () => {},

  // 사용자 정보 업데이트
  updateUser: (user) => {},

  // 토큰 갱신
  refreshTokens: (tokens) => {},

  // 로딩 상태 설정
  setLoading: (isLoading) => {},

  // 에러 설정
  setError: (error) => {},

  // 에러 초기화
  clearError: () => {},
};

// Zustand 인증 스토어 생성 (persist 추가)
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // 초기 상태
      ...AuthState,

      // 로그인 액션
      login: (tokens, user) => {
        set({
          isAuthenticated: true,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: user || null,
          error: null,
        });

        // localStorage에도 저장 (이중 안전장치)
        if (tokens.accessToken) {
          localStorage.setItem("accessToken", tokens.accessToken);
        }
        if (tokens.refreshToken) {
          localStorage.setItem("refreshToken", tokens.refreshToken);
        }

        console.log("✅ Logged in. Access Token:", tokens.accessToken);
        console.log("✅ Logged in User:", user);
      },

      // 로그아웃 액션
      logout: () => {
        set({
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
          user: null,
          error: null,
        });

        // localStorage에서도 삭제
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      },

      // 사용자 정보 업데이트
      updateUser: (user) => {
        set({ user });
      },

      // 토큰 갱신
      refreshTokens: (tokens) => {
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken || get().refreshToken,
        });

        // localStorage도 업데이트
        if (tokens.accessToken) {
          localStorage.setItem("accessToken", tokens.accessToken);
        }
        if (tokens.refreshToken) {
          localStorage.setItem("refreshToken", tokens.refreshToken);
        }
      },

      // 로딩 상태 설정
      setLoading: (isLoading) => {
        set({ isLoading });
      },

      // 에러 설정
      setError: (error) => {
        set({ error });
      },

      // 에러 초기화
      clearError: () => {
        set({ error: null });
      },

      // 인증 상태 설정
      setAuthenticated: (isAuthenticated) => {
        set({ isAuthenticated });
      },
    }),
    {
      name: "auth-storage", // localStorage 키 이름
      partialize: (state) => ({
        // 민감하지 않은 데이터만 저장
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);

// 편의 함수들
export const getAuthToken = () => {
  const token = useAuthStore.getState().accessToken;
  // console.log("Access Token retrieved:", token);
  return token;
};
export const isAuthenticated = () => useAuthStore.getState().isAuthenticated;
export const getCurrentUser = () => useAuthStore.getState().user;
