import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import {
  userProfileOptions,
  loginMutationOptions,
  logoutMutationOptions,
  refreshTokenMutationOptions,
} from "../services/queryOptions.js";
import {
  login,
  logout,
  refreshTokens,
  startSocialLogin,
  handleOAuthCallback,
} from "../services/auth.js";

// ============================================================================
// 앱 초기화 훅 (토큰 복원)
// ============================================================================

export const useAuthInitializer = () => {
  const { refreshTokens, setAuthenticated } = useAuthStore();

  useEffect(() => {
    const initializeAuth = () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken && refreshToken) {
        console.log("🔄 앱 초기화: 토큰 복원 중...");

        // Zustand 스토어에 토큰 복원
        refreshTokens({
          accessToken,
          refreshToken,
        });

        // 인증 상태 설정
        setAuthenticated(true);

        console.log("✅ 토큰 복원 완료");
      } else {
        console.log("ℹ️ 저장된 토큰이 없습니다. 로그인이 필요합니다.");
      }
    };

    initializeAuth();
  }, [refreshTokens, setAuthenticated]);
};

// ============================================================================
// 사용자 프로필 조회 훅
// ============================================================================

export const useUser = () => {
  return useQuery(userProfileOptions());
};

// ============================================================================
// 로그인 뮤테이션 훅
// ============================================================================

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);

  return useMutation({
    ...loginMutationOptions(),
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      // 로그인 성공 시 Zustand 스토어 업데이트
      login(data.tokens, data.user);

      // 사용자 정보 쿼리 무효화하여 새로 가져오기
      queryClient.invalidateQueries({ queryKey: ["user"] });

      // 성공 알림 (선택사항)
      console.log("로그인 성공!");
    },
    onError: (error) => {
      setError(error.message);
      console.error("로그인 실패:", error);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

// ============================================================================
// 로그아웃 뮤테이션 훅
// ============================================================================

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    ...logoutMutationOptions(),
    onSuccess: () => {
      // 로그아웃 시 Zustand 스토어 초기화
      logout();

      // 모든 쿼리 캐시 무효화
      queryClient.clear();
    },
    onError: (error) => {
      console.error("로그아웃 실패:", error);
      // 에러가 있어도 클라이언트 로그아웃은 진행
      logout();
      queryClient.clear();
    },
  });
};

// ============================================================================
// 토큰 갱신 뮤테이션 훅
// ============================================================================

export const useRefreshToken = () => {
  const refreshToken = useAuthStore((state) => state.refreshToken);

  return useMutation({
    ...refreshTokenMutationOptions(),
    onSuccess: (data) => {
      // 토큰 갱신 성공 시 Zustand 스토어 업데이트
      refreshTokens(data);
    },
    onError: (error) => {
      console.error("토큰 갱신 실패:", error);
      // 토큰 갱신 실패 시 로그아웃
      logout();
    },
  });
};

// ============================================================================
// OAuth 관련 훅들
// ============================================================================

export const useOAuthLogin = () => {
  const queryClient = useQueryClient();
  const setLoading = useAuthStore((state) => state.setLoading);
  const setError = useAuthStore((state) => state.setError);

  return useMutation({
    mutationFn: handleOAuthCallback,
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: () => {
      // 사용자 정보 쿼리 무효화하여 새로 가져오기
      queryClient.invalidateQueries({ queryKey: ["user"] });
      console.log("OAuth 로그인 성공!");
    },
    onError: (error) => {
      setError(error.message);
      console.error("OAuth 로그인 실패:", error);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

// ============================================================================
// 인증 상태 훅들
// ============================================================================

export const useAuthState = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  return {
    isAuthenticated,
    user,
    loading,
    error,
  };
};

// ============================================================================
// 편의 함수들 (기존 코드와의 호환성을 위해)
// ============================================================================

// 소셜 로그인 시작 함수 (기존 코드와의 호환성)
export { startSocialLogin };

// OAuth 콜백 처리 함수 (기존 코드와의 호환성)
export { handleOAuthCallback };
