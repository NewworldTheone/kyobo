import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { productService } from './services/productService';
import { aiService } from './services/aiService';
import { useToastContext } from './ToastContext';
import { ArrowLeft, Save, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
const ProductNewPage = () => {
    const navigate = useNavigate();
    const { toast } = useToastContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
    const [isCategorizingProduct, setIsCategorizingProduct] = useState(false);
    const [productImage, setProductImage] = useState(null);
    const [coordinates, setCoordinates] = useState(null);
    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();
    const watchedFields = watch(['name', 'category', 'brand']);
    // AI 제품 설명 생성
    const generateDescription = async () => {
        const [name, category, brand] = watchedFields;
        if (!name || !category || !brand) {
            toast('제품명, 카테고리, 브랜드를 먼저 입력해주세요.', 'error');
            return;
        }
        setIsGeneratingDescription(true);
        try {
            const description = await aiService.generateProductDescription(name, category, brand);
            setValue('description', description);
            toast('AI가 제품 설명을 생성했습니다.', 'success');
        }
        catch (error) {
            console.error('AI 설명 생성 오류:', error);
            toast('AI 설명 생성에 실패했습니다.', 'error');
        }
        finally {
            setIsGeneratingDescription(false);
        }
    };
    // AI 카테고리 자동 분류
    const categorizeProduct = async () => {
        const name = watchedFields[0];
        if (!name) {
            toast('제품명을 먼저 입력해주세요.', 'error');
            return;
        }
        setIsCategorizingProduct(true);
        try {
            const category = await aiService.categorizeProduct(name);
            setValue('category', category);
            toast('AI가 카테고리를 분류했습니다.', 'success');
        }
        catch (error) {
            console.error('AI 카테고리 분류 오류:', error);
            toast('AI 카테고리 분류에 실패했습니다.', 'error');
        }
        finally {
            setIsCategorizingProduct(false);
        }
    };
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const result = await productService.createProduct({
                name: data.name,
                sku: data.sku,
                category: data.category,
                brand: data.brand,
                location: data.location,
                quantity: parseInt(data.quantity),
                safetyStock: parseInt(data.safetyStock),
                price: parseFloat(data.price),
                description: data.description,
                productImage: productImage || undefined,
                locationImage: undefined,
                coordinates: coordinates || undefined
            });
            toast('새로운 제품이 등록되었습니다.', 'success');
            navigate(`/products/${result.id}`);
        }
        catch (error) {
            console.error('제품 등록 오류:', error);
            toast('제품을 등록하는 중 오류가 발생했습니다.', 'error');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs("div", { className: "container mx-auto px-4", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx("button", { onClick: () => navigate(-1), className: "mr-4 text-gray-600 hover:text-gray-900", children: _jsx(ArrowLeft, { className: "h-5 w-5" }) }), _jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "\uC2E0\uADDC \uC81C\uD488 \uB4F1\uB85D" })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "\uC81C\uD488 \uC815\uBCF4 \uC785\uB825" }) }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "name", children: "\uC81C\uD488\uBA85 *" }), _jsx(Input, { id: "name", ...register('name', { required: '제품명을 입력해주세요' }) }), errors.name && (_jsx("p", { className: "text-sm text-red-600", children: errors.name.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "sku", children: "SKU *" }), _jsx(Input, { id: "sku", ...register('sku', { required: 'SKU를 입력해주세요' }) }), errors.sku && (_jsx("p", { className: "text-sm text-red-600", children: errors.sku.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Label, { htmlFor: "category", children: "\uCE74\uD14C\uACE0\uB9AC *" }), _jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: categorizeProduct, disabled: isCategorizingProduct || !watchedFields[0], className: "text-xs", children: [isCategorizingProduct ? (_jsx(Loader2, { className: "h-3 w-3 animate-spin mr-1" })) : (_jsx(Wand2, { className: "h-3 w-3 mr-1" })), "AI \uBD84\uB958"] })] }), _jsx(Input, { id: "category", ...register('category', { required: '카테고리를 입력해주세요' }) }), errors.category && (_jsx("p", { className: "text-sm text-red-600", children: errors.category.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "brand", children: "\uBE0C\uB79C\uB4DC *" }), _jsx(Input, { id: "brand", ...register('brand', { required: '브랜드를 입력해주세요' }) }), errors.brand && (_jsx("p", { className: "text-sm text-red-600", children: errors.brand.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "location", children: "\uC704\uCE58 *" }), _jsx(Input, { id: "location", ...register('location', { required: '위치를 입력해주세요' }) }), errors.location && (_jsx("p", { className: "text-sm text-red-600", children: errors.location.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "quantity", children: "\uC218\uB7C9 *" }), _jsx(Input, { id: "quantity", type: "number", ...register('quantity', {
                                                        required: '수량을 입력해주세요',
                                                        min: { value: 0, message: '수량은 0 이상이어야 합니다' }
                                                    }) }), errors.quantity && (_jsx("p", { className: "text-sm text-red-600", children: errors.quantity.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "safetyStock", children: "\uC548\uC804 \uC7AC\uACE0 *" }), _jsx(Input, { id: "safetyStock", type: "number", ...register('safetyStock', {
                                                        required: '안전 재고를 입력해주세요',
                                                        min: { value: 0, message: '안전 재고는 0 이상이어야 합니다' }
                                                    }) }), errors.safetyStock && (_jsx("p", { className: "text-sm text-red-600", children: errors.safetyStock.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "price", children: "\uB2E8\uAC00 *" }), _jsx(Input, { id: "price", type: "number", step: "0.01", ...register('price', {
                                                        required: '단가를 입력해주세요',
                                                        min: { value: 0, message: '단가는 0 이상이어야 합니다' }
                                                    }) }), errors.price && (_jsx("p", { className: "text-sm text-red-600", children: errors.price.message }))] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Label, { htmlFor: "description", children: "\uC81C\uD488 \uC124\uBA85" }), _jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: generateDescription, disabled: isGeneratingDescription || !watchedFields[0] || !watchedFields[1] || !watchedFields[2], className: "text-xs", children: [isGeneratingDescription ? (_jsx(Loader2, { className: "h-3 w-3 animate-spin mr-1" })) : (_jsx(Sparkles, { className: "h-3 w-3 mr-1" })), "AI \uC0DD\uC131"] })] }), _jsx("textarea", { id: "description", rows: 4, className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-kyobo focus:border-transparent", placeholder: "\uC81C\uD488\uC5D0 \uB300\uD55C \uC0C1\uC138 \uC124\uBA85\uC744 \uC785\uB825\uD558\uC138\uC694...", ...register('description') })] }), _jsxs("div", { className: "flex justify-end space-x-4", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => navigate(-1), children: "\uCDE8\uC18C" }), _jsx(Button, { type: "submit", disabled: isSubmitting, children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "animate-spin mr-2", children: "\u231B" }), "\uC800\uC7A5 \uC911..."] })) : (_jsxs(_Fragment, { children: [_jsx(Save, { className: "h-4 w-4 mr-2" }), "\uC800\uC7A5"] })) })] })] }) })] })] }));
};
export default ProductNewPage;
