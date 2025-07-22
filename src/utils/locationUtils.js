// 지역 enum을 한글로 변환하는 유틸리티

export const LOCATION_MAP = {
    // 동남구
    MOKCHEON: '목천동',
    PUNGSAE: '풍세면',
    GWANGDEOK: '광덕면',
    BUK: '북면',
    SEONGNAM: '성남면',
    SUSIN: '수신면',
    BYEONGCHEON: '병천면',
    DONG: '동면',
    JUNGANG: '중앙동',
    MUNSEONG: '문성동',
    WONSEONG1: '원성1동',
    WONSEONG2: '원성2동',
    BONGMYEONG: '봉명동',
    ILBONG: '일봉동',
    SINBANG: '신방동',
    CHEONGRYONG: '청룡동',
    SINAN: '신안동',

    // 서북구
    SEONGHWAN: '성환읍',
    SEONGGEO: '성거읍',
    JIKSAN: '직산읍',
    IPJANG: '입장면',
    SEONGJEONG1: '성정1동',
    SEONGJEONG2: '성정2동',
    SSANGYONG1: '쌍용1동',
    SSANGYONG2: '쌍용2동',
    SSANGYONG3: '쌍용3동',
    BAEKSEOK: '백석동',
    BULDANG: '불당동',
    BUSEONG1: '부성1동',
    BUSEONG2: '부성2동'
};

// 영문 지역명을 한글로 변환
export const getLocationKorean = (englishLocation) => {
    if (!englishLocation) return '';
    return LOCATION_MAP[englishLocation] || englishLocation;
};

// 한글 지역명을 영문으로 변환 (역변환)
export const getLocationEnglish = (koreanLocation) => {
    if (!koreanLocation) return '';

    const entry = Object.entries(LOCATION_MAP).find(([key, value]) => value === koreanLocation);
    return entry ? entry[0] : koreanLocation;
};

// 지역 목록을 구별로 분류해서 반환
export const getLocationsByDistrict = () => {
    return {
        dongnam: {
            name: '동남구',
            locations: [
                { value: 'MOKCHEON', label: '목천동' },
                { value: 'PUNGSAE', label: '풍세면' },
                { value: 'GWANGDEOK', label: '광덕면' },
                { value: 'BUK', label: '북면' },
                { value: 'SEONGNAM', label: '성남면' },
                { value: 'SUSIN', label: '수신면' },
                { value: 'BYEONGCHEON', label: '병천면' },
                { value: 'DONG', label: '동면' },
                { value: 'JUNGANG', label: '중앙동' },
                { value: 'MUNSEONG', label: '문성동' },
                { value: 'WONSEONG1', label: '원성1동' },
                { value: 'WONSEONG2', label: '원성2동' },
                { value: 'BONGMYEONG', label: '봉명동' },
                { value: 'ILBONG', label: '일봉동' },
                { value: 'SINBANG', label: '신방동' },
                { value: 'CHEONGRYONG', label: '청룡동' },
                { value: 'SINAN', label: '신안동' }
            ]
        },
        seobuk: {
            name: '서북구',
            locations: [
                { value: 'SEONGHWAN', label: '성환읍' },
                { value: 'SEONGGEO', label: '성거읍' },
                { value: 'JIKSAN', label: '직산읍' },
                { value: 'IPJANG', label: '입장면' },
                { value: 'SEONGJEONG1', label: '성정1동' },
                { value: 'SEONGJEONG2', label: '성정2동' },
                { value: 'SSANGYONG1', label: '쌍용1동' },
                { value: 'SSANGYONG2', label: '쌍용2동' },
                { value: 'SSANGYONG3', label: '쌍용3동' },
                { value: 'BAEKSEOK', label: '백석동' },
                { value: 'BULDANG', label: '불당동' },
                { value: 'BUSEONG1', label: '부성1동' },
                { value: 'BUSEONG2', label: '부성2동' }
            ]
        }
    };
};

// 모든 지역을 하나의 배열로 반환 (셀렉트 박스용)
export const getAllLocations = () => {
    return Object.entries(LOCATION_MAP).map(([value, label]) => ({
        value,
        label
    }));
};