// API 기본 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// API 요청 헬퍼 함수
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    try {
        console.log(`API Request: ${options.method || 'GET'} ${url}`);

        const response = await fetch(url, config);
        const data = await response.json();

        console.log(`API Response: ${response.status}`, data);

        if (!response.ok) {
            throw new Error(data.message || `HTTP Error: ${response.status}`);
        }

        return data;
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

// 이미지 업로드 API (향후 확장용)
export const imageApi = {
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        return await apiRequest('/api/images/upload', {
            method: 'POST',
            headers: {}, // Content-Type을 자동으로 설정하게 함 (multipart/form-data)
            body: formData
        });
    }
};

// API 연결 테스트 함수
export const testApiConnection = async () => {
    try {
        console.log('Testing API connection...');
        console.log('API_BASE_URL:', API_BASE_URL);

        // 간단한 연결 테스트 (모임 목록 조회)
        const result = await meetingApi.getMeetings();
        console.log('API connection test successful:', result);
        return true;
    } catch (error) {
        console.error('API connection test failed:', error);
        return false;
    }
};