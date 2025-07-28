import React from 'react';
import styled from 'styled-components';
import { FiArrowLeft } from 'react-icons/fi';

const DuplicateScreen = styled.div`
    background: white;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
`;

const Header = styled.div`
    background: white;
    padding: 16px 8px 0 8px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-shrink: 0; /* 헤더 크기 고정 */
`;

const HeaderButton = styled.button`
    background: none;
    border: none;
    color: #333;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    font-weight: normal;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
    box-shadow: none;
    margin: 0 0 0 8px;

    &:focus {
        outline: none;
        box-shadow: none;
    }

    &:active {
        outline: none;
        box-shadow: none;
    }

    svg {
        width: 24px;
        height: 24px;
    }
`;

const Content = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    text-align: center;
    padding: 80px 30px 40px 30px;
    overflow-y: auto; /* 스크롤 가능 */
    min-height: 0; /* 플렉스 아이템이 축소될 수 있도록 */
`;

const IconContainer = styled.div`
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const WarningIcon = styled.img`
    width: 80px;
    height: 80px;
`;

const DuplicateTitle = styled.h2`
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin: 0 0 16px 0;
`;

const DuplicateDescription = styled.p`
    font-size: 14px;
    color: #777;
    margin: 0 20px 40px 20px;
    line-height: 1.6;
`;

const RetryButton = styled.button`
    background: #80c7bc;
    color: white;
    border: none;
    border-radius: 12px;
    padding: 16px 32px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    min-width: 120px;
    margin-bottom: 20px; /* 하단 여백 추가 */

    &:hover {
        background: #6bb8b0;
    }

    &:active {
        transform: scale(0.98);
    }
`;

const ReceiptDuplicateScreen = ({ onRetry, onClose }) => {
    return (
        <DuplicateScreen>
            <Header>
                <HeaderButton onClick={onClose}>
                    <FiArrowLeft />
                </HeaderButton>
            </Header>

            <Content>
                <IconContainer>
                    <WarningIcon src="/UI/warning.svg" alt="경고" />
                </IconContainer>

                <DuplicateTitle>이미 인증된 영수증입니다</DuplicateTitle>

                <DuplicateDescription>
                    다른 영수증을 인증해주세요
                </DuplicateDescription>

                <RetryButton onClick={onRetry}>
                    다시 촬영하기
                </RetryButton>
            </Content>
        </DuplicateScreen>
    );
};

export default ReceiptDuplicateScreen;