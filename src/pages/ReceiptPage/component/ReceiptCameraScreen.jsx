import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FiCamera, FiX, FiFolder, FiZap, FiZapOff, FiRotateCw } from 'react-icons/fi';

const CameraScreen = styled.div`
    width: 100%;
    height: 100vh;
    position: relative;
    background: black;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 60px 40px 16px 40px;
    background: transparent;
    color: white;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 101;
`;

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
`;

const HeaderRight = styled.div`
    display: flex;
    align-items: center;
`;

const HeaderButton = styled.button`
    background: none;
    border: none;
    color: white;
    font-size: 28px;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
    box-shadow: none;

    svg {
        width: 28px;
        height: 28px;
    }

    &:focus {
        outline: none;
        box-shadow: none;
    }

    &:active {
        outline: none;
        box-shadow: none;
    }
`;

const FlashButton = styled(HeaderButton)`
    color: ${props => props.$active ? '#ffd700' : 'white'};
    font-size: 22px;

    svg {
        width: 22px;
        height: 22px;
    }
`;

const HeaderTitle = styled.h2`
    color: white;
    margin: 0;
    font-size: 18px;
    font-weight: 600;
`;

const CameraPreview = styled.video`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const GuideOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    pointer-events: none;

    &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        height: 60%;
        background: transparent;
        box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.4);
    }

    &::after {
        content: '영수증을 네모 가이드 안에 맞춰 촬영해주세요.';
        position: absolute;
        top: calc(50% - 35%);
        left: 50%;
        transform: translateX(-50%);
        color: white;
        padding: 6px 12px;
        font-size: 14px;
        white-space: nowrap;
        z-index: 101;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
    }
`;

const GuideFrame = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 60%;
    border-radius: 0;
    pointer-events: none;
    z-index: 102;

    /* 모서리 가이드 */
    &::before,
    &::after {
        content: '';
        position: absolute;
        width: 30px;
        height: 30px;
        border: 3px solid #80C7BC;
    }

    /* 왼쪽 위 */
    &::before {
        top: 0;
        left: 0;
        border-right: none;
        border-bottom: none;
    }

    /* 오른쪽 아래 */
    &::after {
        bottom: 0;
        right: 0;
        border-left: none;
        border-top: none;
    }
`;

const GuideCornerTopRight = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 60%;
    pointer-events: none;
    z-index: 102;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 30px;
        height: 30px;
        border: 3px solid #80C7BC;
        border-left: none;
        border-bottom: none;
    }
`;

const GuideCornerBottomLeft = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 60%;
    pointer-events: none;
    z-index: 102;

    &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 30px;
        height: 30px;
        border: 3px solid #80C7BC;
        border-right: none;
        border-top: none;
    }
`;

const Controls = styled.div`
    position: absolute;
    bottom: 50px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 50px;
    z-index: 101;
`;

const CenterCaptureButton = styled.div`
    display: flex;
    justify-content: center;
    flex: 1;
`;

const CaptureButton = styled.button`
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: white;
    border: 4px solid #ccc;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:active {
        transform: scale(0.95);
    }
`;

const GalleryButton = styled.button`
    width: 42px;
    height: 42px;
    border-radius: 8px;
    background: white;
    border: none;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
        width: 28px;
        height: 28px;
        display: none;
    }
`;

const SwitchCameraButton = styled.button`
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    svg {
        width: 24px;
        height: 24px;
    }
`;

const HiddenFileInput = styled.input`
    display: none;
`;

const ReceiptCameraScreen = ({ onClose, onImageCapture }) => {
    const [stream, setStream] = useState(null);
    const [cameraError, setCameraError] = useState(false);
    const [flashOn, setFlashOn] = useState(false);
    const [facingMode, setFacingMode] = useState('environment'); // 'environment' or 'user'
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    // 카메라 시작
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            });
            setStream(mediaStream);
            setCameraError(false);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            console.error('카메라 접근 오류:', error);
            setCameraError(true);
            // 한 번만 알림 표시
            if (!cameraError) {
                alert('카메라에 접근할 수 없습니다. 갤러리에서 선택해주세요.');
            }
        }
    };

    // 카메라 중지
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    // 사진 촬영
    const capturePhoto = () => {
        if (!videoRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
            if (blob) {
                const imageUrl = URL.createObjectURL(blob);
                stopCamera();
                onImageCapture(imageUrl);
            }
        }, 'image/jpeg', 0.8);
    };

    // 갤러리에서 선택
    const selectFromGallery = () => {
        fileInputRef.current?.click();
    };

    // 파일 선택 처리
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            stopCamera();
            onImageCapture(imageUrl);
        }
    };

    // 플래시 토글
    const toggleFlash = () => {
        setFlashOn(!flashOn);
        // 실제 플래시 기능은 브라우저 제한으로 구현 어려움
        console.log('플래시', flashOn ? 'OFF' : 'ON');
    };

    // 카메라 전환
    const switchCamera = () => {
        stopCamera();
        setFacingMode(prevMode => prevMode === 'environment' ? 'user' : 'environment');
    };

    // 컴포넌트 마운트시 카메라 시작
    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [facingMode]);

    return (
        <CameraScreen>
            <Header>
                <HeaderLeft>
                    <FlashButton $active={flashOn} onClick={toggleFlash}>
                        {flashOn ? <FiZap /> : <FiZapOff />}
                    </FlashButton>
                </HeaderLeft>
                <HeaderRight>
                    <HeaderButton onClick={onClose}>
                        <FiX />
                    </HeaderButton>
                </HeaderRight>
            </Header>

            <CameraPreview
                ref={videoRef}
                autoPlay
                playsInline
                muted
            />

            <GuideOverlay />
            <GuideFrame />
            <GuideCornerTopRight />
            <GuideCornerBottomLeft />

            <Controls>
                <GalleryButton onClick={selectFromGallery}>
                </GalleryButton>

                <CenterCaptureButton>
                    <CaptureButton onClick={capturePhoto}>
                        <FiCamera size={30} />
                    </CaptureButton>
                </CenterCaptureButton>

                <SwitchCameraButton onClick={switchCamera}>
                    <FiRotateCw />
                </SwitchCameraButton>
            </Controls>

            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <HiddenFileInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
            />
        </CameraScreen>
    );
};

export default ReceiptCameraScreen;