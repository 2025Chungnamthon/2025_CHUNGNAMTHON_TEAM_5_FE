import axios from "axios";
import authStore from "../stores/authStore";

const BASE_URL = "https://cheonon.shop/api/coupons";

export const getAllCoupons = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    console.log("[couponApi] 전체 쿠폰 리스트:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("[couponApi] 전체 쿠폰 조회 실패:", error);
    throw error;
  }
};

export const getMyCoupons = async () => {
  try {
    const accessToken = authStore.getState().accessToken;
    const response = await axios.get(`${BASE_URL}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("[couponApi] 내 쿠폰 리스트:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("[couponApi] 내 쿠폰 조회 실패:", error);
    throw error;
  }
};
