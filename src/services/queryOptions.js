import { queryOptions } from "@tanstack/react-query";
import apiService from "./api.js";
import { isAuthenticated } from "./auth.js";

// ============================================================================
// 사용자 관련 쿼리 옵션
// ============================================================================

export const userProfileOptions = () => {
  return queryOptions({
    queryKey: ["user", "profile"],
    queryFn: () => apiService.get("/api/user/profile"),
    enabled: isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5분간 신선한 데이터로 간주
    retry: (failureCount, error) => {
      if (error?.status === 401) return false; // 401 에러는 재시도하지 않음
      return failureCount < 3;
    },
  });
};

// ============================================================================
// 인증 관련 뮤테이션 옵션
// ============================================================================

export const loginMutationOptions = () => {
  return {
    mutationFn: async (credentials) => {
      const response = await apiService.post("/api/auth/login", credentials);
      return response;
    },
    onSuccess: (data, variables, context) => {
      console.log("로그인 성공!");
    },
    onError: (error, variables, context) => {
      console.error("로그인 실패:", error);
    },
  };
};

export const logoutMutationOptions = () => {
  return {
    mutationFn: async () => {
      try {
        await apiService.post("/api/auth/logout");
      } catch (error) {
        console.warn("서버 로그아웃 요청 실패 (무시):", error);
      }
    },
    onSuccess: () => {
      console.log("로그아웃 성공!");
    },
    onError: (error) => {
      console.error("로그아웃 실패:", error);
    },
  };
};

export const refreshTokenMutationOptions = () => {
  return {
    mutationFn: async (refreshToken) => {
      const response = await apiService.post("/api/auth/refresh", {
        refreshToken,
      });
      return response;
    },
    onSuccess: (data) => {
      console.log("토큰 갱신 성공!");
    },
    onError: (error) => {
      console.error("토큰 갱신 실패:", error);
    },
  };
};

// ============================================================================
// 기타 API 쿼리 옵션들 (필요시 확장)
// ============================================================================

export const storesOptions = () => {
  return queryOptions({
    queryKey: ["stores"],
    queryFn: () => apiService.get("/api/stores"),
    staleTime: 10 * 60 * 1000, // 10분
    retry: 3,
  });
};

export const storeOptions = (storeId) => {
  return queryOptions({
    queryKey: ["store", storeId],
    queryFn: () => apiService.get(`/api/stores/${storeId}`),
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000, // 5분
    retry: 3,
  });
};

export const meetingsOptions = () => {
  return queryOptions({
    queryKey: ["meetings"],
    queryFn: () => apiService.get("/api/meetings"),
    staleTime: 2 * 60 * 1000, // 2분
    retry: 3,
  });
};

export const meetingOptions = (meetingId) => {
  return queryOptions({
    queryKey: ["meeting", meetingId],
    queryFn: () => apiService.get(`/api/meetings/${meetingId}`),
    enabled: !!meetingId,
    staleTime: 2 * 60 * 1000, // 2분
    retry: 3,
  });
};

export const couponsOptions = () => {
  return queryOptions({
    queryKey: ["coupons"],
    queryFn: () => apiService.get("/api/coupons"),
    enabled: isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5분
    retry: 3,
  });
};

// ============================================================================
// 뮤테이션 옵션들
// ============================================================================

export const createMeetingMutationOptions = () => {
  return {
    mutationFn: async (meetingData) => {
      const response = await apiService.post("/api/meetings", meetingData);
      return response;
    },
    onSuccess: () => {
      console.log("모임 생성 성공!");
    },
    onError: (error) => {
      console.error("모임 생성 실패:", error);
    },
  };
};

export const updateMeetingMutationOptions = () => {
  return {
    mutationFn: async ({ id, data }) => {
      const response = await apiService.put(`/api/meetings/${id}`, data);
      return response;
    },
    onSuccess: () => {
      console.log("모임 수정 성공!");
    },
    onError: (error) => {
      console.error("모임 수정 실패:", error);
    },
  };
};

export const deleteMeetingMutationOptions = () => {
  return {
    mutationFn: async (meetingId) => {
      const response = await apiService.delete(`/api/meetings/${meetingId}`);
      return response;
    },
    onSuccess: () => {
      console.log("모임 삭제 성공!");
    },
    onError: (error) => {
      console.error("모임 삭제 실패:", error);
    },
  };
};
