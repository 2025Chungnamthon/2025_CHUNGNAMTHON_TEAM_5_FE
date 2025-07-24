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

const MainIcon = styled.div`
    font-size: 80px;
    z-index: 2;
`;

const FloatingIcon = styled.div`
    position: absolute;
    font-size: ${props => props.size || '24px'};
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
        // 3초 후 홈화면으로 이동
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
                <MainIcon>🥳</MainIcon>

                {/* 떠다니는 이모지들 */}
                <FloatingIcon top="40%" left="10%" size="30px" delay="0s">💸</FloatingIcon>

                {/* P 아이콘들 */}
                <FloatingIcon top="10%" left="60%" delay="0.8s">
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: '#ffd700',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: 'white'
                    }}>P</div>
                </FloatingIcon>

                <FloatingIcon top="85%" left="85%" delay="1.2s">
                    <div style={{
                        width: '28px',
                        height: '28px',
                        background: '#ffd700',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: 'white'
                    }}>P</div>
                </FloatingIcon>
            </IconContainer>

            <SuccessTitle>인증 성공!</SuccessTitle>
            <SuccessSubtitle>300p를 지갑에 쏙 넣어드렸어요.</SuccessSubtitle>
        </SuccessScreen>
    );
};

export default ReceiptSuccessScreen;