import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const SuccessScreen = styled.div`
    background: white;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 20px;
    position: relative;
    overflow: hidden;
`;

const IconContainer = styled.div`
    position: relative;
    margin-bottom: 40px;
    width: 200px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const MainIconImage = styled.img`
    width: 80px;
    height: 80px;
    z-index: 2;
`;

const FloatingImage = styled.img`
    position: absolute;
    width: ${props => props.size || '24px'};
    height: ${props => props.size || '24px'};
    top: ${props => props.top || '50%'};
    left: ${props => props.left || '50%'};
    transform: translate(-50%, -50%);
    animation: float 2s ease-in-out infinite;
    animation-delay: ${props => props.delay || '0s'};
    z-index: 1;

    @keyframes float {
        0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
        50% { transform: translate(-50%, -50%) translateY(-10px); }
    }
`;

const SuccessTitle = styled.h2`
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
`;

const SuccessSubtitle = styled.p`
    font-size: 16px;
    color: #666;
    margin-bottom: 16px;
`;

const PointInfo = styled.div`
    background: #f8f9fa;
    border-radius: 12px;
    padding: 16px 24px;
    margin: 16px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
`;

const CurrentPointText = styled.div`
    font-size: 14px;
    color: #666;

    .highlight {
        font-weight: 600;
        color: #80c7bc;
    }
`;

const ReceiptSuccessScreen = ({ receiptData, onClose }) => {
    const navigate = useNavigate();

    // 확정 API 응답에서 포인트 정보 추출 (스웨거 기준)
    const {
        pointId = 0,            // 지급된 포인트 (확정 응답)
        currentPoint = 0,       // 현재 총 포인트 (확정 응답)
        message = '',           // 응답 메시지
        // 혹시 다른 필드명일 경우를 대비
        point = 0,              // preview에서 넘어온 포인트
        awardedPoints = 0,      // 다른 가능한 필드명
        totalPoints = 0         // 다른 가능한 필드명
    } = receiptData || {};

    // 실제 지급된 포인트 (우선순위 순)
    const actualAwardedPoint = pointId || point || awardedPoints || 0;

    // 현재 보유 포인트 (우선순위 순)
    const actualCurrentPoint = currentPoint || totalPoints || 0;

    console.log('ReceiptSuccessScreen 데이터:', receiptData);

    useEffect(() => {
        // 5초 후 홈화면으로 이동
        const timer = setTimeout(() => {
            onClose(); // 모달 닫기
            navigate('/'); // 홈화면으로 이동
        }, 5000);

        // 컴포넌트 언마운트시 타이머 정리
        return () => clearTimeout(timer);
    }, [onClose, navigate]);

    return (
        <SuccessScreen>
            <IconContainer>
                {/* 중앙 메인 아이콘 */}
                <MainIconImage src="/UI/party-face.svg" alt="축하" />

                {/* 돈 아이콘 */}
                <FloatingImage src="/UI/money.svg" top="40%" left="10%" size="30px" delay="0s" />

                {/* 코인 아이콘 */}
                <FloatingImage src="/UI/coin.svg" top="10%" left="60%" size="32px" delay="0.8s" />
                <FloatingImage src="/UI/coin.svg" top="85%" left="85%" size="28px" delay="1.2s" />
            </IconContainer>

            <SuccessTitle>인증 성공!</SuccessTitle>
            <SuccessSubtitle>
                {actualAwardedPoint > 0 ? `${actualAwardedPoint}p를 지갑에 쏙 넣어드렸어요.` : '영수증 인증이 완료되었어요.'}
            </SuccessSubtitle>

            {/* 현재 포인트 정보 표시 */}
            {actualCurrentPoint > 0 && (
                <PointInfo>
                    <CurrentPointText>
                        현재 보유 포인트: <span className="highlight">{actualCurrentPoint.toLocaleString()}p</span>
                    </CurrentPointText>
                </PointInfo>
            )}

            {/* API 메시지가 있으면 표시 */}
            {message && (
                <div style={{
                    fontSize: '14px',
                    color: '#888',
                    marginTop: '8px',
                    fontStyle: 'italic'
                }}>
                    {message}
                </div>
            )}
        </SuccessScreen>
    );
};

export default ReceiptSuccessScreen;