export const LOCATION_MAP = {
  // 동남구
  MOKCHEON: "목천읍",
  PUNGSAE: "풍세면",
  GWANGDEOK: "광덕면",
  BUK: "북면",
  SEONGNAM: "성남면",
  SUSIN: "수신면",
  BYEONGCHEON: "병천면",
  DONG: "동면",
  JUNGANG: "중앙동",
  MUNSEONG: "문성동",
  WONSEONG1: "원성1동",
  WONSEONG2: "원성2동",
  BONGMYEONG: "봉명동",
  ILBONG: "일봉동",
  SINBANG: "신방동",
  CHEONGRYONG: "청룡동",
  SINAN: "신안동",

  // 서북구
  SEONGHWAN: "성환읍",
  SEONGGEO: "성거읍",
  JIKSAN: "직산읍",
  IPJANG: "입장면",
  SEONGJEONG1: "성정1동",
  SEONGJEONG2: "성정2동",
  SSANGYONG1: "쌍용1동",
  SSANGYONG2: "쌍용2동",
  SSANGYONG3: "쌍용3동",
  BAEKSEOK: "백석동",
  BULDANG1: "불당1동",
  BULDANG2: "불당2동",
  BUSEONG1: "부성1동",
  BUSEONG2: "부성2동",
};

// 영문 지역명을 한글로 변환
export const getLocationKorean = (englishLocation) => {
  if (!englishLocation) return "";
  return LOCATION_MAP[englishLocation] || englishLocation;
};

// 한글 지역명을 영문 코드로 변환
export const getLocationCode = (koreanLocation) => {
  if (!koreanLocation) return "";

  // 역방향 매핑을 위한 객체 생성
  const reverseMap = Object.entries(LOCATION_MAP).reduce(
    (acc, [code, korean]) => {
      acc[korean] = code;
      return acc;
    },
    {}
  );

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
  return (
    Object.values(LOCATION_MAP).includes(location) ||
    Object.keys(LOCATION_MAP).includes(location)
  );
};

// 주소를 좌표로 변환하는 함수
export const geocodeAddress = (address) => {
  return new Promise((resolve, reject) => {
    if (!window.kakao || !window.kakao.maps) {
      reject(new Error("카카오맵 API가 로드되지 않았습니다."));
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
        resolve({
          latitude: parseFloat(result[0].y),
          longitude: parseFloat(result[0].x),
          address: result[0].address.address_name,
          roadAddress:
            result[0].road_address?.address_name ||
            result[0].address.address_name,
        });
      } else {
        // 더 구체적인 에러 메시지 제공
        let errorMessage = "주소 변환 실패";
        switch (status) {
          case window.kakao.maps.services.Status.ZERO_RESULT:
            errorMessage = "ZERO_RESULT: 해당 주소를 찾을 수 없습니다.";
            break;
          case window.kakao.maps.services.Status.ERROR:
            errorMessage = "ERROR: 지오코딩 서비스 오류가 발생했습니다.";
            break;
          default:
            errorMessage = `주소 변환 실패: ${status}`;
        }
        reject(new Error(errorMessage));
      }
    });
  });
};

// 여러 주소를 일괄 변환하는 함수
export const geocodeAddresses = async (addresses) => {
  const results = [];
  const errors = [];

  for (let i = 0; i < addresses.length; i++) {
    try {
      const result = await geocodeAddress(addresses[i]);
      results.push({
        originalAddress: addresses[i],
        ...result,
      });
    } catch (error) {
      errors.push({
        address: addresses[i],
        error: error.message,
      });
    }

    // API 호출 제한을 위한 딜레이
    if (i < addresses.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }

  return { results, errors };
};

// 주소 정제 함수
export const refineAddress = (address) => {
  if (!address) return "";

  let refined = address.trim();

  // 불필요한 문자 제거
  refined = refined.replace(/[()]/g, ""); // 괄호 제거
  refined = refined.replace(/\s+/g, " "); // 연속된 공백을 하나로

  // 천안시 주소인지 확인하고 개선
  if (refined.includes("충남 천안시")) {
    // 이미 충남 천안시가 포함된 경우 그대로 사용
    return refined;
  } else if (refined.includes("천안시")) {
    // 천안시만 있는 경우 충남 추가
    return `충남 ${refined}`;
  } else {
    // 천안시가 없는 경우 추가
    return `충남 천안시 ${refined}`;
  }
};

// 대체 주소 생성 함수
export const createAlternativeAddress = (originalAddress) => {
  if (!originalAddress) return "충남 천안시";

  let alternative = originalAddress.trim();

  // 괄호와 특수문자 제거
  alternative = alternative.replace(/[()]/g, "");
  alternative = alternative.replace(/[^\w\s가-힣]/g, "");

  // 주소에서 동/읍/면 추출
  const match = alternative.match(/(동남구|서북구)\s*([가-힣]+(동|읍|면))/);
  if (match) {
    return `충남 천안시 ${match[1]} ${match[2]}`;
  }

  // 기본적으로 천안시 중심으로 설정
  return "충남 천안시";
};

// 거리 계산 함수 (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // 지구 반지름 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // km 단위
};

// 천안시 중심 좌표
export const CHEONAN_CENTER = {
  latitude: 36.8151,
  longitude: 127.1139,
};
