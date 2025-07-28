import { useState, useCallback } from 'react';

export const useToast = () => {
    const [toast, setToast] = useState({
        isVisible: false,
        message: '',
        showIcon: true
    });

    const showToast = useCallback((message, options = {}) => {
        setToast({
            isVisible: true,
            message,
            showIcon: options.showIcon !== false
        });
    }, []);

    const hideToast = useCallback(() => {
        setToast(prev => ({
            ...prev,
            isVisible: false
        }));
    }, []);

    return {
        toast,
        showToast,
        hideToast
    };
};