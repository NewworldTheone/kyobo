import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToastContext } from './ToastContext';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Input } from './components/ui/input';
import { format } from 'date-fns';

interface ReportData {
  totalProducts: number;
  lowStockProducts: number;
  totalValue: number;
  categoryDistribution: { category: string; count: number }[];
  locationDistribution: { location: string; count: number }[];
  recentMovements: {
    id: string;
    productName: string;
    type: 'adjust' | 'move';
    quantity?: number;
    fromLocation?: string;
    toLocation?: string;
    timestamp: string;
  }[];
}

export default function ReportsPage() {
  const { toast } = useToastContext();
  const [reportType, setReportType] = useState<'inventory' | 'movement'>('inventory');
  const [startDate, setStartDate] = useState(format(new Date().setDate(new Date().getDate() - 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const { data: reportData, isLoading } = useQuery<ReportData, Error>({
    queryKey: ['reports', reportType, startDate, endDate],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/reports?type=${reportType}&startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error('보고서를 불러오는데 실패했습니다.');
      }
      return response.json();
    },
  });

  const handleExport = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/reports/export?type=${reportType}&startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
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
    } catch (error) {
      toast(error instanceof Error ? error.message : '보고서 내보내기에 실패했습니다.', 'error');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">보고서</h1>
        <Button onClick={handleExport}>내보내기</Button>
      </div>

      <div className="grid gap-6 mb-6">
        <div className="flex gap-4">
          <Select value={reportType} onValueChange={(value: 'inventory' | 'movement') => setReportType(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="보고서 유형 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inventory">재고 보고서</SelectItem>
              <SelectItem value="movement">이동 보고서</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-[200px]"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-[200px]"
          />
        </div>
      </div>

      {isLoading ? (
        <div>로딩 중...</div>
      ) : reportType === 'inventory' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>총 제품 수</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{reportData?.totalProducts.toLocaleString()}개</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>부족 재고 제품</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{reportData?.lowStockProducts.toLocaleString()}개</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>총 재고 가치</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{reportData?.totalValue.toLocaleString()}원</p>
            </CardContent>
          </Card>
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>카테고리별 분포</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reportData?.categoryDistribution.map((item) => (
                  <div key={item.category} className="flex justify-between items-center">
                    <span>{item.category}</span>
                    <span className="font-bold">{item.count.toLocaleString()}개</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>위치별 분포</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reportData?.locationDistribution.map((item) => (
                  <div key={item.location} className="flex justify-between items-center">
                    <span>{item.location}</span>
                    <span className="font-bold">{item.count.toLocaleString()}개</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>최근 이동 내역</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData?.recentMovements.map((movement) => (
                <div key={movement.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-bold">{movement.productName}</p>
                    <p className="text-sm text-gray-500">
                      {movement.type === 'adjust'
                        ? `재고 조정: ${movement.quantity}개`
                        : `위치 이동: ${movement.fromLocation} → ${movement.toLocation}`}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">{format(new Date(movement.timestamp), 'yyyy-MM-dd HH:mm')}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
