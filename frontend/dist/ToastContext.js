import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const ToastContext = createContext(undefined);
const TOAST_DURATION = 3000;
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const toast = (message, type = 'info') => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            removeToast(id);
        }, TOAST_DURATION);
    };
    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };
    const getToastStyle = (type) => {
        const typeStyles = {
            success: 'toast toast-success',
            error: 'toast toast-error',
            info: 'toast toast-info'
        };
        return typeStyles[type];
    };
    return (_jsxs(ToastContext.Provider, { value: { toast, toasts, removeToast }, children: [children, _jsx("div", { className: "toast-container", children: toasts.map((toast) => (_jsx("div", { className: getToastStyle(toast.type), children: toast.message }, toast.id))) })] }));
}
export function useToastContext() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToastContext must be used within a ToastProvider');
    }
    return context;
}
