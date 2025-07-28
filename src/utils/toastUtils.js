// 토스트 유틸리티 함수들
// 이 함수들은 useToastContext와 함께 사용되어야 합니다.

// 성공 토스트 메시지 생성
export const createSuccessToast = (message) => ({
  message,
  type: "success",
  showIcon: true,
});

// 에러 토스트 메시지 생성
export const createErrorToast = (message) => ({
  message,
  type: "error",
  showIcon: true,
});

// API 에러 토스트 메시지 생성 (에러 객체에서 메시지 추출)
export const createApiErrorToast = (
  error,
  defaultMessage = "오류가 발생했습니다."
) => {
  const errorMessage = error.response?.data?.message || defaultMessage;
  return createErrorToast(errorMessage);
};

// 토스트 메시지 타입 상수
export const TOAST_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
  WARNING: "warning",
};
