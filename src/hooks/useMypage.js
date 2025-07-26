import { useEffect, useState } from "react";
import { mypageApi } from "../services/mypageApi";

export const useMypage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMypage = async () => {
      try {
        const res = await mypageApi.getMypage();
        setUserInfo(res.data.data);
      } catch (err) {
        console.error("마이페이지 정보 가져오기 실패:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMypage();
  }, []);

  return { userInfo, isLoading, error };
};
