// API 기본 설정
const API_BASE_URL = import.meta.env.AWS_API_BASE_URL || 'http://localhost:8080';

// JWT 토큰 가져오기 함수
const getAuthToken = () => {
    return localStorage.getItem('accessToken') || localStorage.getItem('authToken') || localStorage.getItem('token');
};

// API 요청 헬퍼 함수
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAuthToken();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        },
        credentials: 'include',
        ...options
    };

    try {
        console.log(`API Request: ${options.method || 'GET'} ${url}`);

        const response = await fetch(url, config);

        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        console.log(`API Response: ${response.status}`, data);

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('authToken');
                localStorage.removeItem('token');
            }

            const errorMessage = typeof data === 'object' ? (data.message || `HTTP Error: ${response.status}`) : data;
            throw new Error(errorMessage);
        }

        return typeof data === 'object' ? data : { data };
    } catch (error) {
        console.error(`API Request Failed: ${endpoint}`, error);
        throw error;
    }
};

// 모임 관련 API 함수들
export const meetingApi = {
    // 모임 생성
    createMeeting: async (meetingData) => {
        return await apiRequest('/api/meetings', {
            method: 'POST',
            body: JSON.stringify(meetingData)
        });
    },

    // 모임 리스트 조회
    getMeetings: async (params = {}) => {
        const searchParams = new URLSearchParams(params);
        const queryString = searchParams.toString();
        const endpoint = queryString ? `/api/meetings?${queryString}` : '/api/meetings';
        return await apiRequest(endpoint);
    },

    // 모임 상세 조회
    getMeeting: async (meetingId) => {
        return await apiRequest(`/api/meetings/${meetingId}`);
    },

    // 모임 가입
    joinMeeting: async (meetingId) => {
        return await apiRequest(`/api/meetings/${meetingId}/join`, {
            method: 'POST'
        });
    },

    // 모임 정보 수정
    updateMeeting: async (meetingId, meetingData) => {
        return await apiRequest(`/api/meetings/${meetingId}`, {
            method: 'PATCH',
            body: JSON.stringify(meetingData)
        });
    },

    // 모임 삭제
    deleteMeeting: async (meetingId) => {
        return await apiRequest(`/api/meetings/${meetingId}`, {
            method: 'DELETE'
        });
    }
};
