import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from './services/productService';
import { offlineService } from './services/offlineService';
import { useToastContext } from './ToastContext';
import { ArrowLeft, Save, AlertTriangle, Plus, Minus } from 'lucide-react';
const ProductAdjustInventoryPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToastContext();
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const queryClient = useQueryClient();
    const [quantity, setQuantity] = useState(0);
    const [memo, setMemo] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: () => productService.getProduct(id),
        enabled: !!id
    });
    const adjustMutation = useMutation({
        mutationFn: (data) => productService.adjustInventory(data.productId, data.quantity, data.memo),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product', id] });
            toast('제품 재고가 성공적으로 조정되었습니다.', 'success');
            navigate(`/products/${id}`);
        },
        onError: (error) => {
            console.error('재고 조정 오류:', error);
            toast('제품 재고를 조정하는 중 오류가 발생했습니다.', 'error');
            setIsSubmitting(false);
        }
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!id || quantity === 0)
            return;
        setIsSubmitting(true);
        if (isOnline) {
            // 온라인 모드: 직접 API 호출
            adjustMutation.mutate({ productId: id, quantity, memo });
        }
        else {
            // 오프라인 모드: IndexedDB에 저장
            try {
                await offlineService.queueInventoryAdjustment(id, quantity, memo);
                toast('오프라인 상태입니다. 온라인 연결 시 자동으로 동기화됩니다.', 'info');
                navigate(`/products/${id}`);
            }
            catch (error) {
                console.error('오프라인 재고 조정 오류:', error);
                toast('오프라인 작업을 저장하는 중 오류가 발생했습니다.', 'error');
                setIsSubmitting(false);
            }
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "loading-spinner", children: _jsx("div", { className: "loading-spinner-icon" }) }));
    }
    if (error || !product) {
        return (_jsx("div", { className: "alert alert-error mb-6", children: _jsxs("div", { className: "alert-content", children: [_jsx("div", { className: "alert-icon", children: _jsx(AlertTriangle, { className: "h-5 w-5" }) }), _jsx("div", { className: "alert-content", children: _jsx("p", { className: "alert-message", children: "\uC81C\uD488 \uC815\uBCF4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694." }) })] }) }));
    }
    return (_jsxs("div", { className: "container-main", children: [_jsxs("div", { className: "page-header", children: [_jsx("button", { onClick: () => navigate(-1), className: "btn-back", children: _jsx(ArrowLeft, { className: "h-5 w-5" }) }), _jsx("h1", { className: "page-title", children: "\uC7AC\uACE0 \uC870\uC815" })] }), _jsxs("div", { className: "card", children: [_jsxs("div", { className: "card-header", children: [_jsx("h2", { className: "card-title", children: product.name }), _jsxs("p", { className: "card-subtitle", children: ["SKU: ", product.sku] })] }), _jsx("div", { className: "card-body", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-form", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "currentQuantity", className: "form-label", children: "\uD604\uC7AC \uC7AC\uACE0" }), _jsx("input", { type: "text", id: "currentQuantity", value: product.quantity, disabled: true, className: "form-input-disabled" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "adjustmentType", className: "form-label", children: "\uC870\uC815 \uC720\uD615" }), _jsxs("div", { className: "inventory-adjust-type-options", children: [_jsxs("div", { className: "inventory-adjust-type-option", children: [_jsx("input", { id: "adjustmentTypeIn", name: "adjustmentType", type: "radio", checked: quantity > 0, onChange: () => setQuantity(Math.abs(quantity) || 1), className: "form-radio" }), _jsxs("label", { htmlFor: "adjustmentTypeIn", className: "form-radio-label", children: [_jsx(Plus, { className: "text-icon-sm text-green-500" }), "\uC785\uACE0"] })] }), _jsxs("div", { className: "inventory-adjust-type-option", children: [_jsx("input", { id: "adjustmentTypeOut", name: "adjustmentType", type: "radio", checked: quantity < 0, onChange: () => setQuantity(quantity === 0 ? -1 : -Math.abs(quantity)), className: "form-radio" }), _jsxs("label", { htmlFor: "adjustmentTypeOut", className: "form-radio-label", children: [_jsx(Minus, { className: "text-icon-sm text-red-500" }), "\uCD9C\uACE0"] })] })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "quantity", className: "form-label", children: "\uC218\uB7C9" }), _jsx("input", { type: "number", id: "quantity", value: Math.abs(quantity), onChange: (e) => {
                                                const value = parseInt(e.target.value) || 0;
                                                setQuantity(quantity < 0 ? -value : value);
                                            }, min: "1", required: true, className: "form-input" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "memo", className: "form-label", children: "\uBA54\uBAA8" }), _jsx("textarea", { id: "memo", value: memo, onChange: (e) => setMemo(e.target.value), rows: 3, className: "form-textarea", placeholder: "\uC870\uC815 \uC0AC\uC720 \uB610\uB294 \uCC38\uACE0 \uC0AC\uD56D" })] }), !isOnline && (_jsx("div", { className: "inventory-adjust-offline-notice", children: _jsxs("div", { className: "inventory-adjust-offline-content", children: [_jsx("div", { className: "inventory-adjust-offline-icon", children: _jsx(AlertTriangle, { className: "h-5 w-5 text-yellow-400" }) }), _jsxs("div", { className: "inventory-adjust-offline-text", children: [_jsx("h3", { className: "inventory-adjust-offline-title", children: "\uC624\uD504\uB77C\uC778 \uBAA8\uB4DC" }), _jsx("div", { className: "inventory-adjust-offline-message", children: _jsx("p", { children: "\uD604\uC7AC \uC624\uD504\uB77C\uC778 \uC0C1\uD0DC\uC785\uB2C8\uB2E4. \uC7AC\uACE0 \uC870\uC815 \uC791\uC5C5\uC740 \uC800\uC7A5\uB418\uBA70, \uC628\uB77C\uC778 \uC5F0\uACB0 \uC2DC \uC790\uB3D9\uC73C\uB85C \uB3D9\uAE30\uD654\uB429\uB2C8\uB2E4." }) })] })] }) })), _jsxs("div", { className: "flex justify-end space-x-buttons", children: [_jsx("button", { type: "button", onClick: () => navigate(`/products/${id}`), className: "btn-secondary", children: "\uCDE8\uC18C" }), _jsxs("button", { type: "submit", disabled: isSubmitting || quantity === 0, className: "btn-primary", children: [_jsx(Save, { className: "text-icon" }), isSubmitting ? '처리 중...' : '재고 조정'] })] })] }) })] })] }));
};
export default ProductAdjustInventoryPage;
