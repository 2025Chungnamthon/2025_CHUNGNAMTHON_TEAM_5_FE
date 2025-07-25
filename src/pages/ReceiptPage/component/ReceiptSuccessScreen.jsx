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
    margin-bottom: 32px;
`;

const ReceiptSuccessScreen = ({ onClose }) => {
    const navigate = useNavigate();

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
            <SuccessSubtitle>300p를 지갑에 쏙 넣어드렸어요.</SuccessSubtitle>
        </SuccessScreen>
    );
};

export default ReceiptSuccessScreen;