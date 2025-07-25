import { getAuthToken } from './auth';
import { getLocationCode } from '../utils/locationUtils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://43.200.175.218:8080';

// 스케줄 변환 (UI 값 -> API 값)
const SCHEDULE_TO_API_MAP = {
    'ALL': 'FULL',      // 전체 -> FULL
    'WEEKDAY': 'WEEKDAY', // 평일 -> WEEKDAY
    'WEEKEND': 'WEEKEND'  // 주말 -> WEEKEND
};

// API 요청 헤더 생성
const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

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

            const response = await fetch(`${API_BASE_URL}/api/meetings`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                // HTTP 상태코드별 에러 처리
                switch (response.status) {
                    case 401:
                        throw new Error('로그인이 필요합니다. 다시 로그인해주세요.');
                    case 403:
                        throw new Error('권한이 없습니다.');
                    case 400:
                        throw new Error(errorData.message || '입력 정보를 확인해주세요.');
                    case 500:
                        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                    default:
                        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
                }
            }

            const result = await response.json();
            return result;

        } catch (error) {
            console.error('모임 생성 API 오류:', error);

            // 네트워크 오류 처리
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
            }

            throw error;
        }
    },

    // 모임 목록 조회
    getMeetings: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams(params);
            const response = await fetch(`${API_BASE_URL}/api/meetings?${queryParams}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('모임 목록 조회 API 오류:', error);
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