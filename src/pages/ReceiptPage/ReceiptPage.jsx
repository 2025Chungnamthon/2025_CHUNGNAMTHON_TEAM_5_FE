import React, { useState } from 'react';
import styled from 'styled-components';
import { receiptApi } from '@/services/receiptApi.js';
import { isAuthenticated } from '@/services/auth.js';
import ReceiptCameraScreen from './component/ReceiptCameraScreen';
import ReceiptConfirmScreen from './component/ReceiptConfirmScreen';
import ReceiptSuccessScreen from './component/ReceiptSuccessScreen';
import ReceiptFailedScreen from './component/ReceiptFailedScreen'; // 새로 추가

const MOBILE_MAX_WIDTH = 430;

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: black;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    max-width: ${MOBILE_MAX_WIDTH}px;
    margin: 0 auto;
`;

const LoadingOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1001;
    color: white;
`;

const LoadingSpinner = styled.div`
    width: 40px;
    height: 40px;
    border: 3px solid transparent;
    border-top: 3px solid #80c7bc;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

const LoadingText = styled.div`
    font-size: 16px;
    font-weight: 500;
`;

const ReceiptPage = ({ isOpen, onClose }) => {
    const [step, setStep] = useState('camera'); // 'camera', 'confirm', 'success', 'failed' 추가
    const [capturedImage, setCapturedImage] = useState(null);
    const [receiptData, setReceiptData] = useState(null); // API 응답 데이터
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    // 이미지 촬영 완료 후 API 호출
    const handleImageCapture = async (imageUrl) => {
        // 로그인 체크
        if (!isAuthenticated()) {
            alert('로그인이 필요한 서비스입니다.');
            handleClose();
            return;
        }

        try {
            setLoading(true);
            setLoadingMessage('영수증을 분석하고 있어요...');
            setCapturedImage(imageUrl);

            console.log('이미지 캡처 완료, API 호출 시작');

            // URL을 Blob으로 변환
            const imageBlob = await receiptApi.urlToBlob(imageUrl);

            // 영수증 미리보기 API 호출
            const previewResponse = await receiptApi.previewReceipt(imageBlob);

            console.log('미리보기 API 응답:', previewResponse);
            setReceiptData(previewResponse.data);
            setStep('confirm');

        } catch (error) {
            console.error('영수증 처리 실패:', error);

            // alert 대신 실패 화면으로 이동
            setStep('failed');
        } finally {
            setLoading(false);
            setLoadingMessage('');
        }
    };

    // 다시 촬영하기
    const handleRetakePhoto = () => {
        setCapturedImage(null);
        setReceiptData(null);
        setStep('camera');
    };

    // 장소 확인 완료 후 포인트 지급
    const handleConfirmLocation = async () => {
        if (!receiptData?.previewId) {
            setStep('failed');
            return;
        }

        try {
            setLoading(true);
            setLoadingMessage('포인트를 지급하고 있어요...');

            console.log('영수증 확정 API 호출 시작:', receiptData.previewId);

            // 영수증 확정 API 호출
            const confirmResponse = await receiptApi.confirmReceipt(receiptData.previewId);

            console.log('확정 API 응답:', confirmResponse);

            // 성공 화면으로 이동 (확정 응답 데이터도 전달)
            setReceiptData(prev => ({ ...prev, ...confirmResponse.data }));
            setStep('success');

        } catch (error) {
            console.error('영수증 확정 실패:', error);

            if (error.message.includes('찾을 수 없습니다')) {
                handleRetakePhoto();
                return;
            } else if (error.message.includes('이미 처리')) {
                alert('이미 처리된 영수증입니다.');
            } else {
                // 다른 에러는 실패 화면으로
                setStep('failed');
            }
        } finally {
            setLoading(false);
            setLoadingMessage('');
        }
    };

    // 모달 닫기
    const handleClose = () => {
        setCapturedImage(null);
        setReceiptData(null);
        setStep('camera');
        setLoading(false);
        setLoadingMessage('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Container>
            {step === 'camera' && (
                <ReceiptCameraScreen
                    onClose={handleClose}
                    onImageCapture={handleImageCapture}
                />
            )}

            {step === 'confirm' && receiptData && (
                <ReceiptConfirmScreen
                    capturedImage={capturedImage}
                    receiptData={receiptData}
                    onRetake={handleRetakePhoto}
                    onConfirm={handleConfirmLocation}
                />
            )}

            {step === 'success' && receiptData && (
                <ReceiptSuccessScreen
                    receiptData={receiptData}
                    onClose={handleClose}
                />
            )}

            {/* 새로 추가된 실패 화면 */}
            {step === 'failed' && (
                <ReceiptFailedScreen
                    onRetry={handleRetakePhoto}
                    onClose={handleClose}
                />
            )}

            {/* 로딩 오버레이 */}
            {loading && (
                <LoadingOverlay>
                    <LoadingSpinner />
                    <LoadingText>{loadingMessage}</LoadingText>
                </LoadingOverlay>
            )}
        </Container>
    );
};

export default ReceiptPage;