import { useCallback } from 'react';
import {
    showSuccessAlert,
    showErrorAlert,
    showConfirmDialog,
    showLoadingAlert,
    closeLoadingAlert,
    showInfoAlert,
    showWarningAlert,
    showToast
} from '../utils/alertUtils';

/**
 * Custom hook for SweetAlert2 utilities
 * Provides convenient methods for showing alerts and notifications
 */
const useAlert = () => {
    const success = useCallback((message, title) => {
        return showSuccessAlert(message, title);
    }, []);

    const error = useCallback((message, title) => {
        return showErrorAlert(message, title);
    }, []);

    const confirm = useCallback((title, text, confirmButtonText) => {
        return showConfirmDialog(title, text, confirmButtonText);
    }, []);

    const loading = useCallback((message) => {
        return showLoadingAlert(message);
    }, []);

    const closeLoading = useCallback(() => {
        return closeLoadingAlert();
    }, []);

    const info = useCallback((message, title) => {
        return showInfoAlert(message, title);
    }, []);

    const warning = useCallback((message, title) => {
        return showWarningAlert(message, title);
    }, []);

    const toast = useCallback((message, icon) => {
        return showToast(message, icon);
    }, []);

    return {
        success,
        error,
        confirm,
        loading,
        closeLoading,
        info,
        warning,
        toast
    };
};

export default useAlert;
