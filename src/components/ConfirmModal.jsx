import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
`;

const ModalContent = styled.div`
    background: white;
    border-radius: 16px;
    padding: 32px 24px 24px 24px;
    width: 100%;
    max-width: 320px;
    text-align: center;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin: 0 0 24px 0;
    line-height: 1.4;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 12px;
`;

const Button = styled.button`
    flex: 1;
    padding: 16px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: none;

    ${props => props.variant === 'primary' ? `
        background: ${props.primaryColor || '#80c7bc'};
        color: white;
        
        &:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
        
        &:active {
            transform: translateY(0);
        }
    ` : `
        background: #f5f5f5;
        color: #666;
        
        &:hover {
            background: #eee;
            transform: translateY(-1px);
        }
        
        &:active {
            transform: translateY(0);
        }
    `}
`;

const ConfirmModal = ({
                          isOpen,
                          onClose,
                          title,
                          cancelText = "취소",
                          confirmText = "확인",
                          onConfirm,
                          primaryColor = "#80c7bc"
                      }) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <ModalOverlay onClick={handleOverlayClick}>
            <ModalContent>
                <ModalTitle>{title}</ModalTitle>
                <ButtonContainer>
                    <Button onClick={onClose}>
                        {cancelText}
                    </Button>
                    <Button
                        variant="primary"
                        primaryColor={primaryColor}
                        onClick={handleConfirm}
                    >
                        {confirmText}
                    </Button>
                </ButtonContainer>
            </ModalContent>
        </ModalOverlay>
    );
};

export default ConfirmModal;