import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {meetingApi} from '../../../services/meetingApi';

// 폼 초기 상태
const INITIAL_FORM_STATE = {
    title: "",
    description: "",
    location: "",
    maxMember: 4,
    imageUrl: ""
};

// 폼 유효성 검사
const validateForm = (formData) => {
    const errors = {};

    if (!formData.title.trim()) {
        errors.title = "모임명을 입력해주세요.";
    } else if (formData.title.length > 50) {
        errors.title = "모임명은 50자 이내로 입력해주세요.";
    }

    if (!formData.location.trim()) {
        errors.location = "활동 동네를 선택해주세요.";
    }

    if (formData.maxMember < 2 || formData.maxMember > 10) {
        errors.maxMember = "인원은 2명 이상 10명 이하로 설정해주세요.";
    }

    if (formData.description.length > 500) {
        errors.description = "모임 소개는 500자 이내로 입력해주세요.";
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
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // 폼 데이터 업데이트
    const updateFormData = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // 해당 필드 에러 제거
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    // 위치 선택 핸들러
    const handleLocationSelect = (location) => {
        if (location === "검색") {
            // 검색 기능은 나중에 구현
            console.log("검색 기능 준비 중...");
            return;
        }
        setSelectedLocation(location);
        updateFormData('location', location);
    };

    // 인원 수 변경 핸들러
    const handleMemberCountChange = (newCount) => {
        if (newCount >= 2 && newCount <= 10) {
            updateFormData('maxMember', newCount);
        }
    };

    // 이미지 업로드 핸들러 (향후 구현)
    const handleImageUpload = () => {
        // TODO: 실제 이미지 업로드 구현
        alert("사진 추가 기능 준비 중입니다!");
    };

    // 폼 제출 핸들러
    const handleSubmit = async () => {
        console.log("폼 제출 시도:", formData);

        // 유효성 검사
        const validation = validateForm(formData);

        if (!validation.isValid) {
            setErrors(validation.errors);
            const firstErrorMessage = Object.values(validation.errors)[0];
            alert(firstErrorMessage);
            console.log("유효성 검사 실패:", validation.errors);
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            // API 호출용 데이터 준비
            const submitData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                location: formData.location.trim(),
                maxMember: formData.maxMember,
                imageUrl: formData.imageUrl || "url" // API 명세서에 따른 기본값
            };

            console.log("API 호출 데이터:", submitData);

            const response = await meetingApi.createMeeting(submitData);

            console.log("API 응답:", response);

            // 성공 처리
            alert(`모임이 성공적으로 생성되었습니다! (ID: ${response.data.meetingId})`);

            // 모임 리스트 페이지로 이동
            navigate('/meetings');

        } catch (error) {
            console.error('모임 생성 오류:', error);

            // 에러 타입별 처리
            if (error.message.includes('fetch')) {
                alert('서버 연결에 실패했습니다. 네트워크를 확인해주세요.');
            } else if (error.message.includes('400')) {
                alert('입력 정보를 다시 확인해주세요.');
            } else if (error.message.includes('500')) {
                alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            } else {
                alert(error.message || '모임 생성 중 오류가 발생했습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // 폼 리셋
    const resetForm = () => {
        setFormData(INITIAL_FORM_STATE);
        setSelectedLocation("");
        setErrors({});
        console.log("폼 초기화 완료");
    };

    // 뒤로가기 핸들러
    const handleBack = () => {
        if (formData.title || formData.description || formData.location) {
            const confirmLeave = window.confirm("작성 중인 내용이 있습니다. 정말 나가시겠습니까?");
            if (!confirmLeave) return;
        }
        navigate(-1);
    };

    // 폼 유효성 상태
    const validation = validateForm(formData);
    const isFormValid = validation.isValid;

    // 폼 진행 상태 (옵션)
    const getFormProgress = () => {
        let progress = 0;
        if (formData.title.trim()) progress += 30;
        if (formData.location.trim()) progress += 30;
        if (formData.description.trim()) progress += 20;
        if (formData.maxMember !== 4) progress += 10; // 기본값에서 변경했을 때
        if (formData.imageUrl) progress += 10;
        return Math.min(progress, 100);
    };

    return {
        // 상태
        formData,
        selectedLocation,
        isLoading,
        errors,
        isFormValid,

        // 계산된 값
        formProgress: getFormProgress(),

        // 액션
        updateFormData,
        handleLocationSelect,
        handleMemberCountChange,
        handleImageUpload,
        handleSubmit,
        handleBack,
        resetForm
    };
};