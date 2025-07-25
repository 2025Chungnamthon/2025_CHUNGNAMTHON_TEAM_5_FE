import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { meetingApi } from '../../../services/meetingApi';
import { isAuthenticated } from '../../../services/auth';

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

    // 이미지 관련 상태 추가
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const updateLocationOptions = (newLocation) => {
        if (newLocation === "검색") return; // 검색 버튼은 무시

        setLocationOptions(prev => {
            // "검색"을 제외한 현재 지역들
            const currentLocations = prev.slice(1);

            // 이미 존재하는 지역인지 확인
            const existingIndex = currentLocations.indexOf(newLocation);

            if (existingIndex !== -1) {
                // 이미 존재하는 경우: 순서 변경 없이 그대로 유지
                return prev;
            } else {
                // 새로운 지역인 경우: 맨 앞에 추가하고 3개만 유지
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

    // 이미지 업로드 핸들러
    const handleImageUpload = (file, preview) => {
        setSelectedImage(file);
        setImagePreview(preview);

        // 실제 프로젝트에서는 여기서 서버에 이미지를 업로드하고 URL을 받아와야 합니다!
        // 현재는 샘플 이미지 URL 사용
        if (file) {
            updateFormData('image_url', "https://example.com/meeting.jpg");
        } else {
            updateFormData('image_url', "");
        }
    };

    const handleSubmit = async () => {
        // 인증 상태 먼저 확인
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
                openchat_url: formData.openchat_url.trim(),
                image_url: formData.image_url || "https://example.com/meeting.jpg"
            };

            console.log('전송할 데이터:', submitData);

            const response = await meetingApi.createMeeting(submitData);

            // 생성된 모임의 ID 추출
            const meetingId = response.data?.meetingId;

            if (meetingId) {
                // 성공 메시지와 함께 생성된 모임 상세페이지로 이동
                alert(`모임이 성공적으로 생성되었습니다!`);
                navigate(`/meetings/${meetingId}`);
            } else {
                // meetingId가 없으면 목록 페이지로
                alert(`모임이 생성되었습니다!`);
                navigate('/meetings');
            }

        } catch (error) {
            console.error('모임 생성 오류:', error);

            // 사용자에게 적절한 에러 메시지 표시
            if (error.message.includes('로그인')) {
                alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
                navigate('/login');
            } else if (error.message.includes('네트워크')) {
                alert('인터넷 연결을 확인해주세요.');
            } else {
                alert(error.message || '모임 생성 중 오류가 발생했습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        if (formData.title || formData.description || formData.location || selectedImage) {
            const confirmLeave = window.confirm("작성 중인 내용이 있습니다. 정말 나가시겠습니까?");
            if (!confirmLeave) return;
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
        canSubmit
    };
};