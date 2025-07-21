import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "../layout/Layout";
import Homepage from "../pages/Homepage/Homepage";
import MeetingListPage from "../pages/MeetingList/MeetingListPage";
import CreateMeetingPage from "../pages/CreateMeeting/CreateMeetingPage";
import Loginpage from "../pages/Loginpage/Loginpage";
// import Map from "../pages/Map";
// import Chat from "../pages/Chat";
import MyPage from "../pages/Mypage/Mypage";
// import NotFound from "../pages/NotFound";

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
      <Route path="/meetings" element={<MeetingListPage />} />
      <Route path="/create-meeting" element={<CreateMeetingPage />} />
      <Route path="/mypage" element={<MyPage />} />
      {/*
      <Route path="/map" element={<Map />} />
      <Route path="/chat" element={<Chat />} />
      */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Route>
  </Routes>
);

export default AppRouter;
