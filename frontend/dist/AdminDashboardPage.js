import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useToastContext } from './ToastContext';
import { apiClient } from './services/authService';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Loader2, BarChart, Settings, Map } from 'lucide-react';
// 함수형 프로그래밍: 고차 함수를 이용한 API 호출 래퍼
// 오류 표시 상태를 관리하여 중복 오류 메시지 방지
let lastErrorTime = 0;
const ERROR_THROTTLE_TIME = 3000; // 3초
const withErrorHandling = (apiCall, errorMessage, toast) => {
    return async () => {
        try {
            return await apiCall();
        }
        catch (error) {
            console.error(errorMessage, error);
            // 중복 오류 메시지 방지: 3초 내에 같은 오류가 발생하면 토스트 표시 안함
            const currentTime = Date.now();
            if (currentTime - lastErrorTime > ERROR_THROTTLE_TIME) {
                toast(errorMessage, 'error');
                lastErrorTime = currentTime;
            }
            throw error;
        }
    };
};
// 함수형 컴포넌트: 재사용 가능한 필터 입력 필드
const FilterField = React.memo(({ label, type = 'text', name, value, onChange, placeholder, options, min, max }) => (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: label }), type === 'select' ? (_jsx("select", { name: name, value: value, onChange: onChange, className: "w-full p-2 border rounded", children: options === null || options === void 0 ? void 0 : options.map(option => (_jsx("option", { value: option.value, children: option.label }, option.value))) })) : type === 'checkbox' ? (_jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", id: name, name: name, checked: value, onChange: onChange, className: "mr-2" }), _jsx("label", { htmlFor: name, children: placeholder })] })) : (_jsx(Input, { type: type, name: name, value: value, onChange: onChange, placeholder: placeholder, min: min, max: max }))] })));
// 함수형 컴포넌트: 재사용 가능한 통계 카드
const StatCard = React.memo(({ title, value, formatter = (v) => v }) => (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: title }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-3xl font-bold", children: formatter(value) }) })] })));
// 함수형 컴포넌트: 재사용 가능한 데이터 테이블
const DataTable = React.memo(({ columns, data, loading, emptyMessage }) => {
    if (loading) {
        return (_jsxs("div", { className: "flex items-center justify-center h-64", children: [_jsx(Loader2, { className: "h-8 w-8 animate-spin" }), _jsx("span", { className: "ml-2", children: "\uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uB294 \uC911..." })] }));
    }
    if (data.length === 0) {
        return _jsx("p", { className: "text-center text-gray-500 py-8", children: emptyMessage });
    }
    return (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsx("tr", { className: "bg-gray-100", children: columns.map(column => (_jsx("th", { className: "p-2 text-left", children: column.label }, column.key))) }) }), _jsx("tbody", { children: data.map((row, index) => (_jsx("tr", { className: "border-t", children: columns.map(column => (_jsx("td", { className: "p-2", children: column.render ? column.render(row[column.key], row) : row[column.key] }, column.key))) }, row.id || index))) })] }) }));
});
// 함수형 컴포넌트: 재사용 가능한 필터 카드
const FilterCard = React.memo(({ title, children, onApply }) => (_jsxs(Card, { className: "mb-6", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: title }) }), _jsx(CardContent, { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: children }), _jsx(CardFooter, { children: _jsx(Button, { onClick: onApply, children: "\uD544\uD130 \uC801\uC6A9" }) })] })));
const AdminDashboardPage = React.memo(() => {
    const navigate = useNavigate();
    const { toast } = useToastContext();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('sales');
    // 판매 데이터 상태
    const [salesData, setSalesData] = useState([]);
    const [salesStats, setSalesStats] = useState({
        totalSales: 0,
        totalQuantity: 0,
        recordCount: 0
    });
    const [salesFilter, setSalesFilter] = useState({
        startDate: '',
        endDate: '',
        category: '',
        brand: ''
    });
    // 메모이제이션된 필터링된 판매 데이터
    const filteredSalesData = useMemo(() => {
        return salesData.filter((sale) => {
            var _a, _b;
            const saleDate = new Date(sale.saleDate);
            const startDate = salesFilter.startDate ? new Date(salesFilter.startDate) : null;
            const endDate = salesFilter.endDate ? new Date(salesFilter.endDate) : null;
            if (startDate && saleDate < startDate)
                return false;
            if (endDate && saleDate > endDate)
                return false;
            if (salesFilter.category && ((_a = sale.product) === null || _a === void 0 ? void 0 : _a.category) !== salesFilter.category)
                return false;
            if (salesFilter.brand && ((_b = sale.product) === null || _b === void 0 ? void 0 : _b.brand) !== salesFilter.brand)
                return false;
            return true;
        });
    }, [salesData, salesFilter]);
    // 메모이제이션된 통계 계산
    const memoizedSalesStats = useMemo(() => {
        return filteredSalesData.reduce((stats, sale) => {
            return {
                totalSales: stats.totalSales + (sale.amount || 0),
                totalQuantity: stats.totalQuantity + (sale.quantity || 0),
                recordCount: stats.recordCount + 1
            };
        }, { totalSales: 0, totalQuantity: 0, recordCount: 0 });
    }, [filteredSalesData]);
    // 재고 예측 상태
    const [predictions, setPredictions] = useState([]);
    const [predictionDays, setPredictionDays] = useState(30);
    const [predictionFilter, setPredictionFilter] = useState({
        category: '',
        needsReorder: false
    });
    const [settings, setSettings] = useState({});
    const [newSetting, setNewSetting] = useState({
        key: '',
        value: '',
        type: 'string',
        description: ''
    });
    // 함수형 프로그래밍: 쿼리 파라미터 생성 함수
    const createQueryParams = useCallback((filters) => {
        return Object.entries(filters)
            .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
            .reduce((params, [key, value]) => {
            params.append(key, value.toString());
            return params;
        }, new URLSearchParams());
    }, []);
    // 함수형 프로그래밍: 고차 함수를 이용한 데이터 페처 팩토리
    const createDataFetcher = useCallback((endpoint, setter, processor) => {
        return withErrorHandling(async () => {
            setLoading(true);
            const response = await apiClient.get(endpoint);
            const processedData = processor ? processor(response.data.data) : response.data.data;
            setter(processedData);
            setLoading(false);
            return processedData;
        }, `${endpoint} 데이터를 불러오는 중 오류가 발생했습니다.`, toast);
    }, [toast]);
    // 함수형 프로그래밍: 메모이제이션된 데이터 페처들
    const fetchSalesData = useMemo(() => {
        const queryParams = createQueryParams(salesFilter);
        return createDataFetcher(`/api/admin/sales?${queryParams.toString()}`, (data) => {
            setSalesData(data.records);
            setSalesStats(data.stats);
        });
    }, [salesFilter, createQueryParams, createDataFetcher]);
    const fetchPredictions = useMemo(() => {
        const queryParams = createQueryParams({ days: predictionDays, category: predictionFilter.category });
        return createDataFetcher(`/api/admin/predictions?${queryParams.toString()}`, setPredictions, (data) => predictionFilter.needsReorder ? data.filter((item) => item.needsReorder) : data);
    }, [predictionDays, predictionFilter, createQueryParams, createDataFetcher]);
    const fetchSettings = useMemo(() => {
        return createDataFetcher('/api/admin/settings', setSettings);
    }, [createDataFetcher]);
    // 함수형 프로그래밍: 탭별 데이터 페처 매핑
    const tabDataFetchers = useMemo(() => ({
        sales: fetchSalesData,
        predictions: fetchPredictions,
        settings: fetchSettings
    }), [fetchSalesData, fetchPredictions, fetchSettings]);
    // 탭 변경 시 필요한 데이터 로드 (오류 발생 시 한 번만 표시)
    useEffect(() => {
        const fetcher = tabDataFetchers[activeTab];
        if (fetcher) {
            fetcher().catch(() => {
                // 오류는 withErrorHandling에서 이미 처리되므로 여기서는 무시
            });
        }
    }, [activeTab, tabDataFetchers]);
    // 함수형 프로그래밍: 고차 함수를 이용한 필터 변경 핸들러 팩토리
    const createFilterHandler = useCallback((setter) => {
        return (e) => {
            const { name, value, type } = e.target;
            const checked = e.target.checked;
            setter((prev) => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        };
    }, []);
    // 메모이제이션된 필터 핸들러들
    const handleSalesFilterChange = useMemo(() => createFilterHandler(setSalesFilter), [createFilterHandler]);
    const handlePredictionFilterChange = useMemo(() => createFilterHandler(setPredictionFilter), [createFilterHandler]);
    const handleNewSettingChange = useMemo(() => createFilterHandler(setNewSetting), [createFilterHandler]);
    // 함수형 프로그래밍: 필터 적용 함수들
    const applySalesFilter = useCallback(() => fetchSalesData(), [fetchSalesData]);
    const applyPredictionFilter = useCallback(() => fetchPredictions(), [fetchPredictions]);
    // 함수형 프로그래밍: 타입별 값 변환 함수 매핑
    const valueConverters = useMemo(() => ({
        number: (value) => parseFloat(value),
        boolean: (value) => value === 'true',
        json: (value) => {
            try {
                return JSON.parse(value);
            }
            catch (e) {
                throw new Error('JSON 형식이 올바르지 않습니다.');
            }
        },
        string: (value) => value
    }), []);
    // 함수형 프로그래밍: 설정 변경 핸들러
    const handleSettingChange = useCallback((key, value) => {
        const setting = settings[key];
        if (!setting)
            return;
        try {
            const converter = valueConverters[setting.type];
            const processedValue = converter ? converter(value) : value;
            updateSetting(key, processedValue, setting.type, setting.description || '');
        }
        catch (error) {
            toast(error.message, 'error');
        }
    }, [settings, valueConverters, toast]);
    // 설정 업데이트/생성
    const updateSetting = async (key, value, type, description) => {
        try {
            const response = await apiClient.put(`/api/admin/settings/${key}`, {
                value,
                type,
                description
            });
            // 설정 목록 새로고침
            fetchSettings();
            toast('설정이 성공적으로 업데이트되었습니다.', 'success');
        }
        catch (error) {
            console.error('설정 업데이트 오류:', error);
            toast('설정을 업데이트하는 중 오류가 발생했습니다.', 'error');
        }
    };
    // 새 설정 생성
    const createSetting = async () => {
        try {
            if (!newSetting.key || !newSetting.value) {
                toast('키와 값은 필수 입력 항목입니다.', 'error');
                return;
            }
            let processedValue = newSetting.value;
            // 타입에 따른 값 변환
            if (newSetting.type === 'json') {
                try {
                    JSON.parse(newSetting.value);
                }
                catch (e) {
                    toast('JSON 형식이 올바르지 않습니다.', 'error');
                    return;
                }
            }
            const response = await apiClient.put(`/api/admin/settings/${newSetting.key}`, {
                value: processedValue,
                type: newSetting.type,
                description: newSetting.description
            });
            // 설정 목록 새로고침
            fetchSettings();
            // 입력 폼 초기화
            setNewSetting({
                key: '',
                value: '',
                type: 'string',
                description: ''
            });
            toast('새 설정이 성공적으로 생성되었습니다.', 'success');
        }
        catch (error) {
            console.error('설정 생성 오류:', error);
            toast('설정을 생성하는 중 오류가 발생했습니다.', 'error');
        }
    };
    // 설정 삭제
    const deleteSetting = async (key) => {
        try {
            const response = await apiClient.delete(`/api/admin/settings/${key}`);
            // 설정 목록 새로고침
            fetchSettings();
            toast('설정이 성공적으로 삭제되었습니다.', 'success');
        }
        catch (error) {
            console.error('설정 삭제 오류:', error);
            toast('설정을 삭제하는 중 오류가 발생했습니다.', 'error');
        }
    };
    // 관리자 권한 확인
    useEffect(() => {
        if (user && user.role !== 'admin') {
            toast('관리자만 접근할 수 있는 페이지입니다.', 'error');
            navigate('/');
        }
    }, [user, navigate, toast]);
    if (!user || user.role !== 'admin') {
        return null;
    }
    return (_jsxs("div", { className: "container mx-auto py-6", children: [_jsx("div", { className: "flex justify-between items-center mb-6", children: _jsx("h1", { className: "text-3xl font-bold", children: "\uAD00\uB9AC\uC790 \uB300\uC2DC\uBCF4\uB4DC" }) }), _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [_jsxs(TabsList, { className: "grid grid-cols-3 mb-6", children: [_jsxs(TabsTrigger, { value: "sales", children: [_jsx(BarChart, { className: "h-4 w-4 mr-2" }), "\uD310\uB9E4 \uB370\uC774\uD130"] }), _jsxs(TabsTrigger, { value: "predictions", children: [_jsx(Map, { className: "h-4 w-4 mr-2" }), "\uC7AC\uACE0 \uC608\uCE21"] }), _jsxs(TabsTrigger, { value: "settings", children: [_jsx(Settings, { className: "h-4 w-4 mr-2" }), "\uC2DC\uC2A4\uD15C \uC124\uC815"] })] }), _jsxs(TabsContent, { value: "sales", children: [_jsxs(FilterCard, { title: "\uD310\uB9E4 \uB370\uC774\uD130 \uD544\uD130", onApply: applySalesFilter, children: [_jsx(FilterField, { label: "\uC2DC\uC791\uC77C", type: "date", name: "startDate", value: salesFilter.startDate, onChange: handleSalesFilterChange }), _jsx(FilterField, { label: "\uC885\uB8CC\uC77C", type: "date", name: "endDate", value: salesFilter.endDate, onChange: handleSalesFilterChange }), _jsx(FilterField, { label: "\uCE74\uD14C\uACE0\uB9AC", name: "category", value: salesFilter.category, onChange: handleSalesFilterChange, placeholder: "\uCE74\uD14C\uACE0\uB9AC" }), _jsx(FilterField, { label: "\uBE0C\uB79C\uB4DC", name: "brand", value: salesFilter.brand, onChange: handleSalesFilterChange, placeholder: "\uBE0C\uB79C\uB4DC" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-6", children: [
                                    { title: '총 판매액', value: memoizedSalesStats.totalSales, formatter: (v) => `${v.toLocaleString()}원` },
                                    { title: '총 판매 수량', value: memoizedSalesStats.totalQuantity, formatter: (v) => `${v.toLocaleString()}개` },
                                    { title: '판매 기록 수', value: memoizedSalesStats.recordCount, formatter: (v) => `${v.toLocaleString()}건` }
                                ].map(stat => (_jsx(StatCard, { ...stat }, stat.title))) }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "\uD310\uB9E4 \uAE30\uB85D" }) }), _jsx(CardContent, { children: _jsx(DataTable, { columns: [
                                                { key: 'saleDate', label: '날짜', render: (value) => new Date(value).toLocaleDateString() },
                                                { key: 'product', label: '제품명', render: (value) => value.name },
                                                { key: 'product', label: '카테고리', render: (value) => value.category },
                                                { key: 'quantity', label: '수량' },
                                                { key: 'amount', label: '금액', render: (value) => `${value.toLocaleString()}원` },
                                                { key: 'user', label: '담당자', render: (value) => value.name }
                                            ], data: filteredSalesData, loading: loading, emptyMessage: "\uD310\uB9E4 \uAE30\uB85D\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." }) })] })] }), _jsxs(TabsContent, { value: "predictions", children: [_jsxs(FilterCard, { title: "\uC7AC\uACE0 \uC608\uCE21 \uC124\uC815", onApply: applyPredictionFilter, children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "\uC608\uCE21 \uAE30\uAC04 (\uC77C)" }), _jsx(Input, { type: "number", value: predictionDays, onChange: (e) => setPredictionDays(parseInt(e.target.value)), min: "1", max: "365" })] }), _jsx(FilterField, { label: "\uCE74\uD14C\uACE0\uB9AC", name: "category", value: predictionFilter.category, onChange: handlePredictionFilterChange, placeholder: "\uCE74\uD14C\uACE0\uB9AC" }), _jsx(FilterField, { label: "\uC7AC\uC8FC\uBB38 \uD544\uC694 \uD56D\uBAA9\uB9CC \uD45C\uC2DC", type: "checkbox", name: "needsReorder", value: predictionFilter.needsReorder, onChange: handlePredictionFilterChange, placeholder: "\uC7AC\uC8FC\uBB38 \uD544\uC694 \uD56D\uBAA9\uB9CC \uD45C\uC2DC" })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "\uC7AC\uACE0 \uC608\uCE21 \uACB0\uACFC" }) }), _jsx(CardContent, { children: _jsx(DataTable, { columns: [
                                                { key: 'productName', label: '제품명' },
                                                { key: 'category', label: '카테고리' },
                                                { key: 'currentStock', label: '현재 재고' },
                                                { key: 'predictedDemand', label: '예상 수요' },
                                                { key: 'suggestedOrderQuantity', label: '권장 주문량' },
                                                {
                                                    key: 'needsReorder',
                                                    label: '재주문 필요',
                                                    render: (value) => (_jsx("span", { className: `px-2 py-1 rounded text-sm ${value
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-green-100 text-green-800'}`, children: value ? '필요' : '불필요' }))
                                                }
                                            ], data: predictions, loading: loading, emptyMessage: "\uC608\uCE21 \uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." }) })] })] }), _jsxs(TabsContent, { value: "settings", children: [_jsxs(Card, { className: "mb-6", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "\uC0C8 \uC124\uC815 \uCD94\uAC00" }) }), _jsxs(CardContent, { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [[
                                                { key: 'key', label: '키', placeholder: '설정 키' },
                                                { key: 'value', label: '값', placeholder: '설정 값' },
                                                { key: 'description', label: '설명', placeholder: '설정 설명' }
                                            ].map(field => (_jsx(FilterField, { label: field.label, name: field.key, value: newSetting[field.key], onChange: handleNewSettingChange, placeholder: field.placeholder }, field.key))), _jsx(FilterField, { label: "\uD0C0\uC785", type: "select", name: "type", value: newSetting.type, onChange: handleNewSettingChange, options: [
                                                    { value: 'string', label: '문자열' },
                                                    { value: 'number', label: '숫자' },
                                                    { value: 'boolean', label: '불린' },
                                                    { value: 'json', label: 'JSON' }
                                                ] })] }), _jsx(CardFooter, { children: _jsx(Button, { onClick: createSetting, children: "\uC124\uC815 \uCD94\uAC00" }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "\uC2DC\uC2A4\uD15C \uC124\uC815" }) }), _jsx(CardContent, { children: loading ? (_jsxs("div", { className: "flex items-center justify-center h-64", children: [_jsx(Loader2, { className: "h-8 w-8 animate-spin" }), _jsx("span", { className: "ml-2", children: "\uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uB294 \uC911..." })] })) : Object.keys(settings).length > 0 ? (_jsx("div", { className: "space-y-4", children: Object.entries(settings).map(([key, setting]) => (_jsx("div", { className: "border p-4 rounded", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 items-center", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "\uD0A4" }), _jsx("p", { className: "text-sm text-gray-600", children: key })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "\uAC12" }), setting.type === 'boolean' ? (_jsxs("select", { value: setting.value, onChange: (e) => handleSettingChange(key, e.target.value), className: "w-full p-2 border rounded", children: [_jsx("option", { value: "true", children: "true" }), _jsx("option", { value: "false", children: "false" })] })) : setting.type === 'json' ? (_jsx("textarea", { value: typeof setting.value === 'object' ? JSON.stringify(setting.value, null, 2) : setting.value, onChange: (e) => handleSettingChange(key, e.target.value), className: "w-full p-2 border rounded", rows: 3 })) : (_jsx(Input, { type: setting.type === 'number' ? 'number' : 'text', value: setting.value, onChange: (e) => handleSettingChange(key, e.target.value) }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "\uD0C0\uC785" }), _jsx("p", { className: "text-sm text-gray-600", children: setting.type })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "\uC124\uBA85" }), _jsx("p", { className: "text-sm text-gray-600", children: setting.description || '설명 없음' }), _jsx(Button, { variant: "destructive", size: "sm", onClick: () => deleteSetting(key), className: "mt-2", children: "\uC0AD\uC81C" })] })] }) }, key))) })) : (_jsx("p", { className: "text-center text-gray-500 py-8", children: "\uC124\uC815\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." })) })] })] })] })] }));
});
export default AdminDashboardPage;
