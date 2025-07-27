import axios from "axios";
import { getAuthToken } from "@/stores/authStore";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const getAllCoupons = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/coupons`);
    console.log("[couponApi] 전체 쿠폰 리스트:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("[couponApi] 전체 쿠폰 조회 실패:", error);
    throw error;
  }
};

export const getMyCoupons = async () => {
  try {
    const accessToken = getAuthToken();
    console.log("[couponApi] Access token:", accessToken); // Debug token

    const response = await axios.get(`${API_BASE_URL}/api/coupons/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("[couponApi] 내 쿠폰 리스트 전체 응답:", response.data);

    const couponData = response.data.data;

    if (!Array.isArray(couponData)) {
      console.warn("[couponApi] 예상과 다른 형식의 응답:", couponData);
    }

    return couponData;
  } catch (error) {
    console.error("[couponApi] 내 쿠폰 조회 실패:", error.response || error);
    throw error;
  }
};

export const useCoupon = async (couponId, confirmCode) => {
  try {
    const accessToken = getAuthToken();

    // confirmCode를 숫자로 변환
    const numericConfirmCode = parseInt(confirmCode, 10);

    console.log("[couponApi] 쿠폰 사용 요청:", {
      couponId: couponId,
      confirmCode: numericConfirmCode,
    });

    const response = await axios.post(
      `${API_BASE_URL}/api/coupons/use`,
      {
        couponId: couponId,
        confirmCode: numericConfirmCode,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("[couponApi] 쿠폰 사용 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("[couponApi] 쿠폰 사용 실패:", error.response || error);
    throw error;
  }
};

export const exchangeCoupon = async (couponId) => {
  try {
    const accessToken = getAuthToken();

    console.log("[couponApi] 쿠폰 교환 요청:", {
      couponId: couponId,
    });

    const response = await axios.post(
      `${API_BASE_URL}/api/coupons/exchange`,
      {
        couponId: couponId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("[couponApi] 쿠폰 교환 성공:", response.data);
    return response.data;
  } catch (error) {
    console.error("[couponApi] 쿠폰 교환 실패:", error.response || error);
    throw error;
  }
};
