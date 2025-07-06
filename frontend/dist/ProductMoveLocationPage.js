import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from './services/productService';
import { offlineService } from './services/offlineService';
import { useToastContext } from './ToastContext';
import { useSyncOffline } from './hooks/useSyncOffline';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';
const ProductMoveLocationPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToastContext();
    const { isOnline } = useSyncOffline();
    const queryClient = useQueryClient();
    const [toLocation, setToLocation] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: () => productService.getProduct(id),
        enabled: !!id
    });
    const moveMutation = useMutation({
        mutationFn: (data) => productService.moveLocation(data.productId, data.toLocation),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product', id] });
            toast('제품 위치가 성공적으로 변경되었습니다.', 'success');
            navigate(`/products/${id}`);
        },
        onError: (error) => {
            console.error('위치 변경 오류:', error);
            toast('제품 위치를 변경하는 중 오류가 발생했습니다.', 'error');
            setIsSubmitting(false);
        }
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!id || !toLocation)
            return;
        if (product && product.location === toLocation) {
            toast('현재 위치와 동일합니다.', 'error');
            return;
        }
        setIsSubmitting(true);
        if (isOnline) {
            // 온라인 모드: 직접 API 호출
            moveMutation.mutate({ productId: id, toLocation });
        }
        else {
            // 오프라인 모드: IndexedDB에 저장
            try {
                await offlineService.queueLocationMove(id, toLocation);
                toast('오프라인 상태입니다. 온라인 연결 시 자동으로 동기화됩니다.', 'info');
                navigate(`/products/${id}`);
            }
            catch (error) {
                console.error('오프라인 위치 변경 오류:', error);
                toast('오프라인 작업을 저장하는 중 오류가 발생했습니다.', 'error');
                setIsSubmitting(false);
            }
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex justify-center items-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kyobo" }) }));
    }
    if (error || !product) {
        return (_jsx("div", { className: "bg-red-50 border-l-4 border-red-400 p-4 mb-6", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(AlertTriangle, { className: "h-5 w-5 text-red-400" }) }), _jsx("div", { className: "ml-3", children: _jsx("p", { className: "text-sm text-red-700", children: "\uC81C\uD488 \uC815\uBCF4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694." }) })] }) }));
    }
    return (_jsxs("div", { className: "container mx-auto px-4", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx("button", { onClick: () => navigate(-1), className: "mr-4 text-gray-600 hover:text-gray-900", children: _jsx(ArrowLeft, { className: "h-5 w-5" }) }), _jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "\uC704\uCE58 \uBCC0\uACBD" })] }), _jsxs("div", { className: "bg-white shadow overflow-hidden rounded-lg", children: [_jsxs("div", { className: "px-4 py-5 sm:px-6", children: [_jsx("h2", { className: "text-lg font-medium text-gray-900", children: product.name }), _jsxs("p", { className: "mt-1 max-w-2xl text-sm text-gray-500", children: ["SKU: ", product.sku] })] }), _jsx("div", { className: "border-t border-gray-200 px-4 py-5 sm:p-6", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "currentLocation", className: "block text-sm font-medium text-gray-700", children: "\uD604\uC7AC \uC704\uCE58" }), _jsx("input", { type: "text", id: "currentLocation", value: product.location, disabled: true, className: "mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-100 rounded-md shadow-sm text-gray-500 sm:text-sm" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "toLocation", className: "block text-sm font-medium text-gray-700", children: "\uC0C8 \uC704\uCE58" }), _jsx("input", { type: "text", id: "toLocation", value: toLocation, onChange: (e) => setToLocation(e.target.value), required: true, className: "mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-kyobo focus:border-kyobo sm:text-sm", placeholder: "\uC608: \uB9E4\uC7A5 A-1, \uCC3D\uACE0 B-2" })] }), !isOnline && (_jsx("div", { className: "rounded-md bg-yellow-50 p-4", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(AlertTriangle, { className: "h-5 w-5 text-yellow-400" }) }), _jsxs("div", { className: "ml-3", children: [_jsx("h3", { className: "text-sm font-medium text-yellow-800", children: "\uC624\uD504\uB77C\uC778 \uBAA8\uB4DC" }), _jsx("div", { className: "mt-2 text-sm text-yellow-700", children: _jsx("p", { children: "\uD604\uC7AC \uC624\uD504\uB77C\uC778 \uC0C1\uD0DC\uC785\uB2C8\uB2E4. \uC704\uCE58 \uBCC0\uACBD \uC791\uC5C5\uC740 \uC800\uC7A5\uB418\uBA70, \uC628\uB77C\uC778 \uC5F0\uACB0 \uC2DC \uC790\uB3D9\uC73C\uB85C \uB3D9\uAE30\uD654\uB429\uB2C8\uB2E4." }) })] })] }) })), _jsxs("div", { className: "flex justify-end", children: [_jsx("button", { type: "button", onClick: () => navigate(`/products/${id}`), className: "mr-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kyobo", children: "\uCDE8\uC18C" }), _jsxs("button", { type: "submit", disabled: isSubmitting || !toLocation || product.location === toLocation, className: "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-kyobo hover:bg-kyobo-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kyobo disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx(Save, { className: "h-4 w-4 mr-2" }), isSubmitting ? '처리 중...' : '위치 변경'] })] })] }) })] })] }));
};
export default ProductMoveLocationPage;
