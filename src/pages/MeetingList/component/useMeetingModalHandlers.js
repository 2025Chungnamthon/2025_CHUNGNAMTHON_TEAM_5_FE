import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { meetingApi } from '../../../services/meetingApi';
import { useToastContext } from '../../../components/ToastNotification';
import { TOAST_CONFIGS } from '../../../config/toastConfigs';

export const useMeetingModalHandlers = (currentMeeting, onClose, onRefresh) => {
    const navigate = useNavigate();
    const [actionLoading, setActionLoading] = useState(false);
    const { showToast } = useToastContext();

    // 가입 신청 처리
    const handleJoinMeeting = useCallback(async () => {
        console.log('🚀 가입 신청 버튼 클릭됨!');
        console.log('currentMeeting:', currentMeeting);
        console.log('meetingId:', currentMeeting?.meetingId);

        if (!currentMeeting?.meetingId) {
            console.error('❌ meetingId가 없습니다!');
            alert('모임 정보를 찾을 수 없습니다.');
            return;
        }

        try {
            setActionLoading(true);
            console.log('📡 API 호출 시작:', currentMeeting.meetingId);

            const response = await meetingApi.joinMeeting(currentMeeting.meetingId);
            console.log('✅ 가입 신청 응답:', response);

            showToast(TOAST_CONFIGS.JOIN_REQUESTED);
            onClose();

            if (onRefresh) {
                onRefresh();
            }
        } catch (error) {
            console.error('❌ 가입 신청 실패:', error);
            alert(error.message || '가입 신청에 실패했습니다.');
        } finally {
            setActionLoading(false);
        }
    }, [currentMeeting, onClose, onRefresh, showToast]);

    // 오픈채팅 참가
    const handleOpenChat = useCallback(() => {
        console.log('💬 오픈채팅 참가:', currentMeeting?.openChatUrl);

        if (currentMeeting?.openChatUrl) {
            window.open(currentMeeting.openChatUrl, '_blank');
        } else {
            alert('오픈채팅 링크가 없습니다.');
        }
    }, [currentMeeting]);

    // 모임 수정
    const handleEditMeeting = useCallback((detailData) => {
        const editData = detailData || currentMeeting;
        console.log('🔧 수정하기 - 전달할 데이터:', editData);

        const editParams = new URLSearchParams({
            mode: 'edit',
            meetingId: editData.meetingId
        });

        navigate(`/create-meeting?${editParams.toString()}`, {
            state: {
                editMode: true,
                meetingData: editData
            }
        });
    }, [currentMeeting, navigate]);

    // 멤버 관리
    const handleManageMembers = useCallback(() => {
        console.log(`모임 ${currentMeeting.meetingId} 멤버 관리`);
        navigate(`/meetings/${currentMeeting.meetingId}/members`);
    }, [currentMeeting, navigate]);

    // 모임 삭제 - 확인창용 함수로 변경
    const handleDeleteMeeting = useCallback(() => {
        // 확인창을 열기 위해 콜백 반환
        return {
            type: 'DELETE_MEETING',
            meeting: currentMeeting
        };
    }, [currentMeeting]);

    // 실제 모임 삭제 API 호출
    const handleConfirmDeleteMeeting = useCallback(async () => {
        if (!currentMeeting?.meetingId) return;

        try {
            setActionLoading(true);

            console.log('🗑️ 모임 삭제 시작:', currentMeeting.meetingId);
            const response = await meetingApi.deleteMeeting(currentMeeting.meetingId);
            console.log('🗑️ 모임 삭제 응답:', response);

            showToast(TOAST_CONFIGS.MEETING_DELETED);
            onClose();

            // 내 모임 참여중 리스트로 이동
            navigate('/meetings?tab=myMeetings&subTab=approved');

            if (onRefresh) {
                onRefresh();
            }
        } catch (error) {
            console.error('🚨 모임 삭제 실패:', error);

            let errorMessage = '모임 삭제에 실패했습니다.';

            if (error.message.includes('500')) {
                errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.\n\n관리자에게 문의하시기 바랍니다.';
            } else if (error.message.includes('403') || error.message.includes('권한')) {
                errorMessage = '모임을 삭제할 권한이 없습니다.';
            } else if (error.message.includes('404') || error.message.includes('찾을 수 없습니다')) {
                errorMessage = '삭제하려는 모임을 찾을 수 없습니다.';
            } else if (error.message.includes('네트워크')) {
                errorMessage = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.';
            } else if (error.message) {
                errorMessage = `삭제 실패: ${error.message}`;
            }

            alert(errorMessage);
        } finally {
            setActionLoading(false);
        }
    }, [currentMeeting, onClose, onRefresh, navigate, showToast]);

    // 모임 나가기 - 확인창용 함수로 변경
    const handleLeaveMeeting = useCallback(() => {
        // 확인창을 열기 위해 콜백 반환
        return {
            type: 'LEAVE_MEETING',
            meeting: currentMeeting
        };
    }, [currentMeeting]);

    // 실제 모임 나가기 API 호출
    const handleConfirmLeaveMeeting = useCallback(async () => {
        if (!currentMeeting?.meetingId) return;

        try {
            setActionLoading(true);
            console.log(`모임 ${currentMeeting.meetingId} 나가기 시작`);

            await meetingApi.leaveMeeting(currentMeeting.meetingId);

            showToast(TOAST_CONFIGS.MEETING_LEFT);
            onClose();

            if (onRefresh) {
                onRefresh();
            }
        } catch (error) {
            console.error('모임 나가기 실패:', error);
            alert(error.message || '모임 나가기에 실패했습니다.');
        } finally {
            setActionLoading(false);
        }
    }, [currentMeeting, onClose, onRefresh, showToast]);

    // 가입 신청 취소 - 확인창용 함수로 변경
    const handleCancelApplication = useCallback(() => {
        // 확인창을 열기 위해 콜백 반환
        return {
            type: 'CANCEL_APPLICATION',
            meeting: currentMeeting
        };
    }, [currentMeeting]);

    // 실제 가입 신청 취소 API 호출
    const handleConfirmCancelApplication = useCallback(async () => {
        if (!currentMeeting?.meetingId) return;

        try {
            setActionLoading(true);
            console.log(`모임 ${currentMeeting.meetingId} 신청 취소 시작`);

            await meetingApi.cancelJoinRequest(currentMeeting.meetingId);

            showToast(TOAST_CONFIGS.JOIN_CANCELLED);
            onClose();

            if (onRefresh) {
                onRefresh();
            }
        } catch (error) {
            console.error('신청 취소 실패:', error);
            alert(error.message || '신청 취소에 실패했습니다.');
        } finally {
            setActionLoading(false);
        }
    }, [currentMeeting, onClose, onRefresh, showToast]);

    // 메인 액션 버튼 클릭 핸들러
    const handleActionClick = useCallback((buttonConfig) => {
        console.log('🖱️ 액션 버튼 클릭됨!');
        console.log('actionLoading:', actionLoading);
        console.log('buttonConfig:', buttonConfig);

        if (actionLoading) {
            console.log('⏳ 로딩 중이므로 무시');
            return;
        }

        switch (buttonConfig.action) {
            case 'join':
                console.log('🔄 가입 신청 실행');
                handleJoinMeeting();
                break;
            case 'openChat':
                console.log('💬 오픈채팅 실행');
                handleOpenChat();
                break;
            default:
                console.log('❓ 알 수 없는 액션:', buttonConfig.action);
                break;
        }
    }, [actionLoading, handleJoinMeeting, handleOpenChat]);

    // 메뉴 액션 처리 - 확인창이 필요한 액션들은 콜백 반환
    const handleMenuAction = useCallback((action, detailData) => {
        const actionMap = {
            edit: () => handleEditMeeting(detailData),
            members: handleManageMembers,
            delete: handleDeleteMeeting,
            leave: handleLeaveMeeting,
            cancel: handleCancelApplication
        };

        const handler = actionMap[action];
        if (handler) {
            return handler();
        }
    }, [handleEditMeeting, handleManageMembers, handleDeleteMeeting, handleLeaveMeeting, handleCancelApplication]);

    return {
        actionLoading,
        handleActionClick,
        handleMenuAction,
        handleJoinMeeting,
        handleOpenChat,
        handleEditMeeting,
        handleConfirmDeleteMeeting,
        handleConfirmLeaveMeeting,
        handleConfirmCancelApplication
    };
};