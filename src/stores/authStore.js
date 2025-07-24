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

// Zustand 인증 스토어 생성
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
    }),
    {
      name: "auth-storage", // localStorage 키 이름
      // 민감한 정보는 제외하고 저장
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);

// 편의 함수들
export const getAuthToken = () => useAuthStore.getState().accessToken;
export const isAuthenticated = () => useAuthStore.getState().isAuthenticated;
export const getCurrentUser = () => useAuthStore.getState().user;
