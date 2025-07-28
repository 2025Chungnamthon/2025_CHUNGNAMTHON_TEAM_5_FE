import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { meetingApi } from "@/services/meetingApi.js";
import { useToastContext } from "@/components/ToastProvider.jsx";
import { TOAST_CONFIGS, ERROR_TOAST_CONFIGS } from "@/config/toastConfigs.js";

export const useMeetingModalHandlers = (currentMeeting, onClose, onRefresh) => {
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState(false);
  const { showToast } = useToastContext();

  // 가입 신청 처리
  const handleJoinMeeting = useCallback(async () => {
    console.log("🚀 가입 신청 버튼 클릭됨!");
    console.log("currentMeeting:", currentMeeting);

    // meetingId 또는 id 필드에서 meetingId 가져오기
    const meetingId = currentMeeting?.meetingId || currentMeeting?.id;
    console.log("meetingId:", meetingId);

    if (!meetingId) {
      console.error("❌ meetingId가 없습니다!");
      showToast(ERROR_TOAST_CONFIGS.MEETING_NOT_FOUND, { type: "error" });
      return;
    }

    try {
      setActionLoading(true);
      console.log("📡 API 호출 시작:", meetingId);

      const response = await meetingApi.joinMeeting(meetingId);
      console.log("✅ 가입 신청 응답:", response);

      showToast(TOAST_CONFIGS.JOIN_REQUESTED);
      onClose();

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("❌ 가입 신청 실패:", error);
      showToast(error.message || ERROR_TOAST_CONFIGS.JOIN_REQUEST_FAILED, {
        type: "error",
      });
    } finally {
      setActionLoading(false);
    }
  }, [currentMeeting, onClose, onRefresh, showToast]);

  // 오픈채팅 참가
  const handleOpenChat = useCallback(() => {
    console.log("💬 오픈채팅 참가:", currentMeeting?.openChatUrl);

    if (currentMeeting?.openChatUrl) {
      window.open(currentMeeting.openChatUrl, "_blank");
    } else {
      showToast(ERROR_TOAST_CONFIGS.NO_OPENCHAT_LINK, { type: "error" });
    }
  }, [currentMeeting, showToast]);

  // 모임 수정
  const handleEditMeeting = useCallback(
    (detailData) => {
      const editData = detailData || currentMeeting;
      console.log("🔧 수정하기 - 전달할 데이터:", editData);

      const meetingId = editData.meetingId || editData.id;
      const editParams = new URLSearchParams({
        mode: "edit",
        meetingId: meetingId,
      });

      navigate(`/create-meeting?${editParams.toString()}`, {
        state: {
          editMode: true,
          meetingData: editData,
        },
      });
    },
    [currentMeeting, navigate]
  );

  // 멤버 관리
  const handleManageMembers = useCallback(() => {
    const meetingId = currentMeeting.meetingId || currentMeeting.id;
    console.log(`모임 ${meetingId} 멤버 관리`);
    navigate(`/meetings/${meetingId}/members`);
  }, [currentMeeting, navigate]);

  // 모임 삭제 - 확인창용 함수로 변경
  const handleDeleteMeeting = useCallback(() => {
    // 확인창을 열기 위해 콜백 반환
    return {
      type: "DELETE_MEETING",
      meeting: currentMeeting,
    };
  }, [currentMeeting]);

  // 실제 모임 삭제 API 호출
  const handleConfirmDeleteMeeting = useCallback(async () => {
    const meetingId = currentMeeting?.meetingId || currentMeeting?.id;
    if (!meetingId) return;

    try {
      setActionLoading(true);

      console.log("🗑️ 모임 삭제 시작:", meetingId);
      const response = await meetingApi.deleteMeeting(meetingId);
      console.log("🗑️ 모임 삭제 응답:", response);

      showToast(TOAST_CONFIGS.MEETING_DELETED);
      onClose();

      // 내 모임 참여중 리스트로 이동
      navigate("/meetings?tab=myMeetings&subTab=approved");

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("🚨 모임 삭제 실패:", error);

      let errorMessage = ERROR_TOAST_CONFIGS.DELETE_MEETING_FAILED;

      if (error.message.includes("500")) {
        errorMessage = ERROR_TOAST_CONFIGS.SERVER_ERROR;
      } else if (
        error.message.includes("403") ||
        error.message.includes("권한")
      ) {
        errorMessage = ERROR_TOAST_CONFIGS.NO_PERMISSION;
      } else if (
        error.message.includes("404") ||
        error.message.includes("찾을 수 없습니다")
      ) {
        errorMessage = ERROR_TOAST_CONFIGS.MEETING_NOT_FOUND;
      } else if (error.message.includes("네트워크")) {
        errorMessage = ERROR_TOAST_CONFIGS.NETWORK_ERROR;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showToast(errorMessage, { type: "error" });
    } finally {
      setActionLoading(false);
    }
  }, [currentMeeting, onClose, onRefresh, navigate, showToast]);

  // 모임 나가기 - 확인창용 함수로 변경
  const handleLeaveMeeting = useCallback(() => {
    // 확인창을 열기 위해 콜백 반환
    return {
      type: "LEAVE_MEETING",
      meeting: currentMeeting,
    };
  }, [currentMeeting]);

  // 실제 모임 나가기 API 호출
  const handleConfirmLeaveMeeting = useCallback(async () => {
    const meetingId = currentMeeting?.meetingId || currentMeeting?.id;
    if (!meetingId) return;

    try {
      setActionLoading(true);
      console.log(`모임 ${meetingId} 나가기 시작`);

      await meetingApi.leaveMeeting(meetingId);

      showToast(TOAST_CONFIGS.MEETING_LEFT);
      onClose();

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("모임 나가기 실패:", error);
      showToast(error.message || ERROR_TOAST_CONFIGS.LEAVE_MEETING_FAILED, {
        type: "error",
      });
    } finally {
      setActionLoading(false);
    }
  }, [currentMeeting, onClose, onRefresh, showToast]);

  // 가입 신청 취소 - 확인창용 함수로 변경
  const handleCancelApplication = useCallback(() => {
    // 확인창을 열기 위해 콜백 반환
    return {
      type: "CANCEL_APPLICATION",
      meeting: currentMeeting,
    };
  }, [currentMeeting]);

  // 실제 가입 신청 취소 API 호출
  const handleConfirmCancelApplication = useCallback(async () => {
    const meetingId = currentMeeting?.meetingId || currentMeeting?.id;
    if (!meetingId) return;

    try {
      setActionLoading(true);
      console.log(`모임 ${meetingId} 신청 취소 시작`);

      await meetingApi.cancelJoinRequest(meetingId);

      showToast(TOAST_CONFIGS.JOIN_CANCELLED);
      onClose();

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("신청 취소 실패:", error);
      showToast(
        error.message || ERROR_TOAST_CONFIGS.CANCEL_APPLICATION_FAILED,
        { type: "error" }
      );
    } finally {
      setActionLoading(false);
    }
  }, [currentMeeting, onClose, onRefresh, showToast]);

  // 메인 액션 버튼 클릭 핸들러
  const handleActionClick = useCallback(
    (buttonConfig) => {
      console.log("🖱️ 액션 버튼 클릭됨!");
      console.log("actionLoading:", actionLoading);
      console.log("buttonConfig:", buttonConfig);

      if (actionLoading) {
        console.log("⏳ 로딩 중이므로 무시");
        return;
      }

      switch (buttonConfig.action) {
        case "join":
          console.log("🔄 가입 신청 실행");
          handleJoinMeeting();
          break;
        case "openChat":
          console.log("💬 오픈채팅 실행");
          handleOpenChat();
          break;
        default:
          console.log("❓ 알 수 없는 액션:", buttonConfig.action);
          break;
      }
    },
    [actionLoading, handleJoinMeeting, handleOpenChat]
  );

  // 메뉴 액션 처리 - 확인창이 필요한 액션들은 콜백 반환
  const handleMenuAction = useCallback(
    (action, detailData) => {
      const actionMap = {
        edit: () => handleEditMeeting(detailData),
        members: handleManageMembers,
        delete: handleDeleteMeeting,
        leave: handleLeaveMeeting,
        cancel: handleCancelApplication,
      };

      const handler = actionMap[action];
      if (handler) {
        return handler();
      }
    },
    [
      handleEditMeeting,
      handleManageMembers,
      handleDeleteMeeting,
      handleLeaveMeeting,
      handleCancelApplication,
    ]
  );

  return {
    actionLoading,
    handleActionClick,
    handleMenuAction,
    handleJoinMeeting,
    handleOpenChat,
    handleEditMeeting,
    handleConfirmDeleteMeeting,
    handleConfirmLeaveMeeting,
    handleConfirmCancelApplication,
  };
};
