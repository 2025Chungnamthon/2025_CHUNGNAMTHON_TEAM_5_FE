import React from "react";
import {Routes, Route} from "react-router-dom";
import Layout from "../layout/Layout";
import Homepage from "../pages/Homepage/Homepage";
import MeetingListPage from "../pages/MeetingList/MeetingListPage";
import CreateMeetingPage from "../pages/CreateMeeting/CreateMeetingPage";
import MapPage from "../pages/Map/MapPage";
// import Chat from "../pages/Chat";
// import MyPage from "../pages/MyPage";
// import NotFound from "../pages/NotFound";

const AppRouter = () => (
    <Routes>
        <Route element={<Layout/>}>
            <Route path="/" element={<Homepage/>}/>
            <Route path="/meetings" element={<MeetingListPage/>}/>
            <Route path="/create-meeting" element={<CreateMeetingPage/>}/>
            <Route path="/map" element={<MapPage/>}/>
            {/*
      <Route path="/chat" element={<Chat />} />
      <Route path="/mypage" element={<MyPage />} />
      */}
            {/* <Route path="*" element={<NotFound />} /> */}
        </Route>
    </Routes>
);

export default AppRouter;