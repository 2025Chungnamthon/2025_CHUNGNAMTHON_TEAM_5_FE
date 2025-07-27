import axios from 'axios';
import { getAuthToken } from '../stores/authStore';
import { getLocationCode } from '../utils/locationUtils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://43.200.175.218:8080';

// 스케줄 변환 (UI 값 -> API 값)
const SCHEDULE_TO_API_MAP = {
    'ALL': 'FULL',      // 전체 -> FULL
    'WEEKDAY': 'WEEKDAY', // 평일 -> WEEKDAY
    'WEEKEND': 'WEEKEND'  // 주말 -> WEEKEND
};

// axios 인스턴스 생성
const meetingAxios = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10초 타임아웃
    headers: {
        'Content-Type': 'application/json'
    }
});

// 요청 인터셉터 - 토큰 자동 추가
meetingAxios.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        console.log('Meeting API 토큰 상태:', token ? '있음' : '없음');

        // 토큰 유효성 검사 유지
        if (token && token !== 'null' && token !== 'undefined') {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(`Meeting API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('Meeting API Request Error:', error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터
meetingAxios.interceptors.response.use(
    (response) => {
        console.log(`Meeting API Response: ${response.status}`, response.data);
        return response;
    },
    (error) => {
        console.error('Meeting API Response Error:', error);

        // 네트워크 에러 처리
        if (!error.response) {
            throw new Error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
        }

        // HTTP 상태 코드별 에러 처리 유지
        const { status, data } = error.response;
        let errorMessage = data?.message || `HTTP ${status}: ${error.response.statusText}`;

        switch (status) {
            case 400:
                errorMessage = data?.message || '잘못된 요청입니다. 입력 정보를 확인해주세요.';
                break;
            case 401:
                errorMessage = '로그인이 필요합니다. 다시 로그인해주세요.';
                break;
            case 403:
                errorMessage = '권한이 없습니다.';
                break;
            case 404:
                errorMessage = '요청한 리소스를 찾을 수 없습니다.';
                break;
            case 500:
                errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
                break;
        }

        throw new Error(errorMessage);
    }
);

// 스케줄을 API 형식으로 변환
const convertScheduleToAPI = (schedule) => {
    const converted = SCHEDULE_TO_API_MAP[schedule];
    if (!converted) {
        console.warn(`스케줄 '${schedule}'에 대한 API 값을 찾을 수 없습니다.`);
        return 'FULL'; // 기본값
    }
    return converted;
};

// API 요청 데이터 변환
const transformMeetingData = (meetingData) => {
    // 지역명을 코드로 변환 (utils 함수 사용)
    const locationCode = getLocationCode(meetingData.location);

    // 스케줄을 API 형식으로 변환
    const apiSchedule = convertScheduleToAPI(meetingData.schedule);

    return {
        title: meetingData.title,
        description: meetingData.description,
        location: locationCode,
        schedule: apiSchedule,
        openChatUrl: meetingData.openchat_url || "https://open.kakao.com/o/default", // 필수 필드
        imageUrl: meetingData.image_url || "https://example.com/default.jpg"
    };
};

export const meetingApi = {
    // 모임 생성
    createMeeting: async (meetingData) => {
        try {
            const requestData = transformMeetingData(meetingData);
            console.log('원본 데이터:', meetingData);
            console.log('API 요청 데이터:', requestData);

            const response = await meetingAxios.post('/api/meetings', requestData);
            return response.data;
        } catch (error) {
            console.error('모임 생성 API 오류:', error);
            throw error;
        }
    },

    // 모임 목록 조회 (토큰 선택사항)
    getMeetings: async (params = {}) => {
        try {
            const response = await meetingAxios.get('/api/meetings', { params });
            return response.data;
        } catch (error) {
            console.error('모임 목록 조회 API 오류:', error);
            throw error;
        }
    },

    // 내 모임 리스트 조회
    getMyMeetings: async (status = 'approved') => {
        try {
            const endpoint = status ? `/api/meetings/me/${status}` : '/api/meetings/me';
            console.log('내 모임 조회 URL:', endpoint);

            const response = await meetingAxios.get(endpoint);
            console.log(`내 모임 조회 응답 (${status}):`, response.data);
            return response.data;
        } catch (error) {
            console.error(`내 모임 조회 API 오류 (${status}):`, error);
            throw error;
        }
    },

    // 모임 상세 정보 조회 (토큰 선택사항)
    getMeetingDetail: async (meetingId) => {
        try {
            const response = await meetingAxios.get(`/api/meetings/${meetingId}`);
            return response.data;
        } catch (error) {
            console.error('모임 상세 조회 API 오류:', error);
            throw error;
        }
    },

    // 모임 가입 신청
    joinMeeting: async (meetingId) => {
        try {
            console.log('모임 가입 신청:', meetingId);
            const response = await meetingAxios.post(`/api/meetings/${meetingId}/join`);
            console.log('모임 가입 신청 응답:', response.data);
            return response.data;
        } catch (error) {
            console.error('모임 가입 신청 API 오류:', error);
            throw error;
        }
    },

    // 모임 수정
    updateMeeting: async (meetingId, meetingData) => {
        try {
            const requestData = transformMeetingData(meetingData);
            const response = await meetingAxios.patch(`/api/meetings/${meetingId}`, requestData);
            return response.data;
        } catch (error) {
            console.error('모임 수정 API 오류:', error);
            throw error;
        }
    },

    // 모임 삭제
    deleteMeeting: async (meetingId) => {
        try {
            const response = await meetingAxios.delete(`/api/meetings/${meetingId}`);
            return response.data;
        } catch (error) {
            console.error('모임 삭제 API 오류:', error);
            throw error;
        }
    },

    // 모임 멤버 리스트 조회
    getMeetingMembers: async (meetingId) => {
        try {
            console.log(`모임 ${meetingId} 멤버 리스트 조회 시작`);
            const response = await meetingAxios.get(`/api/meetings/${meetingId}/users`);
            console.log('멤버 리스트 조회 응답:', response.data);
            return response.data;
        } catch (error) {
            console.error('멤버 리스트 조회 API 오류:', error);
            throw error;
        }
    },

    // 멤버 승인
    approveMember: async (meetingId, userId) => {
        try {
            console.log(`모임 ${meetingId}에서 사용자 ${userId} 승인 시작`);
            const response = await meetingAxios.post(`/api/meetings/${meetingId}/approve/${userId}`);
            console.log('멤버 승인 응답:', response.data);
            return response.data;
        } catch (error) {
            console.error('멤버 승인 API 오류:', error);
            throw error;
        }
    },

    // 멤버 거절
    rejectMember: async (meetingId, userId) => {
        try {
            console.log(`모임 ${meetingId}에서 사용자 ${userId} 거절 시작`);
            const response = await meetingAxios.delete(`/api/meetings/${meetingId}/reject/${userId}`);
            console.log('멤버 거절 응답:', response.data);
            return response.data;
        } catch (error) {
            console.error('멤버 거절 API 오류:', error);
            throw error;
        }
    },

    // 멤버 내보내기 (강퇴)
    kickMember: async (meetingId, userId) => {
        try {
            console.log(`모임 ${meetingId}에서 사용자 ${userId} 내보내기 시작`);
            const response = await meetingAxios.post(`/api/meetings/${meetingId}/kick/${userId}`);
            console.log('멤버 내보내기 응답:', response.data);
            return response.data;
        } catch (error) {
            console.error('멤버 내보내기 API 오류:', error);
            throw error;
        }
    },

    // 모임 가입 신청 취소
    cancelJoinRequest: async (meetingId) => {
        try {
            console.log('모임 가입 신청 취소:', meetingId);
            const response = await meetingAxios.delete(`/api/meetings/${meetingId}/cancel`);
            console.log('모임 가입 신청 취소 응답:', response.data);
            return response.data;
        } catch (error) {
            console.error('모임 가입 신청 취소 API 오류:', error);
            throw error;
        }
    },

    // 모임 나가기 (탈퇴)
    leaveMeeting: async (meetingId) => {
        try {
            console.log('모임 나가기:', meetingId);
            const response = await meetingAxios.delete(`/api/meetings/${meetingId}/leave`);
            console.log('모임 나가기 응답:', response.data);
            return response.data;
        } catch (error) {
            console.error('모임 나가기 API 오류:', error);
            throw error;
        }
    }
};

// 디버깅용 함수들 export
export const debugUtils = {
    convertScheduleToAPI,
    transformMeetingData,
    SCHEDULE_TO_API_MAP
};