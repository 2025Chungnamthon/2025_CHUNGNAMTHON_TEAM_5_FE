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
