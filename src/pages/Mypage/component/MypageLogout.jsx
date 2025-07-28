import React from "react";
import styled from "styled-components";
import { useLogout } from "@/hooks/useAuth.js";
import ConfirmModal from "../../../components/ConfirmModal";
import { useModal } from "@/hooks/useModal.js";
import { MODAL_CONFIGS } from "@/config/modalConfigs.js";

const LogoutContainer = styled.div`
  padding: 0 16px;
`;

const LogoutText = styled.div`
  color: #a0a0a0;
  font-size: 14px;
  text-align: left;
  padding: 0 16px 12px 16px;
  background-color: transparent;
  cursor: pointer;
`;

const MypageLogout = () => {
    const logoutMutation = useLogout();
    const logoutModal = useModal();

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    return (
        <LogoutContainer>
            <LogoutText onClick={logoutModal.openModal}>
                {logoutMutation.isPending ? "로그아웃 중..." : "로그아웃"}
            </LogoutText>

            <ConfirmModal
                isOpen={logoutModal.isOpen}
                onClose={logoutModal.closeModal}
                onConfirm={handleLogout}
                {...MODAL_CONFIGS.LOGOUT}
            />
        </LogoutContainer>
    );
};

export default MypageLogout;