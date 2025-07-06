import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToastContext } from './ToastContext';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Input } from './components/ui/input';
import { format } from 'date-fns';
export default function ReportsPage() {
    const { toast } = useToastContext();
    const [reportType, setReportType] = useState('inventory');
    const [startDate, setStartDate] = useState(format(new Date().setDate(new Date().getDate() - 30), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const { data: reportData, isLoading } = useQuery({
        queryKey: ['reports', reportType, startDate, endDate],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/reports?type=${reportType}&startDate=${startDate}&endDate=${endDate}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('보고서를 불러오는데 실패했습니다.');
            }
            return response.json();
        },
    });
    const handleExport = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/reports/export?type=${reportType}&startDate=${startDate}&endDate=${endDate}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('보고서 내보내기에 실패했습니다.');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${reportType}-report-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast('보고서가 성공적으로 내보내졌습니다.', 'success');
        }
        catch (error) {
            toast(error instanceof Error ? error.message : '보고서 내보내기에 실패했습니다.', 'error');
        }
    };
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-2xl font-bold", children: "\uBCF4\uACE0\uC11C" }), _jsx(Button, { onClick: handleExport, children: "\uB0B4\uBCF4\uB0B4\uAE30" })] }), _jsx("div", { className: "grid gap-6 mb-6", children: _jsxs("div", { className: "flex gap-4", children: [_jsxs(Select, { value: reportType, onValueChange: (value) => setReportType(value), children: [_jsx(SelectTrigger, { className: "w-[200px]", children: _jsx(SelectValue, { placeholder: "\uBCF4\uACE0\uC11C \uC720\uD615 \uC120\uD0DD" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "inventory", children: "\uC7AC\uACE0 \uBCF4\uACE0\uC11C" }), _jsx(SelectItem, { value: "movement", children: "\uC774\uB3D9 \uBCF4\uACE0\uC11C" })] })] }), _jsx(Input, { type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value), className: "w-[200px]" }), _jsx(Input, { type: "date", value: endDate, onChange: (e) => setEndDate(e.target.value), className: "w-[200px]" })] }) }), isLoading ? (_jsx("div", { children: "\uB85C\uB529 \uC911..." })) : reportType === 'inventory' ? (_jsxs("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "\uCD1D \uC81C\uD488 \uC218" }) }), _jsx(CardContent, { children: _jsxs("p", { className: "text-2xl font-bold", children: [reportData === null || reportData === void 0 ? void 0 : reportData.totalProducts.toLocaleString(), "\uAC1C"] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "\uBD80\uC871 \uC7AC\uACE0 \uC81C\uD488" }) }), _jsx(CardContent, { children: _jsxs("p", { className: "text-2xl font-bold", children: [reportData === null || reportData === void 0 ? void 0 : reportData.lowStockProducts.toLocaleString(), "\uAC1C"] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "\uCD1D \uC7AC\uACE0 \uAC00\uCE58" }) }), _jsx(CardContent, { children: _jsxs("p", { className: "text-2xl font-bold", children: [reportData === null || reportData === void 0 ? void 0 : reportData.totalValue.toLocaleString(), "\uC6D0"] }) })] }), _jsxs(Card, { className: "md:col-span-2 lg:col-span-3", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "\uCE74\uD14C\uACE0\uB9AC\uBCC4 \uBD84\uD3EC" }) }), _jsx(CardContent, { children: _jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: reportData === null || reportData === void 0 ? void 0 : reportData.categoryDistribution.map((item) => (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { children: item.category }), _jsxs("span", { className: "font-bold", children: [item.count.toLocaleString(), "\uAC1C"] })] }, item.category))) }) })] }), _jsxs(Card, { className: "md:col-span-2 lg:col-span-3", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "\uC704\uCE58\uBCC4 \uBD84\uD3EC" }) }), _jsx(CardContent, { children: _jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: reportData === null || reportData === void 0 ? void 0 : reportData.locationDistribution.map((item) => (_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { children: item.location }), _jsxs("span", { className: "font-bold", children: [item.count.toLocaleString(), "\uAC1C"] })] }, item.location))) }) })] })] })) : (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "\uCD5C\uADFC \uC774\uB3D9 \uB0B4\uC5ED" }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: reportData === null || reportData === void 0 ? void 0 : reportData.recentMovements.map((movement) => (_jsxs("div", { className: "flex justify-between items-center p-4 border rounded-lg", children: [_jsxs("div", { children: [_jsx("p", { className: "font-bold", children: movement.productName }), _jsx("p", { className: "text-sm text-gray-500", children: movement.type === 'adjust'
                                                    ? `재고 조정: ${movement.quantity}개`
                                                    : `위치 이동: ${movement.fromLocation} → ${movement.toLocation}` })] }), _jsx("p", { className: "text-sm text-gray-500", children: format(new Date(movement.timestamp), 'yyyy-MM-dd HH:mm') })] }, movement.id))) }) })] }))] }));
}
