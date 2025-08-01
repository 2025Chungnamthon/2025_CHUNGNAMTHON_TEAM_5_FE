import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { FiCamera, FiX, FiImage } from "react-icons/fi";
import { useToastContext } from "../../../components/ToastProvider";
import { ERROR_TOAST_CONFIGS } from "@/config/toastConfigs.js";

const ImageUploadContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const ImageUploadButton = styled.button`
    background: #f8f9fa;
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: #f3f4f6;
        border-color: #9ca3af;
        transform: translateY(-2px);
    }

    &:active {
        transform: translateY(0);
    }

    svg {
        font-size: 24px;
        color: #6b7280;
    }
`;

const ImageUploadText = styled.span`
    font-size: 14px;
    color: #6b7280;
    font-weight: 500;
`;

const ImagePreviewContainer = styled.div`
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    background: #f8f9fa;
`;

const ImagePreview = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
    display: block;
`;


const RemoveButton = styled.button`
    position: absolute;
    top: 8px;
    right: 8px;
    background: #d1d3d6;
    border: none;
    border-radius: 20%;
    width: 25px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #fff;
    transition: all 0.2s;

    &:hover {
        background: #b3b7bd;
        color: #fff;
        transform: scale(1.1);
    }

    &:active {
        background: #6b7280;
        color: #fff;
        transform: scale(1.0);
    }

    svg {
        font-size: 16px;
    }
`;

const ChangeImageButton = styled.button`
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.6);
    border: none;
    border-radius: 20px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s;

    &:hover {
        background: rgba(0, 0, 0, 0.8);
    }

    svg {
        font-size: 14px;
    }
`;

const HiddenFileInput = styled.input`
    display: none;
`;

const ErrorText = styled.div`
    color: #ef4444;
    font-size: 12px;
    margin-top: 4px;
`;

const UploadInfo = styled.div`
    font-size: 12px;
    color: #9ca3af;
    text-align: center;
    margin-top: 8px;
`;

const ImageUpload = ({ onImageChange, error, initialImage = null }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);
    const { showToast } = useToastContext();

    // 초기 이미지 설정
    useEffect(() => {
        if (initialImage && !imagePreview) {
            console.log('초기 이미지 설정:', initialImage);
            setImagePreview(initialImage);
            // 초기 이미지는 URL이므로 파일은 null로 유지
            setImageFile(null);
        }
    }, [initialImage]);

    // 파일 선택 처리 (토스트 적용)
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // 파일 크기 체크 (5MB 제한) - 토스트로 변경
        if (file.size > 5 * 1024 * 1024) {
            showToast(ERROR_TOAST_CONFIGS.FILE_SIZE_LIMIT, { type: "error" });
            return;
        }

        // 파일 타입 체크 - 토스트로 변경
        if (!file.type.startsWith('image/')) {
            showToast(ERROR_TOAST_CONFIGS.INVALID_FILE_TYPE, { type: "error" });
            return;
        }

        // 파일 미리보기 생성
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                setImagePreview(e.target.result);
                setImageFile(file);
                // 부모 컴포넌트에 파일 정보 전달
                onImageChange?.(file, e.target.result);
            } catch (error) {
                console.error('이미지 처리 실패:', error);
                showToast(ERROR_TOAST_CONFIGS.FILE_UPLOAD_FAILED, { type: "error" });
            }
        };

        reader.onerror = () => {
            console.error('파일 읽기 실패');
            showToast(ERROR_TOAST_CONFIGS.FILE_UPLOAD_FAILED, { type: "error" });
        };

        reader.readAsDataURL(file);
    };

    // 파일 선택 버튼 클릭
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    // 이미지 제거
    const handleRemoveImage = () => {
        setImagePreview(null);
        setImageFile(null);
        onImageChange?.(null, null);
        // 파일 입력 초기화
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // 이미지 변경
    const handleChangeImage = () => {
        fileInputRef.current?.click();
    };

    // 이미지 로드 에러 처리 (토스트 적용)
    const handleImageError = (e) => {
        console.error('이미지 로드 실패:', e.target.src);
        // 기본 이미지로 대체
        e.target.src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80";
        // 에러 토스트 표시
        showToast(ERROR_TOAST_CONFIGS.FILE_UPLOAD_FAILED, { type: "error" });
    };

    return (
        <ImageUploadContainer>
            <HiddenFileInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
            />

            {imagePreview ? (
                // 이미지 미리보기
                <ImagePreviewContainer>
                    <ImagePreview
                        src={imagePreview}
                        alt="업로드된 이미지"
                        onError={handleImageError}
                    />
                    <RemoveButton onClick={handleRemoveImage}>
                        X
                    </RemoveButton>
                    <ChangeImageButton onClick={handleChangeImage}>
                        <FiImage />
                        변경
                    </ChangeImageButton>
                </ImagePreviewContainer>
            ) : (
                // 업로드 버튼
                <ImageUploadButton onClick={handleUploadClick}>
                    <FiCamera />
                    <ImageUploadText>사진 추가하기</ImageUploadText>
                </ImageUploadButton>
            )}

            <UploadInfo>
                JPG, PNG 파일만 가능하며, 최대 5MB까지 업로드할 수 있습니다.
            </UploadInfo>

            {error && <ErrorText>{error}</ErrorText>}
        </ImageUploadContainer>
    );
};

export default ImageUpload;