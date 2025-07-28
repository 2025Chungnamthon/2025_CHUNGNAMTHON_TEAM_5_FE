import React from 'react';
import styled from 'styled-components';
import { FiArrowLeft } from 'react-icons/fi';

const FailedScreen = styled.div`
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
    padding: 150px 30px 40px 30px;
`;

const EmojiContainer = styled.div`
    font-size: 80px;
    margin-bottom: 40px;
`;

const SadFaceIcon = styled.img`
    width: 80px;
    height: 80px;
`;

const FailedTitle = styled.h2`
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin: 0 0 16px 0;
`;

const FailedSubDescription = styled.p`
    font-size: 14px;
    color: #777;
    margin: 0 50px 80px 50px;
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

    &:hover {
        background: #6bb8b0;
    }

    &:active {
        transform: scale(0.98);
    }
`;

const ReceiptFailedScreen = ({ onRetry, onClose }) => {
    return (
        <FailedScreen>
            <Header>
                <HeaderButton onClick={onClose}>
                    <FiArrowLeft />
                </HeaderButton>
            </Header>

            <Content>
                <EmojiContainer>
                    <SadFaceIcon src="/UI/sad-face.svg" alt="슬픈 얼굴" />
                </EmojiContainer>

                <FailedTitle>영수증 인식 실패</FailedTitle>

                <FailedSubDescription>
                    영수증을 인식할 수 없어요.<br/>
                    촬영한 영수증이 흐릿하거나 잘리지 <br/>않았는지 확인해주세요.
                </FailedSubDescription>

                <RetryButton onClick={onRetry}>
                    다시 촬영하기
                </RetryButton>
            </Content>
        </FailedScreen>
    );
};

export default ReceiptFailedScreen;