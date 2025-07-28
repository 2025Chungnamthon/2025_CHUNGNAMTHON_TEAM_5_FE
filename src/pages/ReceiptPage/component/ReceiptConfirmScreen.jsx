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

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
    try {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        const weekday = weekdays[date.getDay()];

        return `${month}월 ${day}일 ${weekday}요일`;
    } catch (error) {
        console.error('날짜 포맷팅 오류:', error);
        return dateString;
    }
};

// 시간 포맷팅 함수 (문자열 "23:06:00" 형태)
const formatTime = (dateString, timeString) => {
    try {
        let formattedTime = '';

        if (dateString) {
            const date = new Date(dateString);
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
            const weekday = weekdays[date.getDay()];
            formattedTime = `${month}월 ${day}일 ${weekday}요일`;
        }

        if (timeString) {
            // 시간 형식이 "23:06:00" 같은 형태
            const timeParts = timeString.split(':');
            if (timeParts.length >= 2) {
                const hour = parseInt(timeParts[0]);
                const minute = timeParts[1];
                const period = hour >= 12 ? '오후' : '오전';
                const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                formattedTime += ` · ${period} ${displayHour}:${minute}`;
            } else {
                formattedTime += ` · ${timeString}`;
            }
        }

        return formattedTime;
    } catch (error) {
        console.error('시간 포맷팅 오류:', error);
        return `${dateString} ${timeString}`;
    }
};

const ReceiptConfirmScreen = ({ capturedImage, receiptData, onRetake, onConfirm }) => {
    // 실제 API 응답 구조에 맞는 데이터 추출
    const {
        merchantName = '상점명',
        visitDate = '',
        visitTime = '',
        address = '주소 정보 없음',
        point = 0
    } = receiptData || {};

    console.log('ReceiptConfirmScreen 데이터:', receiptData);

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
                    <StoreDate>{formatDate(visitDate)}에</StoreDate>
                    <StoreName>{merchantName}에 다녀오셨네요!</StoreName>

                    <TimeInfo>
                        <FiClock />
                        <span>{formatTime(visitDate, visitTime)}</span>
                    </TimeInfo>

                    <StoreAddress>{address}</StoreAddress>
                </StoreInfo>

                <ReceiptImage src={capturedImage} alt="영수증" />

                <PointInfo>
                    <PointIcon>P</PointIcon>
                    <PointText>지급 예정 포인트: {point}p</PointText>
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