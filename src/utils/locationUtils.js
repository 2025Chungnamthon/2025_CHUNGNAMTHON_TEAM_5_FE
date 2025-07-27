export const LOCATION_MAP = {
    // 동남구
    MOKCHEON: '목천읍',
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
    BULDANG1: '불당1동',
    BULDANG2: '불당2동',
    BUSEONG1: '부성1동',
    BUSEONG2: '부성2동',
};

// 영문 지역명을 한글로 변환
export const getLocationKorean = (englishLocation) => {
    if (!englishLocation) return '';
    return LOCATION_MAP[englishLocation] || englishLocation;
};

// 한글 지역명을 영문 코드로 변환
export const getLocationCode = (koreanLocation) => {
    if (!koreanLocation) return '';

    // 역방향 매핑을 위한 객체 생성
    const reverseMap = Object.entries(LOCATION_MAP).reduce((acc, [code, korean]) => {
        acc[korean] = code;
        return acc;
    }, {});

    return reverseMap[koreanLocation] || koreanLocation;
};

// 모든 지역 목록 가져오기
export const getAllLocations = () => {
    return Object.values(LOCATION_MAP);
};

// 모든 지역 코드 가져오기
export const getAllLocationCodes = () => {
    return Object.keys(LOCATION_MAP);
};

// 지역이 유효한지 확인
export const isValidLocation = (location) => {
    return Object.values(LOCATION_MAP).includes(location) ||
        Object.keys(LOCATION_MAP).includes(location);
};