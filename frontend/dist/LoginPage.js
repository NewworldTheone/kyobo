import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';
const LoginPage = () => {
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = async (data) => {
        try {
            setError(null);
            await login(data.email, data.password);
            // 리디렉션은 AuthContext에서 처리됨
        }
        catch (err) {
            setError('이메일 또는 비밀번호가 올바르지 않습니다.');
            console.error('로그인 오류:', err);
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-md w-full space-y-8", children: [_jsxs("div", { children: [_jsx("img", { className: "mx-auto h-12 w-auto", src: "/logo.svg", alt: "\uAD50\uBCF4\uBB38\uACE0 \uD56B\uD2B8\uB799\uC2A4" }), _jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "\uC1A1\uB3C4\uC810 \uC7AC\uACE0\uAD00\uB9AC \uC2DC\uC2A4\uD15C" }), _jsx("p", { className: "mt-2 text-center text-sm text-gray-600", children: "\uACC4\uC815 \uC815\uBCF4\uB85C \uB85C\uADF8\uC778\uD558\uC138\uC694" })] }), _jsxs("form", { className: "mt-8 space-y-6", onSubmit: handleSubmit(onSubmit), children: [_jsxs("div", { className: "rounded-md shadow-sm -space-y-px", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "sr-only", children: "\uC774\uBA54\uC77C" }), _jsx("input", { id: "email", type: "email", autoComplete: "email", className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-kyobo focus:border-kyobo focus:z-10 sm:text-sm", placeholder: "\uC774\uBA54\uC77C", ...register('email', {
                                                required: '이메일을 입력해주세요',
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: '유효한 이메일 주소를 입력해주세요',
                                                }
                                            }) }), errors.email && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.email.message }))] }), _jsxs("div", { className: "relative", children: [_jsx("label", { htmlFor: "password", className: "sr-only", children: "\uBE44\uBC00\uBC88\uD638" }), _jsx("input", { id: "password", type: showPassword ? 'text' : 'password', autoComplete: "current-password", className: "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-kyobo focus:border-kyobo focus:z-10 sm:text-sm", placeholder: "\uBE44\uBC00\uBC88\uD638", ...register('password', { required: '비밀번호를 입력해주세요' }) }), _jsx("button", { type: "button", className: "absolute inset-y-0 right-0 pr-3 flex items-center", onClick: () => setShowPassword(!showPassword), children: showPassword ? (_jsx(EyeOff, { className: "h-5 w-5 text-gray-400" })) : (_jsx(Eye, { className: "h-5 w-5 text-gray-400" })) }), errors.password && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.password.message }))] })] }), error && (_jsx("div", { className: "rounded-md bg-red-50 p-4", children: _jsx("div", { className: "flex", children: _jsx("div", { className: "ml-3", children: _jsx("h3", { className: "text-sm font-medium text-red-800", children: error }) }) }) })), _jsx("div", { children: _jsx("button", { type: "submit", disabled: loading, className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-kyobo hover:bg-kyobo-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kyobo disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? '로그인 중...' : '로그인' }) }), _jsxs("div", { className: "text-sm text-center", children: [_jsx("p", { className: "text-gray-600", children: "\uD14C\uC2A4\uD2B8 \uACC4\uC815: admin@kyobobook.com / admin123" }), _jsx("p", { className: "text-gray-600", children: "\uC9C1\uC6D0 \uACC4\uC815: staff@kyobobook.com / staff123" })] })] })] }) }));
};
export default LoginPage;
