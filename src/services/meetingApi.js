import apiService from "./api.js";

// 모임 관련 API 함수들
export const meetingApi = {
    // 모임 생성
    createMeeting: async (meetingData) => {
        return await apiRequest('/api/meetings', {
            method: 'POST',
            body: JSON.stringify({
                title: meetingData.title,
                description: meetingData.description,
                location: meetingData.location,
                openchat_url: meetingData.openchat_url,
                schedule: meetingData.schedule,
                image_url: meetingData.image_url
            })
        });
    },

    // 모임 가입 신청
    joinMeeting: async (meetingId) => {
        return await apiRequest(`/api/meetings/${meetingId}/join`, {
            method: 'POST'
        });
    },

    // 모임 리스트 조회 (로그인 시 헤더로 토큰 필수)
    getMeetings: async () => {
        return await apiRequest('/api/meetings', {
            method: 'GET'
        });
    },

    // 모임 정보 상세 조회
    getMeetingDetail: async (meetingId) => {
        return await apiRequest(`/api/meetings/${meetingId}`, {
            method: 'GET'
        });
    },

    // 모임 멤버 관리 리스트 조회
    getMeetingMembers: async (meetingId) => {
        return await apiRequest(`/api/meetings/${meetingId}/users`, {
            method: 'GET'
        });
    }
};

// 에러 처리를 위한 헬퍼 함수들
export const handleApiError = (error) => {
    if (error.message.includes('401')) {
        // 인증 에러 처리
        console.error('인증이 필요합니다. 로그인해주세요.');
        // 로그인 페이지로 리다이렉트 등의 처리
        return '로그인이 필요합니다.';
    } else if (error.message.includes('403')) {
        // 권한 에러 처리
        console.error('권한이 없습니다.');
        return '권한이 없습니다.';
    } else if (error.message.includes('404')) {
        // 리소스 없음 에러 처리
        console.error('요청한 리소스를 찾을 수 없습니다.');
        return '요청한 정보를 찾을 수 없습니다.';
    } else if (error.message.includes('500')) {
        // 서버 에러 처리
        console.error('서버 에러가 발생했습니다.');
        return '서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.';
    } else {
        // 기타 에러 처리
        console.error('알 수 없는 에러:', error);
        return '알 수 없는 에러가 발생했습니다.';
    }
};
