// utils/geolocationUtils.js
export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        // Geolocation API 지원 확인
        if (!navigator.geolocation) {
            reject(new Error('이 브라우저는 위치 서비스를 지원하지 않습니다.'));
            return;
        }

        const options = {
            enableHighAccuracy: true, // 높은 정확도 요청
            timeout: 10000,          // 10초 타임아웃
            maximumAge: 300000       // 5분간 캐시된 위치 사용 가능
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;

                console.log('위치 정보 획득 성공:', {
                    latitude,
                    longitude,
                    accuracy: `${accuracy}m`
                });

                resolve({
                    latitude,
                    longitude,
                    accuracy
                });
            },
            (error) => {
                let errorMessage = '';

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = '위치 접근 권한이 거부되었습니다. 설정에서 위치 권한을 허용해주세요.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = '위치 정보를 사용할 수 없습니다. GPS가 활성화되어 있는지 확인해주세요.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = '위치 정보를 가져오는 데 시간이 너무 오래 걸립니다. 다시 시도해주세요.';
                        break;
                    default:
                        errorMessage = '위치 정보를 가져오는 중 오류가 발생했습니다.';
                        break;
                }

                console.error('위치 정보 획득 실패:', error);
                reject(new Error(errorMessage));
            },
            options
        );
    });
};

// 위치 권한 상태 확인 (Navigator.permissions API 사용)
export const checkLocationPermission = async () => {
    try {
        if ('permissions' in navigator) {
            const result = await navigator.permissions.query({ name: 'geolocation' });
            return result.state; // 'granted', 'denied', 'prompt'
        }
        return 'unknown';
    } catch (error) {
        console.error('권한 확인 실패:', error);
        return 'unknown';
    }
};

// 위치 정보를 시도하고 결과를 반환하는 래퍼 함수
export const getLocationForReceipt = async () => {
    try {
        // 먼저 권한 상태 확인
        const permission = await checkLocationPermission();
        console.log('위치 권한 상태:', permission);

        if (permission === 'denied') {
            throw new Error('위치 접근 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.');
        }

        // 위치 정보 가져오기
        const location = await getCurrentLocation();

        return {
            success: true,
            data: {
                latitude: location.latitude,
                longitude: location.longitude
            },
            accuracy: location.accuracy
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            data: null
        };
    }
};

// 두 지점 간의 거리 계산 (하버사인 공식)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // km

    return distance * 1000; // m로 변환
};