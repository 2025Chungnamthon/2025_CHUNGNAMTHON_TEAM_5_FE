import React, { useState, useEffect, createContext, useContext } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useToast } from '../hooks/useToast';

// ===== 애니메이션 =====
const slideDown = keyframes`
    0% {
        transform: translateY(-100%);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
`;

const slideUp = keyframes`
    0% {
        transform: translateY(0);
        opacity: 1;
    }
    100% {
        transform: translateY(-100%);
        opacity: 0;
    }
`;

// ===== 스타일 컴포넌트 =====
const ToastContainer = styled.div`
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    width: 100%;
    max-width: 430px;
    pointer-events: none;
`;

const ToastMessage = styled.div`
    background: #fff;
    color: #000;
    padding: 16px 20px;
    margin: 12px 20px 0 20px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 400;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    
    ${props => props.isVisible && css`
        animation: ${slideDown} 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    `}
    
    ${props => props.isLeaving && css`
        animation: ${slideUp} 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    `}
`;

const SuccessIcon = styled.span`
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 8px;
    background: #4ade80;
    border-radius: 50%;
    position: relative;
    vertical-align: middle;
    
    &::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 12px;
        font-weight: bold;
    }
`;

// ===== 토스트 컴포넌트 =====
const ToastNotification = ({
                               message,
                               isVisible,
                               onClose,
                               duration = 3000,
                               showIcon = true
                           }) => {
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsLeaving(false);

            const timer = setTimeout(() => {
                setIsLeaving(true);

                setTimeout(() => {
                    onClose?.();
                }, 300);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible && !isLeaving) return null;

    return (
        <ToastContainer>
            <ToastMessage
                isVisible={isVisible && !isLeaving}
                isLeaving={isLeaving}
            >
                {showIcon && <SuccessIcon />}
                {message}
            </ToastMessage>
        </ToastContainer>
    );
};

// ===== Context 설정 =====
const ToastContext = createContext();

export const useToastContext = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToastContext must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const { toast, showToast, hideToast } = useToast();

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastNotification
                message={toast.message}
                isVisible={toast.isVisible}
                onClose={hideToast}
                showIcon={toast.showIcon}
            />
        </ToastContext.Provider>
    );
};

export default ToastNotification;