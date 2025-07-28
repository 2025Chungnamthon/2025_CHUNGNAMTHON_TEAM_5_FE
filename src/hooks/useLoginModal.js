import { useState } from "react";
import { isAuthenticated } from "../services/auth";

export const useLoginModal = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  // 인증이 필요한 작업을 실행하는 함수
  const executeWithAuth = (action) => {
    if (isAuthenticated()) {
      return action();
    } else {
      openLoginModal();
      return false;
    }
  };

  // 인증이 필요한 페이지로 이동하는 함수
  const navigateWithAuth = (navigate, path) => {
    if (isAuthenticated()) {
      navigate(path);
    } else {
      openLoginModal();
    }
  };

  return {
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    executeWithAuth,
    navigateWithAuth,
  };
};
