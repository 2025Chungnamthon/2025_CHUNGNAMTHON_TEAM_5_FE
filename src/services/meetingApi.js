import apiService from "./api.js";

// 모임 관련 API 함수들
export const meetingApi = {
  // 모임 생성
  createMeeting: async (meetingData) => {
    return await apiService.post("/api/meetings", meetingData);
  },

  // 모임 리스트 조회
  getMeetings: async (params = {}) => {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `/api/meetings?${queryString}`
      : "/api/meetings";
    return await apiService.get(endpoint);
  },

  // 모임 상세 조회
  getMeeting: async (meetingId) => {
    return await apiService.get(`/api/meetings/${meetingId}`);
  },

  // 모임 가입
  joinMeeting: async (meetingId) => {
    return await apiService.post(`/api/meetings/${meetingId}/join`);
  },

  // 모임 정보 수정
  updateMeeting: async (meetingId, meetingData) => {
    return await apiService.patch(`/api/meetings/${meetingId}`, meetingData);
  },

  // 모임 삭제
  deleteMeeting: async (meetingId) => {
    return await apiService.delete(`/api/meetings/${meetingId}`);
  },
};
