export const TOAST_CONFIGS = {
  // 가입 관련
  JOIN_REQUESTED: "가입 신청을 보냈어요",
  JOIN_CANCELLED: "가입 신청을 그만뒀어요",
  MEETING_DELETED: "모임을 삭제했어요",

  // 모임 관리
  MEETING_CREATED: "모임을 만들었어요",
  MEETING_UPDATED: "모임 정보가 수정됐어요",
  MEETING_LEFT: "모임을 나갔어요",

  // 쿠폰 관련
  COUPON_EXCHANGED: "쿠폰을 교환했어요",
  COUPON_USED: "쿠폰을 사용했어요",

  // 기타
  LOGOUT_SUCCESS: "로그아웃했어요",
};

// 에러 토스트 설정
export const ERROR_TOAST_CONFIGS = {
  // 모임 관련 에러
  MEETING_NOT_FOUND: "모임 정보를 찾을 수 없습니다.",
  JOIN_REQUEST_FAILED: "가입 신청에 실패했습니다.",
  LEAVE_MEETING_FAILED: "모임 나가기에 실패했습니다.",
  DELETE_MEETING_FAILED: "모임 삭제에 실패했습니다.",
  CANCEL_APPLICATION_FAILED: "신청 취소에 실패했습니다.",

  // 권한 관련 에러
  NO_PERMISSION: "권한이 없습니다.",
  LOGIN_REQUIRED: "로그인이 필요합니다.",

  // 네트워크 관련 에러
  NETWORK_ERROR: "네트워크 연결을 확인해주세요.",
  SERVER_ERROR: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",

  // 오픈채팅 관련 에러
  NO_OPENCHAT_LINK: "오픈채팅 링크가 없습니다.",

  // 일반 에러
  UNKNOWN_ERROR: "알 수 없는 오류가 발생했습니다.",
};
