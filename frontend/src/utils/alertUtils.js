import Swal from 'sweetalert2';

// Success alert
export const showSuccessAlert = (message, title = 'Success!') => {
    return Swal.fire({
        icon: 'success',
        title,
        text: message,
        confirmButtonColor: '#3b82f6',
        timer: 3000,
        timerProgressBar: true,
    });
};

// Error alert
export const showErrorAlert = (message, title = 'Error!') => {
    return Swal.fire({
        icon: 'error',
        title,
        text: message,
        confirmButtonColor: '#ef4444',
    });
};

// Confirmation dialog
export const showConfirmDialog = (title = 'Are you sure?', text = 'This action cannot be undone', confirmButtonText = 'Yes, delete it!') => {
    return Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText,
        cancelButtonText: 'Cancel'
    });
};

// Loading alert
export const showLoadingAlert = (message = 'Processing...') => {
    return Swal.fire({
        title: message,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
};

// Close loading alert
export const closeLoadingAlert = () => {
    Swal.close();
};

// Info alert
export const showInfoAlert = (message, title = 'Info') => {
    return Swal.fire({
        icon: 'info',
        title,
        text: message,
        confirmButtonColor: '#3b82f6',
    });
};

// Warning alert
export const showWarningAlert = (message, title = 'Warning') => {
    return Swal.fire({
        icon: 'warning',
        title,
        text: message,
        confirmButtonColor: '#f59e0b',
    });
};

// Input dialog
export const showInputDialog = (title, inputLabel, inputType = 'text', inputValue = '') => {
    return Swal.fire({
        title,
        input: inputType,
        inputLabel,
        inputValue,
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
            if (!value) {
                return 'This field is required!';
            }
            if (inputType === 'number' && (isNaN(value) || value <= 0)) {
                return 'Please enter a valid positive number!';
            }
        }
    });
};

// Toast notification (small, non-intrusive)
export const showToast = (message, icon = 'success') => {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    return Toast.fire({
        icon,
        title: message
    });
};
