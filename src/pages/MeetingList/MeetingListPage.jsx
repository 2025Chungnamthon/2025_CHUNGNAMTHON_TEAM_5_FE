import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { meetingApi } from "@/services/meetingApi.js";
import { isAuthenticated } from "@/services/auth.js";
import MeetingCard from "./component/MeetingCard";
import MeetingDetailModal from "./component/MeetingDetailModal";
import ConfirmModal from "../../components/ConfirmModal";
import { useModal } from "@/hooks/useModal.js";
import { MODAL_CONFIGS } from "@/config/modalConfigs.js";
import { useToastContext } from "../../components/ToastProvider";
import { TOAST_CONFIGS } from "@/config/toastConfigs.js";

const MOBILE_MAX_WIDTH = 430;

// 전체 페이지 컨테이너
const PageContainer = styled.div`
  max-width: ${MOBILE_MAX_WIDTH}px;
  margin: 0 auto;
  background: #fff;
  min-height: 100vh;
`;

// 상단 헤더 (모임 제목)
const PageHeader = styled.div`
  background: #fff;
  padding: 50px 20px 0 20px;
`;

// 메인 탭 (모임 / 내 모임)
const MainTabContainer = styled.div`
  display: flex;
  background: #fff;
  padding: 0 20px;
  margin-bottom: 10px;
  position: relative;
`;

const MainTab = styled.div`
  flex: 1;
  text-align: center;
  padding: 12px 0;
  font-size: 16px;
  font-weight: ${(props) => (props.active ? "600" : "500")};
  color: ${(props) => (props.active ? "#111827" : "#9ca3af")};
  cursor: pointer;
  position: relative;
  user-select: none;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${(props) => (props.active ? "#111827" : "transparent")};
    transition: all 0.3s ease;
  }
`;

// 서브 탭 (참여중 / 승인 대기 중) - 내 모임일 때만 표시
const SubTabContainer = styled.div`
  display: flex;
  background: #fff;
  margin-bottom: 5px;
`;

const SubTab = styled.button`
  padding: 12px 16px;
  background: ${(props) => (props.active ? "#494E4D" : "transparent")};
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => (props.active ? "#fff" : "#666")};
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 8px;

  &:hover {
    background: ${(props) => (props.active ? "#494E4D" : "#f5f5f5")};
  }
`;

// 모임 리스트 컨테이너
const MeetingList = styled.div`
  background: #fff;
  margin-top: 20px;
  padding-bottom: 100px; /* 하단 탭바 공간 확보 */
`;

// 로딩/에러/빈 상태 컨테이너들
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  color: #6b7280;
  font-size: 14px;
  background: #fff;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
  color: #ef4444;
  font-size: 14px;
  text-align: center;
  background: #fff;
`;

const RetryButton = styled.button`
  background: #4ecdc4;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  margin-top: 16px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #3bb5ad;
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
  color: #6b7280;
  font-size: 14px;
  text-align: center;
  background: #fff;
`;

const LoginRequiredContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
  color: #6b7280;
  font-size: 14px;
  text-align: center;
  background: #fff;
`;

const LoginButton = styled.button`
  background: #80c7bc;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  margin-top: 16px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #5fa89e;
  }
`;

const MeetingListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToastContext();

  // URL 파라미터에서 초기값 설정
  const initialMainTab = searchParams.get("tab") || "meetings";
  const initialSubTab = searchParams.get("subTab") || "approved";

  const [mainTab, setMainTab] = useState(initialMainTab); // 'meetings' or 'myMeetings'
  const [subTab, setSubTab] = useState(initialSubTab); // 'approved' or 'pending'
  const [meetings, setMeetings] = useState([]);
  const [approvedMeetings, setApprovedMeetings] = useState([]); // 참여중 모임
  const [pendingMeetings, setPendingMeetings] = useState([]); // 승인 대기중 모임
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [swipedCard, setSwipedCard] = useState(null);

  // 모달 상태
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 확인창 모달 상태
  const confirmModal = useModal();
  const [meetingToLeave, setMeetingToLeave] = useState(null);

  // 전체 모임 데이터 불러오기
  const fetchMeetings = async () => {
    try {
      console.log("전체 모임 리스트 조회 시작");
      const response = await meetingApi.getMeetings();
      console.log("전체 모임 API 응답:", response);

      const meetings = response.data || [];
      setMeetings(meetings);
    } catch (err) {
      console.error("전체 모임 리스트 조회 실패:", err);
      throw err; // 상위로 에러 전파
    }
  };

  // 참여중 내 모임 데이터 불러오기
  const fetchApprovedMeetings = async () => {
    try {
      console.log("참여중 모임 리스트 조회 시작");
      const response = await meetingApi.getMyMeetings("approved");
      console.log("참여중 모임 API 응답:", response);

      const approvedMeetings = response.data || [];
      setApprovedMeetings(approvedMeetings);
    } catch (err) {
      console.error("참여중 모임 리스트 조회 실패:", err);
      throw err;
    }
  };

  // 승인 대기중 내 모임 데이터 불러오기
  const fetchPendingMeetings = async () => {
    try {
      console.log("승인 대기중 모임 리스트 조회 시작");
      const response = await meetingApi.getMyMeetings("pending");
      console.log("승인 대기중 모임 API 응답:", response);

      const pendingMeetings = response.data || [];
      setPendingMeetings(pendingMeetings);
    } catch (err) {
      console.error("승인 대기중 모임 리스트 조회 실패:", err);
      throw err;
    }
  };

  // 전체 데이터 로드 함수
  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (mainTab === "meetings") {
        // 전체 모임만 로드
        await fetchMeetings();
      } else {
        // 내 모임인 경우 로그인 체크 후 로드
        if (!isAuthenticated()) {
          setApprovedMeetings([]);
          setPendingMeetings([]);
          return;
        }

        // 현재 선택된 서브탭에 따라 해당 데이터만 로드
        if (subTab === "approved") {
          await fetchApprovedMeetings();
        } else {
          await fetchPendingMeetings();
        }
      }
    } catch (err) {
      console.error("데이터 로드 실패:", err);
      setError(err.message || "데이터를 불러오는데 실패했습니다.");
      if (mainTab === "meetings") {
        setMeetings([]);
      } else {
        if (subTab === "approved") {
          setApprovedMeetings([]);
        } else {
          setPendingMeetings([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadAllData();
  }, [mainTab, subTab]); // mainTab과 subTab 변경 시 데이터 다시 로드

  // URL 파라미터 변경 시 상태 업데이트
  useEffect(() => {
    const urlMainTab = searchParams.get("tab");
    const urlSubTab = searchParams.get("subTab");

    if (urlMainTab && urlMainTab !== mainTab) {
      setMainTab(urlMainTab);
    }
    if (urlSubTab && urlSubTab !== subTab) {
      setSubTab(urlSubTab);
    }
  }, [searchParams]);

  // 현재 표시할 모임 리스트 결정
  const getCurrentMeetings = () => {
    if (mainTab === "meetings") {
      return meetings;
    } else {
      // 내 모임에서는 현재 선택된 서브탭에 따라 반환
      return subTab === "approved" ? approvedMeetings : pendingMeetings;
    }
  };

  // 스와이프 기능 활성화 조건 결정
  const shouldShowSwipeAction = () => {
    return mainTab === "myMeetings" && subTab === "approved";
  };

  // 메인 탭 변경 핸들러
  const handleMainTabChange = (tab) => {
    setMainTab(tab);
    setSwipedCard(null); // 스와이프 상태 초기화

    // URL 파라미터 업데이트
    if (tab === "myMeetings") {
      setSearchParams({ tab: "myMeetings", subTab: subTab });
    } else {
      setSearchParams({ tab: "meetings" });
    }
  };

  // 서브 탭 변경 핸들러
  const handleSubTabChange = (tab) => {
    setSubTab(tab);
    setSwipedCard(null); // 스와이프 상태 초기화

    // URL 파라미터 업데이트
    setSearchParams({ tab: "myMeetings", subTab: tab });
  };

  // 모임 카드 클릭 핸들러
  const handleMeetingClick = (meetingId) => {
    // "내 모임-참여중"에서만 스와이프 기능 동작
    if (mainTab === "myMeetings" && subTab === "approved") {
      // 스와이프 기능: 토글 방식
      handleSwipe(meetingId);
    } else {
      // 다른 탭에서는 클릭으로 상세 모달 열기
      console.log(`모임 ${meetingId} 카드 클릭`);
      handleViewMeeting(meetingId);
    }
  };

  // 자세히 버튼 클릭 핸들러
  const handleViewMeeting = (meetingId) => {
    console.log(`모임 ${meetingId} 자세히`);

    const meeting = getCurrentMeetings().find((m) => m.meetingId === meetingId);
    if (meeting) {
      setSelectedMeeting(meeting);
      setIsModalOpen(true);
    }
  };

  // 모달 닫기 후 리스트 새로고침용 콜백
  const handleRefreshAfterAction = () => {
    loadAllData(); // 전체 데이터 새로고침
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMeeting(null);
  };

  // 스와이프 핸들러
  const handleSwipe = (meetingId) => {
    setSwipedCard(swipedCard === meetingId ? null : meetingId);
  };

  // 나가기 버튼 클릭 핸들러 - 확인창 띄우기
  const handleLeaveMeeting = (meetingId) => {
    const meeting = getCurrentMeetings().find((m) => m.meetingId === meetingId);

    if (!meeting) {
      alert("모임 정보를 찾을 수 없습니다.");
      return;
    }

    // 나갈 모임 정보 저장하고 확인창 열기
    setMeetingToLeave(meeting);
    confirmModal.openModal();
  };

  // 실제 모임 나가기 API 호출
  const handleConfirmLeaveMeeting = async () => {
    if (!meetingToLeave) return;

    try {
      await meetingApi.leaveMeeting(meetingToLeave.meetingId);

      // 토스트 알림 표시
      showToast(TOAST_CONFIGS.MEETING_LEFT);

      // 스와이프 상태 초기화
      setSwipedCard(null);

      // 나갈 모임 정보 초기화
      setMeetingToLeave(null);

      // 데이터 새로고침
      loadAllData();
    } catch (error) {
      console.error("모임 나가기 실패:", error);
      alert(error.message || "모임 나가기에 실패했습니다.");
    }
  };

  // 확인창 취소 핸들러
  const handleCancelLeaveMeeting = () => {
    setMeetingToLeave(null);
    confirmModal.closeModal();
  };

  // 재시도 핸들러
  const handleRetry = () => {
    loadAllData();
  };

  // 로그인 버튼 클릭 핸들러
  const handleLogin = () => {
    navigate("/login");
  };

  // 현재 모임 상태 결정 (모달용)
  const getCurrentMeetingStatus = () => {
    if (mainTab === "myMeetings") {
      if (selectedMeeting?.isHost) {
        return "joined"; // 호스트는 참여중으로 처리
      }
      return subTab === "approved" ? "joined" : "pending";
    }
    return "available"; // 전체 모임에서는 가입 가능 상태
  };

  // 로딩 상태
  if (loading) {
    return (
      <PageContainer>
        <PageHeader>
          <MainTabContainer>
            <MainTab
              active={mainTab === "meetings"}
              onClick={() => handleMainTabChange("meetings")}
            >
              모임
            </MainTab>
            <MainTab
              active={mainTab === "myMeetings"}
              onClick={() => handleMainTabChange("myMeetings")}
            >
              내 모임
            </MainTab>
          </MainTabContainer>
        </PageHeader>
        <LoadingContainer>모임 리스트를 불러오고 있습니다...</LoadingContainer>
      </PageContainer>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <PageContainer>
        <PageHeader>
          <MainTabContainer>
            <MainTab
              active={mainTab === "meetings"}
              onClick={() => handleMainTabChange("meetings")}
            >
              모임
            </MainTab>
            <MainTab
              active={mainTab === "myMeetings"}
              onClick={() => handleMainTabChange("myMeetings")}
            >
              내 모임
            </MainTab>
          </MainTabContainer>
        </PageHeader>
        <ErrorContainer>
          <div>{error}</div>
          <RetryButton onClick={handleRetry}>다시 시도</RetryButton>
        </ErrorContainer>
      </PageContainer>
    );
  }

  // 내 모임 탭이지만 로그인되지 않은 경우
  if (mainTab === "myMeetings" && !isAuthenticated()) {
    return (
      <PageContainer>
        <PageHeader>
          <MainTabContainer>
            <MainTab
              active={mainTab === "meetings"}
              onClick={() => handleMainTabChange("meetings")}
            >
              모임
            </MainTab>
            <MainTab
              active={mainTab === "myMeetings"}
              onClick={() => handleMainTabChange("myMeetings")}
            >
              내 모임
            </MainTab>
          </MainTabContainer>
        </PageHeader>
        <LoginRequiredContainer>
          <div>로그인이 필요한 서비스입니다.</div>
          <div>로그인 후 내 모임을 확인해보세요!</div>
          <LoginButton onClick={handleLogin}>로그인하기</LoginButton>
        </LoginRequiredContainer>
      </PageContainer>
    );
  }

  const currentMeetings = getCurrentMeetings();

  // 빈 상태
  if (currentMeetings.length === 0) {
    const emptyMessage =
      mainTab === "meetings"
        ? {
            main: "등록된 모임이 없습니다.",
            sub: "새로운 모임을 만들어보세요!",
          }
        : subTab === "approved"
        ? {
            main: "참여중인 모임이 없습니다.",
            sub: "새로운 모임에 가입해보세요!",
          }
        : {
            main: "승인 대기중인 모임이 없습니다.",
            sub: "모임에 가입 신청해보세요!",
          };

    return (
      <PageContainer>
        <PageHeader>
          <MainTabContainer>
            <MainTab
              active={mainTab === "meetings"}
              onClick={() => handleMainTabChange("meetings")}
            >
              모임
            </MainTab>
            <MainTab
              active={mainTab === "myMeetings"}
              onClick={() => handleMainTabChange("myMeetings")}
            >
              내 모임
            </MainTab>
          </MainTabContainer>

          {mainTab === "myMeetings" && (
            <SubTabContainer>
              <SubTab
                active={subTab === "approved"}
                onClick={() => handleSubTabChange("approved")}
              >
                참여중
              </SubTab>
              <SubTab
                active={subTab === "pending"}
                onClick={() => handleSubTabChange("pending")}
              >
                승인 대기 중
              </SubTab>
            </SubTabContainer>
          )}
        </PageHeader>
        <EmptyContainer>
          <div>{emptyMessage.main}</div>
          <div>{emptyMessage.sub}</div>
        </EmptyContainer>
      </PageContainer>
    );
  }

  // 메인 렌더링
  return (
    <PageContainer>
      <PageHeader>
        <MainTabContainer>
          <MainTab
            active={mainTab === "meetings"}
            onClick={() => handleMainTabChange("meetings")}
          >
            모임
          </MainTab>
          <MainTab
            active={mainTab === "myMeetings"}
            onClick={() => handleMainTabChange("myMeetings")}
          >
            내 모임
          </MainTab>
        </MainTabContainer>

        {mainTab === "myMeetings" && (
          <SubTabContainer>
            <SubTab
              active={subTab === "approved"}
              onClick={() => handleSubTabChange("approved")}
            >
              참여중
            </SubTab>
            <SubTab
              active={subTab === "pending"}
              onClick={() => handleSubTabChange("pending")}
            >
              승인 대기 중
            </SubTab>
          </SubTabContainer>
        )}
      </PageHeader>

      <MeetingList>
        {currentMeetings.map((meeting) => (
          <MeetingCard
            key={meeting.meetingId}
            meeting={meeting}
            onCardClick={handleMeetingClick}
            onActionClick={handleViewMeeting}
            onLeaveClick={handleLeaveMeeting}
            showSwipeAction={shouldShowSwipeAction()}
            swiped={swipedCard === meeting.meetingId}
            actionButtonText={
              mainTab === "myMeetings" && subTab === "pending"
                ? "대기중"
                : "자세히"
            }
          />
        ))}
      </MeetingList>

      {/* 모임 상세 모달 */}
      <MeetingDetailModal
        meeting={selectedMeeting}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onRefresh={handleRefreshAfterAction}
        meetingStatus={getCurrentMeetingStatus()}
      />

      {/* 나가기 확인 모달 */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={handleCancelLeaveMeeting}
        title={MODAL_CONFIGS.LEAVE_JOINED_MEETING.title}
        cancelText={MODAL_CONFIGS.LEAVE_JOINED_MEETING.cancelText}
        confirmText={MODAL_CONFIGS.LEAVE_JOINED_MEETING.confirmText}
        onConfirm={handleConfirmLeaveMeeting}
        primaryColor={MODAL_CONFIGS.LEAVE_JOINED_MEETING.primaryColor}
      />
    </PageContainer>
  );
};

export default MeetingListPage;
