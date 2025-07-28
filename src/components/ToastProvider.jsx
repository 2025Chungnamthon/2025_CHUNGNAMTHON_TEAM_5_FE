import React, { createContext, useContext } from 'react';
import { useToast } from '../hooks/useToast';
import ToastNotification from './ToastNotification';

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

export default ToastProvider;