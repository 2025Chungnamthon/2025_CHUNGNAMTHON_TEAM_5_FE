import React, {useState} from "react";
import styled from "styled-components";

const ModalContainer = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 360px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    padding: 24px 20px;
    text-align: center;
`;

const Title = styled.h2`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 16px;
`;

const CouponName = styled.div`
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 4px;
`;

const RemainText = styled.div`
    font-size: 13px;
    color: #3b82f6;
    margin-bottom: 6px;
    text-align: right;
`;

const Input = styled.input`
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 14px;
    margin-bottom: 16px;
`;

const SubmitButton = styled.button`
    width: 100%;
    padding: 14px;
    background: ${(props) => (props.disabled ? "#e5e7eb" : "#89d5c9")};
    color: ${(props) => (props.disabled ? "#9ca3af" : "white")};
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    margin-bottom: 12px;
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
    transition: all 0.2s ease;

    &:hover {
        background: ${(props) => (props.disabled ? "#e5e7eb" : "#7bc4b8")};
    }

    &:active {
        transform: ${(props) => (props.disabled ? "none" : "scale(0.98)")};
    }
`;

const WarningText = styled.div`
    font-size: 12px;
    color: #ef4444;
    text-align: center;
`;

const CouponUseModal = ({couponName, remainDays, onSubmit, onClose}) => {
    const [code, setCode] = useState("");

    const handleSubmit = () => {
        if (code.trim() && !isNaN(parseInt(code, 10))) {
            onSubmit(code);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && code.trim() && !isNaN(parseInt(code, 10))) {
            handleSubmit();
        }
    };

    const isButtonDisabled = !code.trim() || isNaN(parseInt(code, 10));

    return (
        <>
            {/* 배경 클릭으로 모달 닫기 */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0, 0, 0, 0.5)",
                    zIndex: 999,
                }}
                onClick={onClose}
            />
            <ModalContainer>
                <Title>쿠폰을 사용할까요?</Title>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                    }}
                >
                    <CouponName>{couponName}</CouponName>
                    {typeof remainDays === "number" && (
                        <RemainText>{remainDays}일 남음</RemainText>
                    )}
                </div>
                <Input
                    type="number"
                    placeholder="사장님 전용 확인 코드를 입력해주세요"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <SubmitButton onClick={handleSubmit} disabled={isButtonDisabled}>
                    쿠폰 사용하기
                </SubmitButton>
                <WarningText>사용하기 버튼을 누르면 취소가 불가능해요</WarningText>
            </ModalContainer>
        </>
    );
};

export default CouponUseModal;
