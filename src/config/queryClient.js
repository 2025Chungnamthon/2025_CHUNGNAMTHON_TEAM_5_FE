import { QueryClient } from "@tanstack/react-query";

// TanStack Query v5 클라이언트 설정
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 데이터가 "신선하지 않다"고 간주되는 시간 (5분)
      staleTime: 5 * 60 * 1000,

      // 캐시에서 제거되는 시간 (10분)
      gcTime: 10 * 60 * 1000,

      // 재시도 횟수 (401 에러는 재시도하지 않음)
      retry: (failureCount, error) => {
        if (error?.status === 401) return false;
        return failureCount < 3;
      },

      // 윈도우 포커스 시 자동 리페치
      refetchOnWindowFocus: true,

      // 네트워크 재연결 시 자동 리페치
      refetchOnReconnect: true,

      // 에러 발생 시 자동 재시도 비활성화 (개발 환경에서만)
      retryOnMount: import.meta.env.PROD,
    },
    mutations: {
      // 뮤테이션 재시도 횟수
      retry: 1,

      // 뮤테이션 실패 시 자동 재시도 비활성화
      retryOnMount: false,
    },
  },
});

// 개발 환경에서 캐시 상태를 콘솔에 출력 (선택사항)
if (import.meta.env.DEV) {
  queryClient.getQueryCache().subscribe(() => {
    console.log("Query Cache Updated:", queryClient.getQueryCache().getAll());
  });
}
