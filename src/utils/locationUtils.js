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