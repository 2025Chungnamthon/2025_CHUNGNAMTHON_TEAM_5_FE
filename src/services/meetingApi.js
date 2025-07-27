import axios from 'axios';
import {getAuthToken} from './auth';
import {getLocationCode} from '../utils/locationUtils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://43.200.175.218:8080';

// 스케줄 변환 (UI 값 -> API 값)
const SCHEDULE_TO_API_MAP = {
    'ALL': 'FULL',      // 전체 -> FULL
    'WEEKDAY': 'WEEKDAY', // 평일 -> WEEKDAY
    'WEEKEND': 'WEEKEND'  // 주말 -> WEEKEND
};

// axios 인스턴스 생성
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// 요청 인터셉터 - 인증 토큰 자동 추가
apiClient.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED' || error.message.includes('Network Error')) {
            throw new Error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
        }

        if (error.response) {
            const { status, data } = error.response;
            const errorMessage = data?.message || `HTTP ${status}: ${error.response.statusText}`;

            switch (status) {
                case 400:
                    throw new Error(data?.message || '입력 정보를 확인해주세요.');
                case 401:
                    throw new Error('로그인이 필요합니다. 다시 로그인해주세요.');
                case 403:
                    throw new Error(data?.message || '권한이 없습니다.');
                case 404:
                    throw new Error(data?.message || '요청한 리소스를 찾을 수 없습니다.');
                case 500:
                    throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                default:
                    throw new Error(errorMessage);
            }
        }

        throw error;
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

            const response = await apiClient.post('/api/meetings', requestData);
            return response.data;
        } catch (error) {
            console.error('모임 생성 API 오류:', error);
            throw error;
        }
    },

    // 모임 목록 조회
    getMeetings: async (params = {}) => {
        try {
            const response = await apiClient.get('/api/meetings', { params });
            return response.data;
        } catch (error) {
            console.error('모임 목록 조회 API 오류:', error);
            throw error;
        }
    },

    // 내 모임 리스트 조회
    getMyMeetings: async (status = 'approved') => {
        try {
            // status에 따라 엔드포인트 결정
            const endpoint = status ? `/api/meetings/me/${status}` : '/api/meetings/me';

            console.log('내 모임 조회 URL:', `${API_BASE_URL}${endpoint}`);

            const response = await apiClient.get(endpoint);

            console.log(`내 모임 조회 응답 (${status}):`, response.data);
            return response.data;
        } catch (error) {
            console.error(`내 모임 조회 API 오류 (${status}):`, error);
            throw error;
        }
    },

    // 모임 상세 정보 조회
    getMeetingDetail: async (meetingId) => {
        try {
            const response = await apiClient.get(`/api/meetings/${meetingId}`);
            return response.data;
        } catch (error) {
            console.error('모임 상세 조회 API 오류:', error);

            // 404 에러에 대한 특별한 처리
            if (error.response?.status === 404) {
                throw new Error('모임을 찾을 수 없습니다.');
            }
            throw error;
        }
    },

    // 모임 가입 신청
    joinMeeting: async (meetingId) => {
        try {
            console.log('모임 가입 신청:', meetingId);

            const response = await apiClient.post(`/api/meetings/${meetingId}/join`);

            console.log('모임 가입 신청 응답:', response.data);
            return response.data;
        } catch (error) {
            console.error('모임 가입 신청 API 오류:', error);

            // 특별한 에러 메시지 처리
            if (error.response?.status === 400) {
                throw new Error('이미 가입 신청했거나 참여중인 모임입니다.');
            }
            if (error.response?.status === 404) {
                throw new Error('모임을 찾을 수 없습니다.');
            }
            throw error;
        }
    },

    // 모임 수정
    updateMeeting: async (meetingId, meetingData) => {
        try {
            const requestData = transformMeetingData(meetingData);

            const response = await apiClient.patch(`/api/meetings/${meetingId}`, requestData);
            return response.data;
        } catch (error) {
            console.error('모임 수정 API 오류:', error);

            // 특별한 에러 메시지 처리
            if (error.response?.status === 403) {
                throw new Error('모임을 수정할 권한이 없습니다.');
            }
            if (error.response?.status === 404) {
                throw new Error('모임을 찾을 수 없습니다.');
            }
            throw error;
        }
    },

    // 모임 삭제
    deleteMeeting: async (meetingId) => {
        try {
            const response = await apiClient.delete(`/api/meetings/${meetingId}`);
            return response.data;
        } catch (error) {
            console.error('모임 삭제 API 오류:', error);

            // 특별한 에러 메시지 처리
            if (error.response?.status === 403) {
                throw new Error('모임을 삭제할 권한이 없습니다.');
            }
            if (error.response?.status === 404) {
                throw new Error('모임을 찾을 수 없습니다.');
            }
            throw error;
        }
    },

    // 모임 멤버 리스트 조회
    getMeetingMembers: async (meetingId) => {
        try {
            console.log(`모임 ${meetingId} 멤버 리스트 조회 시작`);

            const response = await apiClient.get(`/api/meetings/${meetingId}/users`);

            console.log('멤버 리스트 조회 응답:', response.data);
            return response.data;
        } catch (error) {
            console.error('멤버 리스트 조회 API 오류:', error);

            // 특별한 에러 메시지 처리
            if (error.response?.status === 403) {
                throw new Error('멤버 리스트를 볼 권한이 없습니다.');
            }
            if (error.response?.status === 404) {
                throw new Error('모임을 찾을 수 없습니다.');
            }
            throw error;
        }
    },

    // 멤버 승인
    approveMember: async (meetingId, userId) => {
        try {
            console.log(`모임 ${meetingId}에서 사용자 ${userId} 승인 시작`);

            const response = await apiClient.post(`/api/meetings/${meetingId}/approve/${userId}`);

            console.log('멤버 승인 응답:', response.data);
            return response.data;
        } catch (error) {
            console.error('멤버 승인 API 오류:', error);

            // 특별한 에러 메시지 처리
            if (error.response?.status === 400) {
                throw new Error('잘못된 신청 상태입니다.');
            }
            if (error.response?.status === 403) {
                throw new Error('승인 권한이 없습니다.');
            }
            if (error.response?.status === 404) {
                throw new Error('존재하지 않는 모임입니다.');
            }
            throw error;
        }
    },

    // 멤버 거절
    rejectMember: async (meetingId, userId) => {
        try {
            console.log(`모임 ${meetingId}에서 사용자 ${userId} 거절 시작`);

            const response = await apiClient.delete(`/api/meetings/${meetingId}/reject/${userId}`);

            console.log('멤버 거절 응답:', response.data);
            return response.data;
        } catch (error) {
            console.error('멤버 거절 API 오류:', error);

            // 특별한 에러 메시지 처리
            if (error.response?.status === 403) {
                throw new Error('요청 상태가 아닙니다.');
            }
            if (error.response?.status === 404) {
                throw new Error('존재하지 않는 모임입니다.');
            }
            throw error;
        }
    },

    // 멤버 내보내기 (강퇴)
    kickMember: async (meetingId, userId) => {
        try {
            console.log(`모임 ${meetingId}에서 사용자 ${userId} 내보내기 시작`);

            const response = await apiClient.post(`/api/meetings/${meetingId}/kick/${userId}`);

            console.log('멤버 내보내기 응답:', response.data);
            return response.data;
        } catch (error) {
            console.error('멤버 내보내기 API 오류:', error);

            // 특별한 에러 메시지 처리
            if (error.response?.status === 403) {
                throw new Error('해당 모임에 참여 중인 멤버가 아닙니다.');
            }
            if (error.response?.status === 404) {
                throw new Error('존재하지 않는 모임입니다.');
            }
            throw error;
        }
    },

    // 모임 가입 신청 취소
    cancelJoinRequest: async (meetingId) => {
        try {
            console.log('모임 가입 신청 취소:', meetingId);

            const response = await apiClient.delete(`/api/meetings/${meetingId}/cancel`);

            console.log('모임 가입 신청 취소 응답:', response.data);
            return response.data;
        } catch (error) {
            console.error('모임 가입 신청 취소 API 오류:', error);

            // 특별한 에러 메시지 처리
            if (error.response?.status === 400) {
                throw new Error('이미 승인된 모임이거나, 신청하지 않은 모임입니다.');
            }
            if (error.response?.status === 404) {
                throw new Error('존재하지 않는 모임입니다.');
            }
            throw error;
        }
    },

    // 모임 나가기 (탈퇴)
    leaveMeeting: async (meetingId) => {
        try {
            console.log('모임 나가기:', meetingId);

            const response = await apiClient.delete(`/api/meetings/${meetingId}/leave`);

            console.log('모임 나가기 응답:', response.data);
            return response.data;
        } catch (error) {
            console.error('모임 나가기 API 오류:', error);

            // 특별한 에러 메시지 처리
            if (error.response?.status === 403) {
                throw new Error('참여하고 있지 않은 모임입니다.');
            }
            if (error.response?.status === 404) {
                throw new Error('존재하지 않는 모임입니다.');
            }
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