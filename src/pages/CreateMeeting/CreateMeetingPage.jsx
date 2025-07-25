import React, { useState } from "react";
import styled from "styled-components";
import { FiArrowLeft } from "react-icons/fi";
import { TextAreaInput } from "./component/FormInput";
import LocationSearchModal from "./component/LocationSearchModal";
import ImageUpload from "./component/ImageUpload";
import { useCreateMeetingForm } from "./hooks/useCreateMeetingForm";

const MOBILE_MAX_WIDTH = 430;

const PageContainer = styled.div`
    max-width: ${MOBILE_MAX_WIDTH}px;
    margin: 0 auto;
    background: #fff;
    min-height: 100vh;
    padding: 0;
`;

const Header = styled.div`
    background: #fff;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
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

const Content = styled.div`
    padding: 0 20px 80px 20px;
    display: flex;
    flex-direction: column;
    gap: 32px;
`;

const FormSection = styled.div`
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

const LineInput = styled.input`
    background: transparent;
    border: none;
    border-bottom: 1px solid #d1d5db;
    padding: 12px 0 12px 8px;
    font-size: 16px;
    color: #333;

    &::placeholder {
        color: #9ca3af;
    }

    &:focus {
        outline: none;
        border-bottom-color: #80c7bc;
    }
`;

const CharCounter = styled.div`
    text-align: right;
    font-size: 14px;
    color: #9ca3af;
    margin-top: 4px;
`;

const SubText = styled.p`
    font-size: 14px;
    color: #9ca3af;
    margin: 0;
`;

const TagContainer = styled.div`
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
`;

const Tag = styled.button`
    background: ${props => props.$selected ? '#80c7bc' : '#f3f4f6'};
    color: ${props => props.$selected ? '#fff' : '#6b7280'};
    border: none;
    border-radius: 20px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: ${props => props.$selected ? '#5fa89e' : '#e5e7eb'};
    }

    &:active {
        transform: scale(0.98);
    }
`;

const ErrorText = styled.span`
    color: #ef4444;
    font-size: 12px;
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
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;

const SCHEDULE_OPTIONS = [
    { value: "ALL", label: "전체" },
    { value: "WEEKDAY", label: "평일" },
    { value: "WEEKEND", label: "주말" }
];

const CreateMeetingPage = () => {
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

    const {
        formData,
        selectedLocation,
        selectedSchedule,
        locationOptions,
        isLoading,
        errors,
        selectedImage,
        imagePreview,
        updateFormData,
        handleLocationSelect,
        handleScheduleSelect,
        handleImageUpload,
        handleSubmit,
        handleBack,
        canSubmit
    } = useCreateMeetingForm();

    const handleLocationClick = (location) => {
        if (location === "검색") {
            setIsLocationModalOpen(true);
            return;
        }
        handleLocationSelect(location);
    };

    const handleLocationModalSelect = (location) => {
        handleLocationSelect(location);
        setIsLocationModalOpen(false);
    };

    return (
        <PageContainer>
            <Header>
                <BackButton onClick={handleBack}>
                    <FiArrowLeft />
                </BackButton>
                <HeaderTitle>모임 만들기</HeaderTitle>
            </Header>

            <Content>
                {/* 모임명 */}
                <FormSection>
                    <SectionTitle>모임명</SectionTitle>
                    <LineInput
                        placeholder="분위기 좋은 카페 투어 가실 분"
                        value={formData.title}
                        onChange={(e) => updateFormData('title', e.target.value)}
                        maxLength={20}
                    />
                    <CharCounter>{formData.title?.length || 0}/20</CharCounter>
                    {errors.title && <ErrorText>{errors.title}</ErrorText>}
                </FormSection>

                {/* 모임 소개 */}
                <TextAreaInput
                    title="모임 소개"
                    placeholder="활동 중심으로 모임을 소개해주세요. 소개를 잘 작성한 모임은 2배 많은 이웃이 가입해요."
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    maxLength={500}
                    showCounter
                    error={errors.description}
                />

                {/* 카카오톡 오픈채팅방 링크 */}
                <FormSection>
                    <SectionTitle>카카오톡 오픈채팅방 링크</SectionTitle>
                    <LineInput
                        placeholder="https://open.kakao.com/o/gq9lWjlh"
                        value={formData.openchat_url}
                        onChange={(e) => updateFormData('openchat_url', e.target.value)}
                        maxLength={200}
                    />
                    <CharCounter>{formData.openchat_url?.length || 0}/200</CharCounter>
                    {errors.openchat_url && <ErrorText>{errors.openchat_url}</ErrorText>}
                </FormSection>

                {/* 활동 동네 */}
                <FormSection>
                    <SectionTitle>활동 동네</SectionTitle>
                    <SubText>주로 어디서 활동을 하나요?</SubText>
                    <TagContainer>
                        {locationOptions.map((location) => (
                            <Tag
                                key={location}
                                $selected={selectedLocation === location}
                                onClick={() => handleLocationClick(location)}
                            >
                                {location}
                            </Tag>
                        ))}
                    </TagContainer>
                    {errors.location && <ErrorText>{errors.location}</ErrorText>}
                </FormSection>

                {/* 활동 일자 */}
                <FormSection>
                    <SectionTitle>활동 일자</SectionTitle>
                    <SubText>주로 언제 활동을 하나요?</SubText>
                    <TagContainer>
                        {SCHEDULE_OPTIONS.map((option) => (
                            <Tag
                                key={option.value}
                                $selected={selectedSchedule === option.value}
                                onClick={() => handleScheduleSelect(option.value)}
                            >
                                {option.label}
                            </Tag>
                        ))}
                    </TagContainer>
                    {errors.schedule && <ErrorText>{errors.schedule}</ErrorText>}
                </FormSection>

                {/* 대표 사진 - ImageUpload 컴포넌트 사용 */}
                <FormSection>
                    <SectionTitle>대표 사진 (선택)</SectionTitle>
                    <ImageUpload
                        onImageChange={handleImageUpload}
                        error={errors.image}
                    />
                </FormSection>

                {/* 제출 버튼 */}
                <SubmitButton
                    onClick={handleSubmit}
                    disabled={!canSubmit || isLoading}
                >
                    {isLoading ? (
                        <>
                            <LoadingSpinner />
                            생성 중...
                        </>
                    ) : (
                        "모임 만들기"
                    )}
                </SubmitButton>
            </Content>

            {/* 지역 검색 모달 */}
            <LocationSearchModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
                onLocationSelect={handleLocationModalSelect}
            />
        </PageContainer>
    );
};

export default CreateMeetingPage;