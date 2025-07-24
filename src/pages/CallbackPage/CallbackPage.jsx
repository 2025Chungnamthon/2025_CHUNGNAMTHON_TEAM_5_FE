import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useOAuthLogin } from "../../hooks/useAuth";
import { FaGift, FaCoins, FaStar } from "react-icons/fa";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #ffffff;
  padding: 20px;
  position: relative;
  overflow: hidden;
`;

const Confetti = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background: ${(props) => props.color};
  border-radius: 50%;
  animation: fall ${(props) => props.duration}s linear infinite;
  left: ${(props) => props.left}%;
  animation-delay: ${(props) => props.delay}s;

  @keyframes fall {
    0% {
      transform: translateY(-100vh) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  }
`;

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const SuccessIllustration = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(255, 215, 0, 0.3);
  animation: bounce 2s ease-in-out infinite;

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

const Character = styled.div`
  font-size: 80px;
  position: relative;
`;

const PartyHorn = styled(FaStar)`
  position: absolute;
  top: -20px;
  right: -30px;
  font-size: 40px;
  color: #4a90e2;
  transform: rotate(-15deg);
  animation: blow 1s ease-in-out infinite alternate;

  @keyframes blow {
    0% {
      transform: rotate(-15deg) scale(1);
    }
    100% {
      transform: rotate(-15deg) scale(1.1);
    }
  }
`;

const Hat = styled.div`
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 30px;
  background: #4a90e2;
  border-radius: 50% 50% 0 0;
  &::after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 70px;
    height: 8px;
    background: #4a90e2;
    border-radius: 4px;
  }
`;

const PointIcon = styled(FaCoins)`
  position: absolute;
  font-size: 24px;
  color: #ffd700;
  animation: float 3s ease-in-out infinite;

  &:nth-child(1) {
    top: 20px;
    right: 30px;
    animation-delay: 0s;
  }
  &:nth-child(2) {
    bottom: 30px;
    right: 20px;
    animation-delay: 1s;
  }
  &:nth-child(3) {
    top: 40px;
    left: 20px;
    animation-delay: 2s;
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

const GiftIcon = styled(FaGift)`
  position: absolute;
  bottom: 20px;
  left: 30px;
  font-size: 24px;
  color: #4caf50;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
`;

const SuccessText = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #000000;
  margin-bottom: 12px;
`;

const RedirectText = styled.p`
  font-size: 14px;
  color: #666666;
  margin-top: 20px;
`;

const LoadingCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
`;

const Message = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 20px;
`;

const ErrorCard = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
`;

const ErrorTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #dc2626;
  margin-bottom: 8px;
`;

const ErrorMessage = styled.p`
  font-size: 14px;
  color: #7f1d1d;
  margin-bottom: 16px;
`;

const RetryButton = styled.button`
  background: #dc2626;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #b91c1c;
  }
`;

const DebugInfo = styled.div`
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 12px;
  margin-top: 16px;
  font-family: monospace;
  font-size: 12px;
  color: #374151;
`;

const CallbackPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [debugInfo, setDebugInfo] = useState("");
  const isProcessedRef = useRef(false);
  const oauthLogin = useOAuthLogin();

  useEffect(() => {
    console.log("=== CallbackPage useEffect 시작 ===");
    console.log("isProcessedRef.current:", isProcessedRef.current);

    // 이미 처리된 경우 중복 실행 방지
    if (isProcessedRef.current) {
      console.log("이미 처리됨 - 중복 실행 방지");
      return;
    }

    const handleCallback = async () => {
      try {
        console.log("=== 콜백 처리 시작 ===");

        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get("accessToken");
        const refreshToken = urlParams.get("refreshToken");
        const error = urlParams.get("error");
        const code = urlParams.get("code");

        const debugData = {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasCode: !!code,
          error,
          currentUrl: window.location.href,
          searchParams: window.location.search,
        };

        console.log("CallbackPage - 상세 디버그 정보:", debugData);
        setDebugInfo(JSON.stringify(debugData, null, 2));

        if (error) {
          console.log("에러 파라미터 발견:", error);
          setStatus("error");
          setErrorMessage(`로그인에 실패했습니다: ${error}`);
          isProcessedRef.current = true;
          return;
        }

        // accessToken이 있으면 바로 처리
        if (accessToken) {
          console.log("accessToken 발견 - 바로 처리");

          // 토큰을 Zustand 스토어에 저장
          const { login } = await import("../../services/auth");
          login(
            {
              accessToken,
              refreshToken: refreshToken || null,
            },
            null
          );

          console.log("카카오 로그인 성공! 토큰이 저장되었습니다.");

          // URL 정리
          const cleanUrl = new URL(window.location);
          cleanUrl.searchParams.delete("accessToken");
          cleanUrl.searchParams.delete("refreshToken");
          cleanUrl.searchParams.delete("error");
          cleanUrl.searchParams.delete("code");
          window.history.replaceState({}, document.title, cleanUrl.toString());
        } else {
          // OAuth 로그인 뮤테이션 실행 (code가 있는 경우)
          await oauthLogin.mutateAsync();
        }

        setStatus("success");
        isProcessedRef.current = true;

        // 3초 후 홈페이지로 리다이렉트
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 3000);
      } catch (error) {
        console.error("콜백 처리 중 오류:", error);
        setStatus("error");
        setErrorMessage(`로그인 처리 중 오류가 발생했습니다: ${error.message}`);
        isProcessedRef.current = true;
      }
    };

    handleCallback();
  }, [oauthLogin, navigate]);

  const handleRetry = () => {
    navigate("/login", { replace: true });
  };

  // 컨페티 효과를 위한 색상 배열
  const confettiColors = [
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#96ceb4",
    "#feca57",
    "#ff9ff3",
    "#54a0ff",
  ];

  if (status === "loading") {
    return (
      <PageContainer>
        <LoadingCard>
          <LoadingSpinner />
          <Title>로그인 처리 중...</Title>
          <Message>잠시만 기다려주세요.</Message>
          {debugInfo && (
            <DebugInfo>
              <strong>디버그 정보:</strong>
              <br />
              <pre>{debugInfo}</pre>
            </DebugInfo>
          )}
        </LoadingCard>
      </PageContainer>
    );
  }

  if (status === "success") {
    return (
      <PageContainer>
        {/* 컨페티 효과 */}
        {Array.from({ length: 20 }).map((_, index) => (
          <Confetti
            key={index}
            color={confettiColors[index % confettiColors.length]}
            left={Math.random() * 100}
            duration={3 + Math.random() * 2}
            delay={Math.random() * 2}
          />
        ))}

        <SuccessContainer>
          <SuccessIllustration>
            <Character>😊</Character>
            <PartyHorn />
            <Hat />
            <PointIcon />
            <PointIcon />
            <PointIcon />
            <GiftIcon />
          </SuccessIllustration>

          <SuccessText>로그인 성공!</SuccessText>

          <RedirectText>잠시 후 홈페이지로 이동합니다...</RedirectText>
        </SuccessContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <LoadingCard>
        <div style={{ fontSize: "48px", marginBottom: "20px" }}>❌</div>
        <Title>로그인 실패</Title>
        <Message>로그인 처리 중 문제가 발생했습니다.</Message>
        <ErrorCard>
          <ErrorTitle>오류 내용</ErrorTitle>
          <ErrorMessage>{errorMessage}</ErrorMessage>
          <RetryButton onClick={handleRetry}>다시 시도</RetryButton>
        </ErrorCard>
        {debugInfo && (
          <DebugInfo>
            <strong>디버그 정보:</strong>
            <br />
            <pre>{debugInfo}</pre>
          </DebugInfo>
        )}
      </LoadingCard>
    </PageContainer>
  );
};

export default CallbackPage;
