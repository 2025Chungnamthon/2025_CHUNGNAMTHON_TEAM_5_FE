import React from 'react';
import styled from 'styled-components';
import { FiArrowLeft, FiClock } from 'react-icons/fi';

const ConfirmScreen = styled.div`
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
    flex-direction: column;
    gap: 24px;
`;

const TopRow = styled.div`
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
    margin: 0;
    margin-left: 8px;

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

const HeaderTitle = styled.h2`
    color: #333;
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    text-align: left;
    width: 100%;
    margin-left: 20px;
`;

const Content = styled.div`
    flex: 1;
    padding: 60px 20px 24px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const StoreInfo = styled.div`
    text-align: center;
    margin-bottom: 24px;
`;

const StoreDate = styled.div`
    font-size: 16px;
    color: #666;
    margin-bottom: 8px;
`;

const StoreName = styled.div`
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
`;

const StoreAddress = styled.div`
    font-size: 14px;
    color: #888;
`;

const TimeInfo = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin: 16px 0 8px 0;
    font-size: 14px;
    color: #666;

    svg {
        width: 16px;
        height: 16px;
    }
`;

const ReceiptImage = styled.img`
    width: 200px;
    height: 250px;
    object-fit: cover;
    border-radius: 12px;
    margin: 20px 0;
    border: 1px solid #eee;
`;

const PointInfo = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin: 20px 0;
    width: 100%;
`;

const PointIcon = styled.div`
    width: 24px;
    height: 24px;
    background: #ffd700;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: bold;
    color: #ffa500;
`;

const PointText = styled.div`
    font-size: 16px;
    color: #666;
    font-weight: 500;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 12px;
    margin-top: auto;
    padding: 20px;
`;

const Button = styled.button`
    flex: 1;
    padding: 16px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    ${props => props.primary ? `
    background: #80c7bc;
    color: white;
    border: none;
    
    &:hover {
      background: #5fa89e;
    }
  ` : `
    background: white;
    color: #666;
    border: 1px solid #ddd;
    
    &:hover {
      background: #f5f5f5;
    }
  `}
`;

const ReceiptConfirmScreen = ({ capturedImage, onRetake, onConfirm }) => {
    return (
        <ConfirmScreen>
            <Header>
                <TopRow>
                    <HeaderButton onClick={onRetake}>
                        <FiArrowLeft />
                    </HeaderButton>
                </TopRow>
                <HeaderTitle>영수증 인증 확인</HeaderTitle>
            </Header>

            <Content>
                <StoreInfo>
                    <StoreDate>7월 25일 금요일에</StoreDate>
                    <StoreName>한결가치컵국수 성정점에 다녀오셨네요!</StoreName>

                    <TimeInfo>
                        <FiClock />
                        <span>7월 25일 금 · 오후 7:05</span>
                    </TimeInfo>

                    <StoreAddress>충남 천안시 서북구 성정동원길2 9-4 지하1층 101-9호</StoreAddress>
                </StoreInfo>

                <ReceiptImage src={capturedImage} alt="영수증" />

                <PointInfo>
                    <PointIcon>P</PointIcon>
                    <PointText>지급 예정 포인트: 30p</PointText>
                </PointInfo>
            </Content>

            <ButtonContainer>
                <Button onClick={onRetake}>
                    이 장소가 아니에요
                </Button>
                <Button primary onClick={onConfirm}>
                    이 장소가 맞아요
                </Button>
            </ButtonContainer>
        </ConfirmScreen>
    );
};

export default ReceiptConfirmScreen;