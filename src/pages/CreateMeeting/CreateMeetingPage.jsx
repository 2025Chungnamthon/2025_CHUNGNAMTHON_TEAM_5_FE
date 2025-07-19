import React from "react";
import styled from "styled-components";
import {FiArrowLeft, FiCamera} from "react-icons/fi";
import {TextInput, TextAreaInput, SearchTextInput} from "./component/FormInput";
import LocationSelector from "./component/LocationSelector";
import MemberCounter from "./component/MemberCounter";
import {useCreateMeetingForm} from "./hooks/useCreateMeetingForm";

const MOBILE_MAX_WIDTH = 430;

const PageContainer = styled.div`
    max-width: ${MOBILE_MAX_WIDTH}px;
    margin: 0 auto;
    background: #fafbfc;
    min-height: 100vh;
    padding: 0;
`;

const Header = styled.div`
    background: #fff;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    border-bottom: 1px solid #f3f4f6;
    position: sticky;
    top: 0;
    z-index: 10;
`;

const BackButton = styled.button`
    background: none;
    border: none;
    padding: 8px;
    cursor: pointer;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;

    svg {
        font-size: 20px;
    }

    &:hover {
        color: #80c7bc;
    }
`;

const HeaderTitle = styled.h1`
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0;
`;

const ProgressBar = styled.div`
    width: 100%;
    height: 3px;
    background: #f3f4f6;
    position: relative;
    overflow: hidden;
`;

const ProgressFill = styled.div`
    height: 100%;
    background: linear-gradient(90deg, #80c7bc, #5fa89e);
    width: ${props => props.progress}%;
    transition: width 0.3s ease;
`;

const Content = styled.div`
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding-bottom: 80px;
`;

const LocationSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const ImageSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const SectionTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin: 0;
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

const ImageUploadSubText = styled.span`
    font-size: 12px;
    color: #9ca3af;
    margin-top: 4px;
`;

const SubmitButton = styled.button`
    background: ${props => props.disabled ? '#d1d5db' : '#80c7bc'};
    color: #fff;
    border: none;
    border-radius: 12px;
    padding: 16px;
    font-size: 16px;
    font-weight: 600;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    width: 100%;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 24px;

    &:hover {
        background: ${props => props.disabled ? '#d1d5db' : '#5fa89e'};
        transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    }

    &:active {
        transform: ${props => props.disabled ? 'none' : 'translateY(0)'};
    }
`;

const LoadingSpinner = styled.div`
    width: 20px;
    height: 20px;
    border: 2px solid transparent;
    border-top: 2px solid #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;

const ErrorText = styled.span`
    color: #ef4444;
    font-size: 12px;
    margin-top: 4px;
`;

const CreateMeetingPage = () => {
    const {
        // 상태
        formData,
        selectedLocation,
        isLoading,
        errors,
        isFormValid,
        formProgress,

        // 액션
        updateFormData,
        handleLocationSelect,
        handleMemberCountChange,
        handleImageUpload,
        handleSubmit,
        handleBack
    } = useCreateMeetingForm();

    return (
        <PageContainer>
            <Header>
                <BackButton onClick={handleBack}>
                    <FiArrowLeft/>
                </BackButton>
                <HeaderTitle>모임 만들기</HeaderTitle>
            </Header>

            <ProgressBar>
                <ProgressFill progress={formProgress}/>
            </ProgressBar>

            <Content>
                <TextInput
                    title="모임명"
                    placeholder="분위기 좋은 카페 투어 가실 분"
                    value={formData.title}
                    onChange={(e) => updateFormData('title', e.target.value)}
                    maxLength={50}
                />
                {errors.title && <ErrorText>{errors.title}</ErrorText>}

                <TextAreaInput
                    title="모임 소개"
                    placeholder="내용을 입력해주세요"
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    maxLength={500}
                />
                {errors.description && <ErrorText>{errors.description}</ErrorText>}

                <LocationSection>
                    <SearchTextInput
                        title="활동 동네"
                        placeholder="동네를 검색하세요"
                        value={formData.location}
                        onChange={(e) => updateFormData('location', e.target.value)}
                    />
                    {errors.location && <ErrorText>{errors.location}</ErrorText>}
                    <LocationSelector
                        selectedLocation={selectedLocation}
                        onLocationSelect={handleLocationSelect}
                    />
                </LocationSection>

                <MemberCounter
                    count={formData.maxMember}
                    onCountChange={handleMemberCountChange}
                    min={2}
                    max={10}
                />
                {errors.maxMember && <ErrorText>{errors.maxMember}</ErrorText>}

                <ImageSection>
                    <SectionTitle>대표 사진 (선택)</SectionTitle>
                    <ImageUploadButton onClick={handleImageUpload}>
                        <FiCamera/>
                        <ImageUploadText>사진 추가하기</ImageUploadText>
                        <ImageUploadSubText>모임을 더 매력적으로 소개해보세요</ImageUploadSubText>
                    </ImageUploadButton>
                </ImageSection>

                <SubmitButton
                    onClick={handleSubmit}
                    disabled={!isFormValid || isLoading}
                >
                    {isLoading ? (
                        <>
                            <LoadingSpinner/>
                            생성 중...
                        </>
                    ) : (
                        "모임 만들기"
                    )}
                </SubmitButton>
            </Content>
        </PageContainer>
    );
};

export default CreateMeetingPage;