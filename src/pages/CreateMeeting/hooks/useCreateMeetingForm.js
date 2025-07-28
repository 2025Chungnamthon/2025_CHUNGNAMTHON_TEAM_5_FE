import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { meetingApi } from '@/services/meetingApi.js';
import { isAuthenticated } from '@/services/auth.js';
import { getLocationKorean } from '@/utils/locationUtils.js';
import { useToastContext } from '@/components/ToastProvider.jsx';
import { TOAST_CONFIGS, ERROR_TOAST_CONFIGS } from '@/config/toastConfigs.js';

const INITIAL_FORM_STATE = {
    title: "",
    description: "",
    location: "",
    openchat_url: "",
    schedule: ""
};

const INITIAL_LOCATION_OPTIONS = ["검색", "성정1동", "부성1동", "부성2동"];

const API_TO_UI_SCHEDULE_MAP = {
    'FULL': 'ALL',
    'WEEKDAY': 'WEEKDAY',
    'WEEKEND': 'WEEKEND'
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
    const { showToast } = useToastContext();

    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedSchedule, setSelectedSchedule] = useState("");
    const [locationOptions, setLocationOptions] = useState(INITIAL_LOCATION_OPTIONS);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isInitialized, setIsInitialized] = useState(false);

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

            if (existingIndex !== -1) return prev;

            const updatedLocations = [newLocation, ...currentLocations].slice(0, 3);
            return ["검색", ...updatedLocations];
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
    };

    const initializeEditMode = useCallback((meetingData) => {
        if (isInitialized) return;

        const uiSchedule = API_TO_UI_SCHEDULE_MAP[meetingData.schedule] || meetingData.schedule;
        const locationKorean = getLocationKorean(meetingData.location);

        const initialData = {
            title: meetingData.title || "",
            description: meetingData.description || "",
            location: locationKorean || "",
            openchat_url: meetingData.openChatUrl || "",
            schedule: uiSchedule || ""
        };

        setFormData(initialData);
        setSelectedLocation(locationKorean || "");
        setSelectedSchedule(uiSchedule || "");

        if (locationKorean) updateLocationOptions(locationKorean);
        if (meetingData.imageUrl) setImagePreview(meetingData.imageUrl);

        setIsInitialized(true);
    }, [isInitialized]);

    const handleSubmit = async (meetingId = null, isEditMode = false) => {
        if (!isAuthenticated()) {
            showToast(ERROR_TOAST_CONFIGS.LOGIN_REQUIRED, { type: "error" });
            navigate('/login');
            return;
        }

        const validation = validateForm(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            const firstErrorMessage = Object.values(validation.errors)[0];
            showToast(firstErrorMessage, { type: "error" });
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
                openchat_url: formData.openchat_url.trim() || "https://open.kakao.com/o/default"
            };

            let response, redirectPath;

            if (isEditMode && meetingId) {
                response = await meetingApi.updateMeeting(meetingId, submitData, selectedImage);
                showToast(TOAST_CONFIGS.MEETING_UPDATED);
                redirectPath = '/meetings?tab=myMeetings&subTab=approved';
            } else {
                response = await meetingApi.createMeeting(submitData, selectedImage);
                showToast(TOAST_CONFIGS.MEETING_CREATED);
                redirectPath = '/meetings?tab=myMeetings&subTab=approved';
            }

            navigate(redirectPath);
        } catch (error) {
            console.error(`모임 ${isEditMode ? '수정' : '생성'} 오류:`, error);

            let errorMessage = `모임 ${isEditMode ? '수정' : '생성'} 중 오류가 발생했습니다.`;

            if (error.message.includes('로그인')) {
                showToast(ERROR_TOAST_CONFIGS.LOGIN_REQUIRED, { type: "error" });
                navigate('/login');
            } else if (error.message.includes('권한')) {
                showToast(ERROR_TOAST_CONFIGS.NO_PERMISSION, { type: "error" });
            } else if (error.message.includes('찾을 수 없습니다')) {
                showToast(ERROR_TOAST_CONFIGS.MEETING_NOT_FOUND, { type: "error" });
            } else if (error.message.includes('네트워크')) {
                showToast(ERROR_TOAST_CONFIGS.NETWORK_ERROR, { type: "error" });
            } else if (error.message.includes('입력')) {
                showToast("입력 정보를 다시 확인해주세요", { type: "error" });
            } else {
                showToast(error.message || errorMessage, { type: "error" });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        const hasChanges = formData.title || formData.description || formData.location ||
            formData.openchat_url || selectedImage;

        if (hasChanges && !window.confirm("작성 중인 내용이 있습니다. 정말 나가시겠습니까?")) return;

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
        isInitialized
    };
};
