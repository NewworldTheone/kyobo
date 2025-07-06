import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import apiClient from './services/authService';
import { useToastContext } from './ToastContext';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Loader2, MapPin, Image as ImageIcon, Save, Trash2 } from 'lucide-react';
const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToastContext();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('details');
    // 이미지 업로드 상태
    const [productImage, setProductImage] = useState(null);
    const [locationImage, setLocationImage] = useState(null);
    const [uploadingProductImage, setUploadingProductImage] = useState(false);
    const [uploadingLocationImage, setUploadingLocationImage] = useState(false);
    // 위치 정보 상태
    const [locationHistory, setLocationHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0, layoutId: '' });
    const [layouts, setLayouts] = useState([]);
    const [selectedLayout, setSelectedLayout] = useState(null);
    // 제품 정보 상태
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: '',
        brand: '',
        location: '',
        quantity: 0,
        safetyStock: 0,
        price: 0,
        description: ''
    });
    // 레이아웃 목록 로드 함수
    const fetchLayouts = useCallback(async () => {
        var _a;
        try {
            const response = await apiClient.get('/api/locations/layouts');
            setLayouts(response.data.data);
        }
        catch (error) {
            console.error('레이아웃 목록 로드 오류:', error);
            // 404 오류인 경우 빈 배열로 설정하여 무한 루프 방지
            if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
                setLayouts([]);
            }
        }
    }, []);
    // 특정 레이아웃 로드
    const fetchLayoutById = useCallback(async (layoutId) => {
        var _a;
        if (!layoutId)
            return;
        try {
            const response = await apiClient.get(`/api/locations/layouts/${layoutId}`);
            setSelectedLayout(response.data.data);
        }
        catch (error) {
            console.error('레이아웃 상세 로드 오류:', error);
            // 404 오류인 경우 선택된 레이아웃을 null로 설정
            if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
                setSelectedLayout(null);
            }
        }
    }, []);
    // 제품 정보 로드
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(`/api/products/${id}`);
                const productData = response.data.data;
                setProduct(productData);
                setFormData({
                    name: productData.name,
                    sku: productData.sku,
                    category: productData.category,
                    brand: productData.brand,
                    location: productData.location,
                    quantity: productData.quantity,
                    safetyStock: productData.safetyStock,
                    price: productData.price,
                    description: productData.description || ''
                });
                // 좌표 정보 설정
                if (productData.coordinates) {
                    setCoordinates(productData.coordinates);
                    // 레이아웃 ID가 있으면 해당 레이아웃 로드
                    if (productData.coordinates.layoutId) {
                        fetchLayoutById(productData.coordinates.layoutId);
                    }
                }
                // 이미지 URL 설정
                if (productData.productImage) {
                    setProductImage(`/api/uploads/products/${productData.productImage}`);
                }
                if (productData.locationImage) {
                    setLocationImage(`/api/uploads/locations/${productData.locationImage}`);
                }
                setLoading(false);
            }
            catch (error) {
                console.error('제품 정보 로드 오류:', error);
                toast('제품 정보를 불러오는 중 오류가 발생했습니다.', 'error');
                setLoading(false);
            }
        };
        if (id) {
            fetchProduct();
            fetchLayouts();
        }
    }, [id, toast, fetchLayouts, fetchLayoutById]);
    // 입력 필드 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' || name === 'safetyStock' || name === 'price'
                ? parseFloat(value) || 0
                : value
        }));
    };
    // 이미지 업로드 핸들러
    const handleImageUpload = async (e, type) => {
        var _a;
        const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        // 파일 크기 검사 (5MB 제한)
        if (file.size > 5 * 1024 * 1024) {
            toast('파일 크기는 5MB를 초과할 수 없습니다.', 'error');
            return;
        }
        // 이미지 파일 타입 검사
        if (!file.type.startsWith('image/')) {
            toast('이미지 파일만 업로드할 수 있습니다.', 'error');
            return;
        }
        try {
            if (type === 'product') {
                setUploadingProductImage(true);
            }
            else {
                setUploadingLocationImage(true);
            }
            const formData = new FormData();
            formData.append('file', file);
            formData.append('productId', id || '');
            formData.append('type', type);
            const response = await apiClient.post('/api/images/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const imageUrl = response.data.data.imageUrl;
            if (type === 'product') {
                setProductImage(`/api/uploads/products/${imageUrl}`);
                setUploadingProductImage(false);
            }
            else {
                setLocationImage(`/api/uploads/locations/${imageUrl}`);
                setUploadingLocationImage(false);
            }
            toast('이미지가 성공적으로 업로드되었습니다.', 'success');
        }
        catch (error) {
            console.error('이미지 업로드 오류:', error);
            toast('이미지 업로드 중 오류가 발생했습니다.', 'error');
            if (type === 'product') {
                setUploadingProductImage(false);
            }
            else {
                setUploadingLocationImage(false);
            }
        }
    };
    // 이미지 삭제 핸들러
    const handleDeleteImage = async (type) => {
        try {
            if (type === 'product') {
                setUploadingProductImage(true);
            }
            else {
                setUploadingLocationImage(true);
            }
            await apiClient.delete('/api/images', {
                data: {
                    productId: id,
                    imageType: type
                }
            });
            if (type === 'product') {
                setProductImage(null);
                setUploadingProductImage(false);
            }
            else {
                setLocationImage(null);
                setUploadingLocationImage(false);
            }
            toast('이미지가 성공적으로 삭제되었습니다.', 'success');
        }
        catch (error) {
            console.error('이미지 삭제 오류:', error);
            toast('이미지 삭제 중 오류가 발생했습니다.', 'error');
            if (type === 'product') {
                setUploadingProductImage(false);
            }
            else {
                setUploadingLocationImage(false);
            }
        }
    };
    // 레이아웃 선택 핸들러
    const handleLayoutSelect = async (layoutId) => {
        var _a;
        if (!layoutId) {
            setSelectedLayout(null);
            setCoordinates(prev => ({ ...prev, layoutId: '' }));
            return;
        }
        try {
            const response = await apiClient.get(`/api/locations/layouts/${layoutId}`);
            setSelectedLayout(response.data.data);
            setCoordinates(prev => ({ ...prev, layoutId }));
            toast('레이아웃이 선택되었습니다.', 'success');
        }
        catch (error) {
            console.error('레이아웃 선택 오류:', error);
            if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
                toast('선택한 레이아웃을 찾을 수 없습니다.', 'error');
            }
            else {
                toast('레이아웃을 선택하는 중 오류가 발생했습니다.', 'error');
            }
        }
    };
    // 좌표 선택 핸들러 (레이아웃 맵에서 클릭)
    const handleCoordinateSelect = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
        const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
        setCoordinates(prev => ({
            ...prev,
            x: Math.max(0, Math.min(100, x)),
            y: Math.max(0, Math.min(100, y))
        }));
    };
    // 제품 정보 저장 핸들러
    const handleSave = async () => {
        try {
            setSaving(true);
            // 제품 정보 업데이트
            const updatedProduct = {
                ...formData,
                coordinates: coordinates,
                productImage: product === null || product === void 0 ? void 0 : product.productImage,
                locationImage: product === null || product === void 0 ? void 0 : product.locationImage
            };
            await apiClient.put(`/api/products/${id}`, updatedProduct);
            // 제품 정보 다시 로드
            const response = await apiClient.get(`/api/products/${id}`);
            setProduct(response.data.data);
            toast('제품 정보가 성공적으로 저장되었습니다.', 'success');
        }
        catch (error) {
            console.error('제품 정보 저장 오류:', error);
            toast('제품 정보 저장 중 오류가 발생했습니다.', 'error');
        }
        finally {
            setSaving(false);
        }
    };
    // 위치 정보 업데이트 핸들러
    const handleLocationUpdate = async () => {
        try {
            setSaving(true);
            // 위치 정보 업데이트
            await apiClient.put(`/api/products/${id}/location`, {
                coordinates: coordinates
            });
            // 제품 정보 다시 로드
            const response = await apiClient.get(`/api/products/${id}`);
            setProduct(response.data.data);
            toast('위치 정보가 성공적으로 업데이트되었습니다.', 'success');
        }
        catch (error) {
            console.error('위치 정보 업데이트 오류:', error);
            toast('위치 정보 업데이트 중 오류가 발생했습니다.', 'error');
        }
        finally {
            setSaving(false);
        }
    };
    // 위치 이력 조회 함수
    const fetchLocationHistory = async () => {
        try {
            setLoadingHistory(true);
            const response = await apiClient.get(`/api/products/${id}/location-history`);
            setLocationHistory(response.data.data);
            setLoadingHistory(false);
        }
        catch (error) {
            console.error('위치 이력 조회 오류:', error);
            toast('위치 이력을 불러오는 중 오류가 발생했습니다.', 'error');
            setLoadingHistory(false);
        }
    };
    if (loading) {
        return (_jsxs("div", { className: "flex items-center justify-center h-screen", children: [_jsx(Loader2, { className: "h-8 w-8 animate-spin" }), _jsx("span", { className: "ml-2", children: "\uC81C\uD488 \uC815\uBCF4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911..." })] }));
    }
    return (_jsxs("div", { className: "container mx-auto py-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-3xl font-bold", children: formData.name }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Button, { onClick: () => navigate(-1), children: "\uB4A4\uB85C\uAC00\uAE30" }), _jsxs(Button, { onClick: handleSave, disabled: saving, children: [saving ? _jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }) : null, "\uC800\uC7A5"] })] })] }), _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [_jsxs(TabsList, { className: "grid grid-cols-3 mb-6", children: [_jsx(TabsTrigger, { value: "details", children: "\uAE30\uBCF8 \uC815\uBCF4" }), _jsx(TabsTrigger, { value: "images", children: "\uC774\uBBF8\uC9C0" }), _jsx(TabsTrigger, { value: "location", children: "\uC704\uCE58 \uAD00\uB9AC" })] }), _jsx(TabsContent, { value: "details", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "\uC81C\uD488 \uAE30\uBCF8 \uC815\uBCF4" }) }), _jsxs(CardContent, { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "name", children: "\uC81C\uD488\uBA85" }), _jsx(Input, { id: "name", name: "name", value: formData.name, onChange: handleChange })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "sku", children: "SKU" }), _jsx(Input, { id: "sku", name: "sku", value: formData.sku, onChange: handleChange, disabled: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "category", children: "\uCE74\uD14C\uACE0\uB9AC" }), _jsx(Input, { id: "category", name: "category", value: formData.category, onChange: handleChange })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "brand", children: "\uBE0C\uB79C\uB4DC" }), _jsx(Input, { id: "brand", name: "brand", value: formData.brand, onChange: handleChange })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "quantity", children: "\uC218\uB7C9" }), _jsx(Input, { id: "quantity", name: "quantity", type: "number", value: formData.quantity, onChange: handleChange })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "safetyStock", children: "\uC548\uC804 \uC7AC\uACE0" }), _jsx(Input, { id: "safetyStock", name: "safetyStock", type: "number", value: formData.safetyStock, onChange: handleChange })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "price", children: "\uAC00\uACA9" }), _jsx(Input, { id: "price", name: "price", type: "number", value: formData.price, onChange: handleChange })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "location", children: "\uC704\uCE58" }), _jsx(Input, { id: "location", name: "location", value: formData.location, onChange: handleChange })] }), _jsxs("div", { className: "space-y-2 md:col-span-2", children: [_jsx(Label, { htmlFor: "description", children: "\uC124\uBA85" }), _jsx("textarea", { id: "description", name: "description", value: formData.description, onChange: handleChange, className: "w-full h-32 px-3 py-2 border rounded-md" })] })] }), _jsx(CardFooter, { className: "flex justify-end", children: _jsxs(Button, { onClick: handleSave, disabled: saving, children: [saving ? _jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }) : _jsx(Save, { className: "h-4 w-4 mr-2" }), "\uC800\uC7A5"] }) })] }) }), _jsx(TabsContent, { value: "images", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "\uC81C\uD488 \uC774\uBBF8\uC9C0" }) }), _jsx(CardContent, { className: "flex flex-col items-center", children: productImage ? (_jsxs("div", { className: "relative w-full", children: [_jsx("img", { src: productImage, alt: "\uC81C\uD488 \uC774\uBBF8\uC9C0", className: "w-full h-64 object-contain border rounded-md" }), _jsx(Button, { variant: "destructive", size: "sm", className: "absolute top-2 right-2", onClick: () => handleDeleteImage('product'), disabled: uploadingProductImage, children: uploadingProductImage ? _jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : _jsx(Trash2, { className: "h-4 w-4" }) })] })) : (_jsxs("div", { className: "w-full h-64 border rounded-md flex flex-col items-center justify-center bg-gray-50", children: [_jsx(ImageIcon, { className: "h-16 w-16 text-gray-300" }), _jsx("p", { className: "text-gray-500 mt-2", children: "\uC81C\uD488 \uC774\uBBF8\uC9C0 \uC5C6\uC74C" })] })) }), _jsx(CardFooter, { children: _jsxs("div", { className: "w-full", children: [_jsx(Label, { htmlFor: "productImage", className: "block mb-2", children: "\uC774\uBBF8\uC9C0 \uC5C5\uB85C\uB4DC" }), _jsx(Input, { id: "productImage", type: "file", accept: "image/*", onChange: (e) => handleImageUpload(e, 'product') })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "\uC704\uCE58 \uC774\uBBF8\uC9C0" }) }), _jsx(CardContent, { className: "flex flex-col items-center", children: locationImage ? (_jsxs("div", { className: "relative w-full", children: [_jsx("img", { src: locationImage, alt: "\uC704\uCE58 \uC774\uBBF8\uC9C0", className: "w-full h-64 object-contain border rounded-md" }), _jsx(Button, { variant: "destructive", size: "sm", className: "absolute top-2 right-2", onClick: () => handleDeleteImage('location'), disabled: uploadingLocationImage, children: uploadingLocationImage ? _jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : _jsx(Trash2, { className: "h-4 w-4" }) })] })) : (_jsxs("div", { className: "w-full h-64 border rounded-md flex flex-col items-center justify-center bg-gray-50", children: [_jsx(ImageIcon, { className: "h-16 w-16 text-gray-300" }), _jsx("p", { className: "text-gray-500 mt-2", children: "\uC704\uCE58 \uC774\uBBF8\uC9C0 \uC5C6\uC74C" })] })) }), _jsx(CardFooter, { children: _jsxs("div", { className: "w-full", children: [_jsx(Label, { htmlFor: "locationImage", className: "block mb-2", children: "\uC774\uBBF8\uC9C0 \uC5C5\uB85C\uB4DC" }), _jsx(Input, { id: "locationImage", type: "file", accept: "image/*", onChange: (e) => handleImageUpload(e, 'location') })] }) })] })] }) }), _jsx(TabsContent, { value: "location", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "\uC704\uCE58 \uC9C0\uC815" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "layoutSelect", children: "\uB808\uC774\uC544\uC6C3 \uC120\uD0DD" }), _jsxs("select", { id: "layoutSelect", className: "w-full p-2 border rounded-md", value: coordinates.layoutId, onChange: (e) => handleLayoutSelect(e.target.value), children: [_jsx("option", { value: "", children: "\uB808\uC774\uC544\uC6C3 \uC120\uD0DD" }), layouts.map((layout) => (_jsx("option", { value: layout.id, children: layout.name }, layout.id)))] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "\uC88C\uD45C \uC9C0\uC815" }), _jsxs("div", { className: "flex space-x-4", children: [_jsxs("div", { className: "space-y-1 flex-1", children: [_jsx(Label, { htmlFor: "xCoord", children: "X \uC88C\uD45C" }), _jsx(Input, { id: "xCoord", type: "number", value: coordinates.x, onChange: (e) => setCoordinates(prev => ({ ...prev, x: parseInt(e.target.value) || 0 })), min: "0", max: "100" })] }), _jsxs("div", { className: "space-y-1 flex-1", children: [_jsx(Label, { htmlFor: "yCoord", children: "Y \uC88C\uD45C" }), _jsx(Input, { id: "yCoord", type: "number", value: coordinates.y, onChange: (e) => setCoordinates(prev => ({ ...prev, y: parseInt(e.target.value) || 0 })), min: "0", max: "100" })] })] })] }), _jsxs("div", { className: "mt-4", children: [_jsx(Label, { children: "\uB808\uC774\uC544\uC6C3 \uB9F5 (\uD074\uB9AD\uD558\uC5EC \uC704\uCE58 \uC120\uD0DD)" }), _jsx("div", { className: "border rounded-md p-4 mt-2 bg-gray-50 h-64 flex items-center justify-center cursor-crosshair relative", onClick: selectedLayout ? handleCoordinateSelect : undefined, children: selectedLayout ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "absolute w-4 h-4 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none", style: { left: `${coordinates.x}%`, top: `${coordinates.y}%` } }), _jsxs("p", { className: "absolute bottom-2 right-2 text-xs text-gray-500", children: ["X: ", coordinates.x, ", Y: ", coordinates.y] })] })) : (_jsx("p", { className: "text-gray-500", children: "\uB808\uC774\uC544\uC6C3\uC744 \uC120\uD0DD\uD558\uC138\uC694" })) })] }), _jsxs(Button, { onClick: handleLocationUpdate, disabled: saving || !coordinates.layoutId, className: "w-full mt-4", children: [saving ? _jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }) : _jsx(MapPin, { className: "h-4 w-4 mr-2" }), "\uC704\uCE58 \uC815\uBCF4 \uC800\uC7A5"] })] }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [_jsx(CardTitle, { children: "\uC704\uCE58 \uC774\uB825" }), _jsx(Button, { variant: "outline", size: "sm", onClick: fetchLocationHistory, disabled: loadingHistory, children: loadingHistory ? _jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : "새로고침" })] }), _jsx(CardContent, { children: loadingHistory ? (_jsxs("div", { className: "flex items-center justify-center h-64", children: [_jsx(Loader2, { className: "h-8 w-8 animate-spin" }), _jsx("span", { className: "ml-2", children: "\uC774\uB825\uC744 \uBD88\uB7EC\uC624\uB294 \uC911..." })] })) : locationHistory.length > 0 ? (_jsx("div", { className: "space-y-4 max-h-64 overflow-y-auto", children: locationHistory.map((history, index) => (_jsx("div", { className: "border rounded-md p-3", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("div", { children: _jsxs("p", { className: "text-sm text-gray-500", children: ["\uC704\uCE58: ", history.newLocation] }) }), _jsx("p", { className: "text-xs text-gray-400", children: new Date(history.movedAt).toLocaleString() })] }) }, index))) })) : (_jsx("div", { className: "flex items-center justify-center h-64 text-gray-500", children: "\uC704\uCE58 \uC774\uB825\uC774 \uC5C6\uC2B5\uB2C8\uB2E4" })) })] })] }) })] })] }));
};
export default ProductDetailPage;
