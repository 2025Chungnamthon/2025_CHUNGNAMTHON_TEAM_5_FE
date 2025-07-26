import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { meetingApi } from '../../../services/meetingApi';
import { isAuthenticated } from '../../../services/auth';
import { getLocationKorean } from '../../../utils/locationUtils';

const INITIAL_FORM_STATE = {
    title: "",
    description: "",
    location: "",
    openchat_url: "",
    schedule: "",
    image_url: ""
};

// 초기 지역 옵션
const INITIAL_LOCATION_OPTIONS = ["검색", "성정1동", "부성1동", "부성2동"];

// API 스케줄 -> UI 스케줄 변환
const API_TO_UI_SCHEDULE_MAP = {
    'FULL': 'ALL',      // FULL -> 전체
    'WEEKDAY': 'WEEKDAY', // WEEKDAY -> 평일
    'WEEKEND': 'WEEKEND'  // WEEKEND -> 주말
};

const validateForm = (formData) => {
    const errors = {};

    if (!formData.title.trim()) {
        errors.title = "모임명을 입력해주세요.";
    } else if (formData.title.length > 24) {
        errors.title = "모임명은 24자 이내로 입력해주세요.";
    }

    if (!formData.description.trim()) {
        errors.description = "모임 소개를 입력해주세요.";
    } else if (formData.description.length > 500) {
        errors.description = "모임 소개는 500자 이내로 입력해주세요.";
    }

    if (!formData.location.trim()) {
        errors.location = "활동 동네를 선택해주세요.";
    }

    if (!formData.schedule.trim()) {
        errors.schedule = "활동 일시를 선택해주세요.";
    }

    if (formData.openchat_url && formData.openchat_url.trim()) {
        const urlPattern = /^https?:\/\/.+/;
        if (!urlPattern.test(formData.openchat_url.trim())) {
            errors.openchat_url = "올바른 URL 형식으로 입력해주세요.";
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const useCreateMeetingForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedSchedule, setSelectedSchedule] = useState("");
    const [locationOptions, setLocationOptions] = useState(INITIAL_LOCATION_OPTIONS);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isInitialized, setIsInitialized] = useState(false); // 초기화 상태 추가

    // 이미지 관련 상태
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const updateLocationOptions = (newLocation) => {
        if (newLocation === "검색") return;

        setLocationOptions(prev => {
            const currentLocations = prev.slice(1);
            const existingIndex = currentLocations.indexOf(newLocation);

            if (existingIndex !== -1) {
                return prev;
            } else {
                const updatedLocations = [newLocation, ...currentLocations].slice(0, 3);
                return ["검색", ...updatedLocations];
            }
        });
    };

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        updateFormData('location', location);
        updateLocationOptions(location);
    };

    const handleScheduleSelect = (schedule) => {
        setSelectedSchedule(schedule);
        updateFormData('schedule', schedule);
    };

    const handleImageUpload = (file, preview) => {
        setSelectedImage(file);
        setImagePreview(preview);

        if (file) {
            updateFormData('image_url', "https://example.com/meeting.jpg");
        } else {
            updateFormData('image_url', "");
        }
    };

    // 수정 모드 초기화 함수 - useCallback으로 감싸서 불필요한 재생성 방지
    const initializeEditMode = useCallback((meetingData) => {
        // 이미 초기화되었으면 무시
        if (isInitialized) {
            console.log('⏭️ 이미 초기화됨, 스킵');
            return;
        }

        console.log('🔧 수정 모드 데이터 초기화 시작:', meetingData);

        if (!meetingData) {
            console.error('❌ meetingData가 없습니다!');
            return;
        }

        // API 스케줄을 UI 형식으로 변환
        const uiSchedule = API_TO_UI_SCHEDULE_MAP[meetingData.schedule] || meetingData.schedule;
        console.log('📅 스케줄 변환:', meetingData.schedule, '->', uiSchedule);

        // 지역을 한글명으로 변환 (API에서는 지역 코드로 옴)
        const locationKorean = getLocationKorean(meetingData.location);
        console.log('📍 지역 변환:', meetingData.location, '->', locationKorean);

        // 폼 데이터 설정 (API 응답 구조에 맞춤)
        const initialData = {
            title: meetingData.title || "",
            description: meetingData.description || "",
            location: locationKorean || "",
            openchat_url: meetingData.openChatUrl || "", // API 필드명 확인
            schedule: uiSchedule || "",
            image_url: meetingData.imageUrl || ""
        };

        console.log('📝 초기화할 폼 데이터:', initialData);

        setFormData(initialData);
        setSelectedLocation(locationKorean || "");
        setSelectedSchedule(uiSchedule || "");

        // 지역 옵션에 현재 지역 추가
        if (locationKorean) {
            updateLocationOptions(locationKorean);
        }

        // 기존 이미지가 있으면 미리보기 설정
        if (meetingData.imageUrl) {
            setImagePreview(meetingData.imageUrl);
            console.log('🖼️ 이미지 미리보기 설정:', meetingData.imageUrl);
        }

        setIsInitialized(true); // 초기화 완료 표시
        console.log('✅ 수정 모드 초기화 완료!');
    }, [isInitialized]); // isInitialized 의존성 추가

    const handleSubmit = async (meetingId = null, isEditMode = false) => {
        // 인증 상태 확인
        if (!isAuthenticated()) {
            alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
            navigate('/login');
            return;
        }

        const validation = validateForm(formData);

        if (!validation.isValid) {
            setErrors(validation.errors);
            const firstErrorMessage = Object.values(validation.errors)[0];
            alert(firstErrorMessage);
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const submitData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                location: formData.location.trim(),
                schedule: formData.schedule.trim(),
                openchat_url: formData.openchat_url.trim() || "https://open.kakao.com/o/default",
                image_url: formData.image_url || "https://example.com/default.jpg"
            };

            console.log('전송할 데이터:', submitData);

            let response;
            let successMessage;
            let redirectPath;

            if (isEditMode && meetingId) {
                // 수정 모드
                response = await meetingApi.updateMeeting(meetingId, submitData);
                successMessage = '모임이 성공적으로 수정되었습니다!';
                redirectPath = `/meetings/${meetingId}`;

                console.log('모임 수정 응답:', response);
            } else {
                // 생성 모드
                response = await meetingApi.createMeeting(submitData);
                successMessage = '모임이 성공적으로 생성되었습니다!';

                const newMeetingId = response.data?.meetingId;
                redirectPath = newMeetingId ? `/meetings/${newMeetingId}` : '/meetings';

                console.log('모임 생성 응답:', response);
            }

            alert(successMessage);
            navigate(redirectPath);

        } catch (error) {
            console.error(`모임 ${isEditMode ? '수정' : '생성'} 오류:`, error);

            // 에러 메시지 세분화
            let errorMessage = `모임 ${isEditMode ? '수정' : '생성'} 중 오류가 발생했습니다.`;

            if (error.message.includes('로그인')) {
                errorMessage = '로그인이 필요합니다. 로그인 페이지로 이동합니다.';
                navigate('/login');
            } else if (error.message.includes('권한')) {
                errorMessage = `모임을 ${isEditMode ? '수정' : '생성'}할 권한이 없습니다.`;
            } else if (error.message.includes('찾을 수 없습니다')) {
                errorMessage = '수정하려는 모임을 찾을 수 없습니다.';
            } else if (error.message.includes('네트워크')) {
                errorMessage = '인터넷 연결을 확인해주세요.';
            } else if (error.message.includes('입력')) {
                errorMessage = '입력 정보를 다시 확인해주세요.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        const hasChanges = formData.title || formData.description || formData.location ||
            formData.openchat_url || selectedImage;

        if (hasChanges) {
            const confirmMessage = "작성 중인 내용이 있습니다. 정말 나가시겠습니까?";
            if (!window.confirm(confirmMessage)) return;
        }

        navigate(-1);
    };

    const canSubmit = formData.title.trim() &&
        formData.description.trim() &&
        formData.openchat_url.trim() &&
        formData.location.trim() &&
        formData.schedule.trim() &&
        !isLoading;

    return {
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
        canSubmit,
        initializeEditMode,
        isInitialized // 초기화 상태도 반환
    };
};