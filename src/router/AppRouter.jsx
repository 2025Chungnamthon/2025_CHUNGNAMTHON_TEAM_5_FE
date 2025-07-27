import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "../layout/Layout";
import Homepage from "../pages/Homepage/Homepage";
import MeetingListPage from "../pages/MeetingList/MeetingListPage";
import CreateMeetingPage from "../pages/CreateMeeting/CreateMeetingPage";
import MapPage from "../pages/Map/MapPage";
import Loginpage from "../pages/Loginpage/Loginpage";
import MyPage from "../pages/Mypage/Mypage";
import CouponPage from "../pages/Mypage/Coupon/CouponPage";
import PointHistoryPage from "../pages/Mypage/PointHistory/PointHistoryPage";
import AffiliatedStoresPage from "../pages/AffiliatedStores/AffiliatedStoresPage";
import MemberManagementPage from "../pages/MemberManagement/MemberManagementPage";
import CallbackPage from "../pages/CallbackPage/CallbackPage";
import { useAuthStore } from "../stores/authStore";
// import NotFound from "../pages/NotFound";

// 인증 확인 함수 (Zustand 스토어 사용)
function isAuthenticated() {
  return useAuthStore.getState().isAuthenticated;
}

function PrivateRoute({ children }) {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

const AppRouter = () => (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/meetings" element={<MeetingListPage />} />
        {/* 모임 생성/수정 페이지 - 같은 컴포넌트로 두 경로 모두 처리 */}
        <Route path="/create-meeting" element={<CreateMeetingPage />} />
        <Route path="/meetings/create" element={<CreateMeetingPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/coupon" element={<CouponPage />} />
        <Route path="/point-history" element={<PointHistoryPage />} />
        <Route path="/affiliated-stores" element={<AffiliatedStoresPage />} />
        <Route path="/meetings/:meetingId/members" element={<MemberManagementPage />} />
        {/* 필요시 인증이 필요한 라우트들
            <Route path="/protected" element={
                <PrivateRoute>
                    <SomeProtectedComponent />
                </PrivateRoute>
            }/>
            */}
      </Route>
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
);

export default AppRouter;