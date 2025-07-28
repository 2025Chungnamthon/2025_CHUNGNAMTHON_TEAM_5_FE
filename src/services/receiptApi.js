import axios from 'axios';
import { getAuthToken } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// 테스트용 고정 위치 (필요시 주석 해제)
const FIXED_TEST_LOCATION = {
    latitude: 36.823289,
    longitude: 127.126473
};

// axios 인스턴스 생성
const apiClient = axios.create({
    baseURL: API_BASE_URL,
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
                    throw new Error(data?.message || '올바르지 않은 영수증 이미지입니다.');
                case 401:
                    throw new Error('로그인이 필요합니다. 다시 로그인해주세요.');
                case 403:
                    throw new Error(data?.message || '권한이 없습니다.');
                case 404:
                    throw new Error(data?.message || '영수증 정보를 찾을 수 없습니다.');
                case 500:
                    throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                default:
                    throw new Error(errorMessage);
            }
        }

        throw error;
    }
);

// Blob을 File 객체로 변환하는 헬퍼 함수
const blobToFile = (blob, fileName = 'receipt.jpg') => {
    return new File([blob], fileName, { type: blob.type || 'image/jpeg' });
};

export const receiptApi = {
    // 영수증 미리보기 (이미지 + 위치 정보 업로드)
    previewReceipt: async (imageBlob) => {
        try {
            console.log('영수증 미리보기 시작:', imageBlob);

            // 🔧 테스트용: 고정 위치 사용
            console.log('🧪 테스트 모드: 고정 위치 사용');
            const locationResult = {
                success: true,
                data: FIXED_TEST_LOCATION,
                accuracy: 10 // 가상의 정확도
            };

            // 실제 위치 정보를 사용하려면 아래 주석을 해제하세요:
            /*
            console.log('위치 정보 가져오는 중...');
            const locationResult = await getLocationForReceipt();

            if (!locationResult.success) {
                const shouldContinue = window.confirm(
                    `${locationResult.error}\n\n위치 정보 없이 계속 진행하시겠습니까?`
                );

                if (!shouldContinue) {
                    throw new Error('영수증 인증을 위해 위치 정보가 필요합니다.');
                }
            }
            */

            // 2. FormData 생성
            const formData = new FormData();

            // 이미지 파일 추가
            const imageFile = blobToFile(imageBlob, 'receipt.jpg');
            formData.append('receiptImage', imageFile);

            // request JSON 객체 생성
            const requestData = {};

            // 위도, 경도를 request 객체에 추가
            if (locationResult.success && locationResult.data) {
                requestData.latitude = locationResult.data.latitude;
                requestData.longitude = locationResult.data.longitude;

                console.log('위치 정보 포함:', {
                    latitude: locationResult.data.latitude,
                    longitude: locationResult.data.longitude
                });
                console.log('위치 정확도 (참고용):', `${Math.round(locationResult.accuracy || 0)}m`);
            } else {
                console.warn('위치 정보 없이 API 호출');
            }

            // request를 JSON 문자열로 변환해서 추가
            formData.append('request', JSON.stringify(requestData));

            console.log('FormData 생성 완료, API 호출 시작');
            console.log('request 데이터:', requestData);

            // 3. API 호출
            const response = await apiClient.post('/api/receipts/preview', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('영수증 미리보기 응답:', response.data);
            return response.data;
        } catch (error) {
            console.error('영수증 미리보기 API 오류:', error);
            throw error;
        }
    },

    // 영수증 확정 (포인트 지급)
    confirmReceipt: async (previewId) => {
        try {
            console.log('영수증 확정 시작:', previewId);

            if (!previewId) {
                throw new Error('previewId가 필요합니다.');
            }

            const response = await apiClient.post(`/api/receipts/${previewId}/confirm`, {});

            console.log('영수증 확정 응답:', response.data);
            return response.data;
        } catch (error) {
            console.error('영수증 확정 API 오류:', error);
            throw error;
        }
    },

    // URL로부터 이미지를 Blob으로 변환하는 헬퍼 함수
    urlToBlob: async (imageUrl) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            return blob;
        } catch (error) {
            console.error('이미지 URL을 Blob으로 변환 실패:', error);
            throw new Error('이미지 처리 중 오류가 발생했습니다.');
        }
    }
};

// 디버깅용 함수들 export
export const debugUtils = {
    blobToFile
};