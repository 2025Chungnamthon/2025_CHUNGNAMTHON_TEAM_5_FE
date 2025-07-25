import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../stores/authStore";
import { FaUser } from "react-icons/fa";
import { mypageApi } from "../../../services/mypageApi";

const HeaderWrap = styled.div`
  padding: 32px 24px 0 24px;
  background: #f3f6f7;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #222;
  margin-bottom: 22px;
`;

const ProfileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 22px;
`;

const ProfileImg = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  background: #e5e7eb;
`;

const ProfileIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  transition: all 0.2s ease;

  svg {
    width: 36px;
    height: 36px;
  }

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    color: #64748b;
  }
`;

const Name = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #374151;
`;

const LoginContent = styled.div`
  flex: 1;
`;

const LoginText = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #374151;
  margin: 0 0 4px 0;
`;

const LoginDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`;

const DevButton = styled.button`
  background: #4f46e5;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  margin-top: 8px;

  &:hover {
    background: #4338ca;
  }
`;

const GuestHeaderSection = styled.div`
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const MypageHeader = ({ isGuest = false }) => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      console.log("[MypageHeader] 요청 시작 - 마이페이지 프로필 불러오기");
      try {
        const res = await mypageApi.getMypage();
        console.log("[MypageHeader] 전체 응답:", res);

        const userData = res;
        console.log("[MypageHeader] 파싱된 유저 데이터:", userData);
        if (userData) {
          setProfile(userData);
        } else {
          console.warn("[MypageHeader] 사용자 데이터가 존재하지 않습니다.");
        }
      } catch (err) {
        console.error("[MypageHeader] 마이페이지 데이터 불러오기 실패:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleDevLogin = (e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    const mockToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5OTk5OTk5OTl9.mock";

    // 새로운 Zustand 스토어 사용
    login(
      { accessToken: mockToken, refreshToken: null },
      {
        id: "1",
        name: "김천안",
        email: "test@example.com",
        profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
        point: 1620,
        couponCount: 3,
      }
    );

    window.location.reload();
  };

  if (isGuest) {
    return (
      <HeaderWrap>
        <Title>마이페이지</Title>
        <GuestHeaderSection onClick={handleLoginClick}>
          <ProfileRow>
            <ProfileIcon>
              <FaUser />
            </ProfileIcon>
            <LoginContent>
              <LoginText>로그인 하러 가기</LoginText>
              <LoginDescription>
                로그인 후 모임에 참여하면 포인트를 받을 수 있어요.
              </LoginDescription>
              <DevButton onClick={handleDevLogin}>
                개발용: 로그인 시뮬레이션
              </DevButton>
            </LoginContent>
          </ProfileRow>
        </GuestHeaderSection>
      </HeaderWrap>
    );
  }

  if (!profile || typeof profile !== "object") {
    return (
      <HeaderWrap>
        <Title>마이페이지</Title>
        <ProfileRow>
          <ProfileIcon>
            <FaUser />
          </ProfileIcon>
          <LoginContent>
            <LoginText>정보를 불러올 수 없습니다.</LoginText>
            <LoginDescription>
              다시 시도하거나 새로고침 해주세요.
            </LoginDescription>
          </LoginContent>
        </ProfileRow>
      </HeaderWrap>
    );
  }

  return (
    <HeaderWrap>
      <Title>마이페이지</Title>
      <ProfileRow>
        {profile?.profileImageUrl ? (
          <ProfileImg
            src={profile.profileImageUrl}
            alt={profile.userName || "프로필 이미지"}
          />
        ) : (
          <ProfileIcon>
            <FaUser />
          </ProfileIcon>
        )}
        <LoginContent>
          <LoginText>{profile?.userName || "이름 없음"}</LoginText>
        </LoginContent>
      </ProfileRow>
    </HeaderWrap>
  );
};

export default MypageHeader;
