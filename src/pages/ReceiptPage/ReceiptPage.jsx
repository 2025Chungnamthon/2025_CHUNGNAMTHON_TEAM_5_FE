import React, { useState } from 'react';
import styled from 'styled-components';
import ReceiptCameraScreen from './component/ReceiptCameraScreen';
import ReceiptConfirmScreen from './component/ReceiptConfirmScreen';
import ReceiptSuccessScreen from './component/ReceiptSuccessScreen';

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

const ReceiptPage = ({ isOpen, onClose }) => {
    const [step, setStep] = useState('camera'); // 'camera', 'confirm', 'success'
    const [capturedImage, setCapturedImage] = useState(null);

    const handleImageCapture = (imageUrl) => {
        setCapturedImage(imageUrl);
        setStep('confirm');
    };

    const handleRetakePhoto = () => {
        setCapturedImage(null);
        setStep('camera');
    };

    const handleConfirmLocation = () => {
        setStep('success');
    };

    const handleClose = () => {
        setCapturedImage(null);
        setStep('camera');
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

            {step === 'confirm' && (
                <ReceiptConfirmScreen
                    capturedImage={capturedImage}
                    onRetake={handleRetakePhoto}
                    onConfirm={handleConfirmLocation}
                />
            )}

            {step === 'success' && (
                <ReceiptSuccessScreen
                    onClose={handleClose}
                />
            )}
        </Container>
    );
};

export default ReceiptPage;