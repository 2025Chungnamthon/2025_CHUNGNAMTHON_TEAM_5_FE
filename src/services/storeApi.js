const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// 개발용 더미 데이터
const DUMMY_STORES = [
    {
        id: 1,
        name: "봉담방동대엽마켓휘이천안신부점",
        category: "의료기기/제약",
        address: "충남 천안시 동남구 신부동",
        phoneNumber: "041-555-0426",
        latitude: 36.8151,
        longitude: 127.1139,
        businessHours: "09:00-22:00",
        isOpen: true
    },
    {
        id: 2,
        name: "랑스터디카페천안터미널점",
        category: "학원",
        address: "충남 천안시 동남구 만남로 32",
        phoneNumber: "041-555-0426",
        latitude: 36.8121,
        longitude: 127.1189,
        businessHours: "08:00-24:00",
        isOpen: true
    },
    {
        id: 3,
        name: "천안역 CGV",
        category: "영화관",
        address: "충남 천안시 동남구 역전6길",
        phoneNumber: "041-555-1234",
        latitude: 36.8095,
        longitude: 127.1478,
        businessHours: "10:00-24:00",
        isOpen: true
    },
    {
        id: 4,
        name: "신세계백화점 천안점",
        category: "백화점",
        address: "충남 천안시 서북구 신세계6길",
        phoneNumber: "041-555-5678",
        latitude: 36.8176,
        longitude: 127.1136,
        businessHours: "10:30-20:00",
        isOpen: true
    },
    {
        id: 5,
        name: "이마트 천안점",
        category: "대형마트",
        address: "충남 천안시 서북구 두정동",
        phoneNumber: "041-555-9999",
        latitude: 36.8190,
        longitude: 127.1145,
        businessHours: "10:00-23:00",
        isOpen: true
    }
];

class StoreApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // 공통 API 요청 처리 함수
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            return responseData;
        } catch (requestError) {
            console.error(`API 요청 실패 [${endpoint}]:`, requestError);

            // 개발 환경에서는 더미 데이터 반환
            const isDevelopment = import.meta.env.MODE === 'development';
            if (isDevelopment) {
                console.log('개발 환경: 더미 데이터 사용');
                return this.getDummyData(endpoint);
            }

            throw requestError;
        }
    }

    // 더미 데이터 반환 함수
    getDummyData(endpoint) {
        if (endpoint.includes('/stores')) {
            return {
                success: true,
                data: DUMMY_STORES,
                pagination: {
                    page: 1,
                    size: 20,
                    totalElements: DUMMY_STORES.length,
                    totalPages: 1
                }
            };
        }
        return {success: true, data: []};
    }

    // 전체 가맹점 목록 조회
    async getStores(params = {}) {
        try {
            const queryParams = new URLSearchParams(params).toString();
            const endpoint = `/stores${queryParams ? `?${queryParams}` : ''}`;
            return await this.request(endpoint, {method: 'GET'});
        } catch (apiError) {
            console.log('API 연결 실패, 더미 데이터 사용');
            // API 에러 정보 출력 (사용되지 않는 변수 문제 해결)
            console.debug('API 에러 상세:', apiError.message);

            return {
                success: true,
                data: DUMMY_STORES,
                pagination: {
                    page: 1,
                    size: 20,
                    totalElements: DUMMY_STORES.length,
                    totalPages: 1
                }
            };
        }
    }

    // 주변 가맹점 검색
    async getNearbyStores({latitude, longitude, radius = 1000, category = null}) {
        try {
            const params = {latitude, longitude, radius, ...(category && {category})};
            const queryParams = new URLSearchParams(params).toString();
            const endpoint = `/stores/nearby?${queryParams}`;
            return await this.request(endpoint, {method: 'GET'});
        } catch (searchError) {
            console.log('주변 검색용 더미 데이터 사용');
            console.debug('검색 에러:', searchError.message);

            // 거리 계산하여 더미 데이터 필터링
            const filteredStores = DUMMY_STORES.filter(store => {
                const distance = this.calculateDistance(latitude, longitude, store.latitude, store.longitude);
                return distance <= radius;
            });

            return {
                success: true,
                data: filteredStores,
                searchInfo: {
                    centerLatitude: latitude,
                    centerLongitude: longitude,
                    radius,
                    totalCount: filteredStores.length
                }
            };
        }
    }

    // 가맹점 검색
    async searchStores({query, category = null, page = 1, size = 20}) {
        try {
            const params = {query, page, size, ...(category && {category})};
            const queryParams = new URLSearchParams(params).toString();
            const endpoint = `/stores/search?${queryParams}`;
            return await this.request(endpoint, {method: 'GET'});
        } catch (queryError) {
            console.log('검색용 더미 데이터 사용');
            console.debug('쿼리 에러:', queryError.message);

            // 더미 데이터에서 검색
            const filteredStores = DUMMY_STORES.filter(store =>
                store.name.toLowerCase().includes(query.toLowerCase()) ||
                store.category.toLowerCase().includes(query.toLowerCase()) ||
                store.address.toLowerCase().includes(query.toLowerCase())
            );

            return {
                success: true,
                data: filteredStores,
                pagination: {
                    page: 1,
                    size: 20,
                    totalElements: filteredStores.length,
                    totalPages: 1
                }
            };
        }
    }

    // 가맹점 상세 정보 조회
    async getStoreDetail(storeId) {
        try {
            const endpoint = `/stores/${storeId}`;
            return await this.request(endpoint, {method: 'GET'});
        } catch (detailError) {
            console.log('상세 정보용 더미 데이터 사용');
            console.debug('상세 조회 에러:', detailError.message);

            const store = DUMMY_STORES.find(s => s.id === parseInt(storeId, 10));
            return {
                success: true,
                data: store || null
            };
        }
    }

    // 카테고리별 가맹점 조회
    async getStoresByCategory(category, params = {}) {
        try {
            const queryParams = new URLSearchParams({category, ...params}).toString();
            const endpoint = `/stores/category?${queryParams}`;
            return await this.request(endpoint, {method: 'GET'});
        } catch (categoryError) {
            console.log('카테고리 검색용 더미 데이터 사용');
            console.debug('카테고리 에러:', categoryError.message);

            const filteredStores = DUMMY_STORES.filter(store =>
                store.category.toLowerCase().includes(category.toLowerCase())
            );

            return {
                success: true,
                data: filteredStores
            };
        }
    }

    // 카테고리 목록 조회
    async getCategories() {
        try {
            const endpoint = '/stores/categories';
            return await this.request(endpoint, {method: 'GET'});
        } catch (categoriesError) {
            console.log('카테고리 목록용 더미 데이터 사용');
            console.debug('카테고리 목록 에러:', categoriesError.message);

            const categories = [...new Set(DUMMY_STORES.map(store => store.category))];
            return {
                success: true,
                data: categories
            };
        }
    }

    // 두 지점 간 거리 계산 (미터 단위)
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // 지구 반지름 (미터)
        const phi1 = lat1 * Math.PI / 180;
        const phi2 = lat2 * Math.PI / 180;
        const deltaPhi = (lat2 - lat1) * Math.PI / 180;
        const deltaLambda = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }
}

export const storeApi = new StoreApiService();