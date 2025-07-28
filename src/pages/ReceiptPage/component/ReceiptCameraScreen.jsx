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
        width: 32px;
        height: 32px;
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

const FlashButton = styled.button`
    background: none !important;
    border: none;
    color: ${props => props.disabled ? '#666' : props.$active ? '#ffd700' : 'white'};
    font-size: 22px;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
    box-shadow: none;

    svg {
        width: 25px;
        height: 25px;
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
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: ${props => props.disabled ? 0.5 : 1};
    color: ${props => props.disabled ? '#999' : '#333'};

    &:active {
        transform: ${props => props.disabled ? 'none' : 'scale(0.95)'};
    }
`;

const GalleryButton = styled.button`
    width: 52px;
    height: 52px;
    border-radius: 8px;
    background: white;
    border: none;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
        width: 20px;
        height: 20px;
    }
`;

const SwitchCameraButton = styled.button`
    background: none !important;
    border: none;
    box-shadow: none;
    color: ${props => props.disabled ? '#666' : 'white'};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
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

// 권한 모달
const PermissionModal = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.8);
    border-radius: 16px;
    padding: 40px 32px;
    max-width: 320px;
    width: 90%;
    z-index: 103;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const PermissionIcon = styled.div`
    width: 100px;
    height: 100px;
    background: transparent;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 2px auto;
    color: #9ca3af;
    font-size: 50px;
    position: relative;

    /* 카메라 금지 선 */
    &::after {
        content: '';
        position: absolute;
        width: 70px;
        height: 2px;
        background: #ef4444;
        transform: rotate(45deg);
        border-radius: 1px;
    }
`;

const PermissionTitle = styled.h2`
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0 0 12px 0;
`;

const PermissionDescription = styled.p`
    font-size: 14px;
    color: #666;
    margin: 0;
    line-height: 1.5;
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
        if (!videoRef.current || cameraError) return;

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

    // 플래시 토글 (권한 없을 때는 동작 안함)
    const toggleFlash = () => {
        if (cameraError) return;
        setFlashOn(!flashOn);
        console.log('플래시', flashOn ? 'OFF' : 'ON');
    };

    // 카메라 전환 (권한 없을 때는 동작 안함)
    const switchCamera = () => {
        if (cameraError) return;
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
                    <FlashButton
                        $active={flashOn}
                        onClick={toggleFlash}
                        disabled={cameraError}
                    >
                        {flashOn ? <FiZap /> : <FiZapOff />}
                    </FlashButton>
                </HeaderLeft>
                <HeaderRight>
                    <HeaderButton onClick={onClose}>
                        <FiX />
                    </HeaderButton>
                </HeaderRight>
            </Header>

            {/* 카메라 권한이 있을 때만 비디오 표시 */}
            {!cameraError && (
                <CameraPreview
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                />
            )}

            <GuideOverlay />
            <GuideFrame />
            <GuideCornerTopRight />
            <GuideCornerBottomLeft />

            {/* 카메라 권한이 없을 때 모달 표시 */}
            {cameraError && (
                <PermissionModal>
                    <PermissionIcon>
                        <FiCamera />
                    </PermissionIcon>
                    <PermissionTitle>카메라 권한이 필요합니다.</PermissionTitle>
                    <PermissionDescription>
                        영수증 촬영을 위해 카메라<br />
                        권한을 허용해 주세요.
                    </PermissionDescription>
                </PermissionModal>
            )}

            <Controls>
                <GalleryButton onClick={selectFromGallery}>
                    <FiFolder />
                </GalleryButton>

                <CenterCaptureButton>
                    <CaptureButton onClick={capturePhoto} disabled={cameraError}>
                        <FiCamera size={30} />
                    </CaptureButton>
                </CenterCaptureButton>

                <SwitchCameraButton onClick={switchCamera} disabled={cameraError}>
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