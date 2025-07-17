import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import Homepage from "../pages/Homepage/Homepage";
// import Groups from "../pages/Groups";
// import Map from "../pages/Map";
// import Chat from "../pages/Chat";
// import MyPage from "../pages/MyPage";
// import NotFound from "../pages/NotFound";

const AppRouter = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<Homepage />} />
      {/*
      <Route path="/groups" element={<Groups />} />
      <Route path="/map" element={<Map />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/mypage" element={<MyPage />} />
      */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Route>
  </Routes>
);

export default AppRouter;
