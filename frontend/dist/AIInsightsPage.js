import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { productService } from './services/productService';
import { aiService } from './services/aiService';
import { useToastContext } from './ToastContext';
import { Brain, TrendingUp, Package, Loader2, RefreshCw } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
const AIInsightsPage = () => {
    const { toast } = useToastContext();
    const [products, setProducts] = useState([]);
    const [inventoryAnalysis, setInventoryAnalysis] = useState('');
    const [salesAnalysis, setSalesAnalysis] = useState('');
    const [isLoadingInventory, setIsLoadingInventory] = useState(false);
    const [isLoadingSales, setIsLoadingSales] = useState(false);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    useEffect(() => {
        loadProducts();
    }, []);
    const loadProducts = async () => {
        try {
            setIsLoadingProducts(true);
            const data = await productService.getProducts();
            setProducts(data);
        }
        catch (error) {
            console.error('제품 데이터 로드 오류:', error);
            toast('제품 데이터를 불러오는데 실패했습니다.', 'error');
        }
        finally {
            setIsLoadingProducts(false);
        }
    };
    const generateInventoryAnalysis = async () => {
        if (products.length === 0) {
            toast('분석할 제품 데이터가 없습니다.', 'error');
            return;
        }
        setIsLoadingInventory(true);
        try {
            const analysis = await aiService.getInventoryOptimization(products);
            setInventoryAnalysis(analysis);
            toast('재고 분석이 완료되었습니다.', 'success');
        }
        catch (error) {
            console.error('재고 분석 오류:', error);
            toast('재고 분석에 실패했습니다.', 'error');
        }
        finally {
            setIsLoadingInventory(false);
        }
    };
    const generateSalesAnalysis = async () => {
        if (products.length === 0) {
            toast('분석할 제품 데이터가 없습니다.', 'error');
            return;
        }
        setIsLoadingSales(true);
        try {
            // 간단한 판매 데이터 시뮬레이션
            const salesData = products.map(product => ({
                name: product.name,
                category: product.category,
                currentStock: product.quantity,
                safetyStock: product.safetyStock,
                price: product.price,
                estimatedMonthlySales: Math.max(0, product.safetyStock - product.quantity + Math.floor(Math.random() * 50))
            }));
            const analysis = await aiService.getSalesAnalysis(salesData);
            setSalesAnalysis(analysis);
            toast('판매 분석이 완료되었습니다.', 'success');
        }
        catch (error) {
            console.error('판매 분석 오류:', error);
            toast('판매 분석에 실패했습니다.', 'error');
        }
        finally {
            setIsLoadingSales(false);
        }
    };
    const getInventoryStats = () => {
        const lowStock = products.filter(p => p.quantity <= p.safetyStock).length;
        const overStock = products.filter(p => p.quantity > p.safetyStock * 3).length;
        const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
        return { lowStock, overStock, totalValue, totalProducts: products.length };
    };
    const stats = getInventoryStats();
    return (_jsxs("div", { className: "container mx-auto px-4", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx(Brain, { className: "h-6 w-6 mr-3 text-kyobo" }), _jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "AI \uC778\uC0AC\uC774\uD2B8" }), _jsxs(Button, { variant: "outline", size: "sm", onClick: loadProducts, disabled: isLoadingProducts, className: "ml-auto", children: [isLoadingProducts ? (_jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" })) : (_jsx(RefreshCw, { className: "h-4 w-4 mr-2" })), "\uC0C8\uB85C\uACE0\uCE68"] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [_jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Package, { className: "h-8 w-8 text-blue-500" }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "\uC804\uCCB4 \uC81C\uD488" }), _jsx("p", { className: "text-2xl font-bold", children: stats.totalProducts })] })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx(TrendingUp, { className: "h-8 w-8 text-red-500" }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "\uBD80\uC871 \uC7AC\uACE0" }), _jsx("p", { className: "text-2xl font-bold text-red-600", children: stats.lowStock })] })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Package, { className: "h-8 w-8 text-orange-500" }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "\uACFC\uB2E4 \uC7AC\uACE0" }), _jsx("p", { className: "text-2xl font-bold text-orange-600", children: stats.overStock })] })] }) }) }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx(TrendingUp, { className: "h-8 w-8 text-green-500" }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-500", children: "\uCD1D \uC7AC\uACE0 \uAC00\uCE58" }), _jsxs("p", { className: "text-2xl font-bold text-green-600", children: ["\u20A9", stats.totalValue.toLocaleString()] })] })] }) }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Package, { className: "h-5 w-5 mr-2" }), "\uC7AC\uACE0 \uCD5C\uC801\uD654 \uBD84\uC11D"] }), _jsxs(Button, { onClick: generateInventoryAnalysis, disabled: isLoadingInventory || products.length === 0, size: "sm", children: [isLoadingInventory ? (_jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" })) : (_jsx(Brain, { className: "h-4 w-4 mr-2" })), "AI \uBD84\uC11D"] })] }) }), _jsx(CardContent, { children: inventoryAnalysis ? (_jsx("div", { className: "prose prose-sm max-w-none", children: _jsx("div", { className: "whitespace-pre-wrap text-gray-700", children: inventoryAnalysis }) })) : (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx(Package, { className: "h-12 w-12 mx-auto mb-4 opacity-50" }), _jsx("p", { children: "AI \uBD84\uC11D \uBC84\uD2BC\uC744 \uD074\uB9AD\uD558\uC5EC \uC7AC\uACE0 \uCD5C\uC801\uD654 \uC81C\uC548\uC744 \uBC1B\uC544\uBCF4\uC138\uC694." })] })) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(CardTitle, { className: "flex items-center", children: [_jsx(TrendingUp, { className: "h-5 w-5 mr-2" }), "\uD310\uB9E4 \uC608\uCE21 \uBD84\uC11D"] }), _jsxs(Button, { onClick: generateSalesAnalysis, disabled: isLoadingSales || products.length === 0, size: "sm", children: [isLoadingSales ? (_jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" })) : (_jsx(Brain, { className: "h-4 w-4 mr-2" })), "AI \uBD84\uC11D"] })] }) }), _jsx(CardContent, { children: salesAnalysis ? (_jsx("div", { className: "prose prose-sm max-w-none", children: _jsx("div", { className: "whitespace-pre-wrap text-gray-700", children: salesAnalysis }) })) : (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx(TrendingUp, { className: "h-12 w-12 mx-auto mb-4 opacity-50" }), _jsx("p", { children: "AI \uBD84\uC11D \uBC84\uD2BC\uC744 \uD074\uB9AD\uD558\uC5EC \uD310\uB9E4 \uC608\uCE21\uACFC \uC778\uC0AC\uC774\uD2B8\uB97C \uBC1B\uC544\uBCF4\uC138\uC694." })] })) })] })] }), _jsxs(Card, { className: "mt-6", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Brain, { className: "h-5 w-5 mr-2" }), "AI \uAE30\uB2A5 \uC548\uB0B4"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "text-center p-4 bg-blue-50 rounded-lg", children: [_jsx(Package, { className: "h-8 w-8 mx-auto mb-2 text-blue-500" }), _jsx("h3", { className: "font-semibold mb-2", children: "\uC7AC\uACE0 \uCD5C\uC801\uD654" }), _jsx("p", { className: "text-sm text-gray-600", children: "\uD604\uC7AC \uC7AC\uACE0 \uC0C1\uD669\uC744 \uBD84\uC11D\uD558\uC5EC \uCD5C\uC801\uD654 \uBC29\uC548\uC744 \uC81C\uC548\uD569\uB2C8\uB2E4." })] }), _jsxs("div", { className: "text-center p-4 bg-green-50 rounded-lg", children: [_jsx(TrendingUp, { className: "h-8 w-8 mx-auto mb-2 text-green-500" }), _jsx("h3", { className: "font-semibold mb-2", children: "\uD310\uB9E4 \uC608\uCE21" }), _jsx("p", { className: "text-sm text-gray-600", children: "\uACFC\uAC70 \uB370\uC774\uD130\uB97C \uBC14\uD0D5\uC73C\uB85C \uBBF8\uB798 \uD310\uB9E4\uB97C \uC608\uCE21\uD558\uACE0 \uBD84\uC11D\uD569\uB2C8\uB2E4." })] }), _jsxs("div", { className: "text-center p-4 bg-purple-50 rounded-lg", children: [_jsx(Brain, { className: "h-8 w-8 mx-auto mb-2 text-purple-500" }), _jsx("h3", { className: "font-semibold mb-2", children: "\uC2A4\uB9C8\uD2B8 \uC81C\uC548" }), _jsx("p", { className: "text-sm text-gray-600", children: "AI\uAC00 \uBE44\uC988\uB2C8\uC2A4 \uC131\uC7A5\uC744 \uC704\uD55C \uC2E4\uD589 \uAC00\uB2A5\uD55C \uC81C\uC548\uC744 \uC81C\uACF5\uD569\uB2C8\uB2E4." })] })] }) })] })] }));
};
export default AIInsightsPage;
