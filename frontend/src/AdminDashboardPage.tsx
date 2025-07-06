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

const withErrorHandling = (apiCall: () => Promise<any>, errorMessage: string, toast: Function) => {
  return async () => {
    try {
      return await apiCall();
    } catch (error) {
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
const FilterField = React.memo(({ label, type = 'text', name, value, onChange, placeholder, options, min, max }: {
  label: string;
  type?: string;
  name: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: string;
  max?: string;
}) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    {type === 'select' ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded"
      >
        {options?.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    ) : type === 'checkbox' ? (
      <div className="flex items-center">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={value}
          onChange={onChange}
          className="mr-2"
        />
        <label htmlFor={name}>{placeholder}</label>
      </div>
    ) : (
      <Input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
      />
    )}
  </div>
));

// 함수형 컴포넌트: 재사용 가능한 통계 카드
const StatCard = React.memo(({ title, value, formatter = (v: any) => v }: {
  title: string;
  value: any;
  formatter?: (value: any) => string;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold">{formatter(value)}</p>
    </CardContent>
  </Card>
));

// 함수형 컴포넌트: 재사용 가능한 데이터 테이블
const DataTable = React.memo(({ columns, data, loading, emptyMessage }: {
  columns: { key: string; label: string; render?: (value: any, row: any) => React.ReactNode }[];
  data: any[];
  loading: boolean;
  emptyMessage: string;
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">데이터를 불러오는 중...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return <p className="text-center text-gray-500 py-8">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {columns.map(column => (
              <th key={column.key} className="p-2 text-left">{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id || index} className="border-t">
              {columns.map(column => (
                <td key={column.key} className="p-2">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

// 함수형 컴포넌트: 재사용 가능한 필터 카드
const FilterCard = React.memo(({ title, children, onApply }: {
  title: string;
  children: React.ReactNode;
  onApply: () => void;
}) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {children}
    </CardContent>
    <CardFooter>
      <Button onClick={onApply}>필터 적용</Button>
    </CardFooter>
  </Card>
));

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
    return salesData.filter((sale: any) => {
      const saleDate = new Date(sale.saleDate);
      const startDate = salesFilter.startDate ? new Date(salesFilter.startDate) : null;
      const endDate = salesFilter.endDate ? new Date(salesFilter.endDate) : null;
      
      if (startDate && saleDate < startDate) return false;
      if (endDate && saleDate > endDate) return false;
      if (salesFilter.category && sale.product?.category !== salesFilter.category) return false;
      if (salesFilter.brand && sale.product?.brand !== salesFilter.brand) return false;
      
      return true;
    });
  }, [salesData, salesFilter]);

  // 메모이제이션된 통계 계산
  const memoizedSalesStats = useMemo(() => {
    return filteredSalesData.reduce((stats: any, sale: any) => {
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
  
  // 시스템 설정 상태
  interface Setting {
  value: any;
  type: string;
  description?: string;
}

const [settings, setSettings] = useState<Record<string, Setting>>({});
  const [newSetting, setNewSetting] = useState({
    key: '',
    value: '',
    type: 'string',
    description: ''
  });
  
  // 함수형 프로그래밍: 쿼리 파라미터 생성 함수
  const createQueryParams = useCallback((filters: Record<string, any>) => {
    return Object.entries(filters)
      .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      .reduce((params, [key, value]) => {
        params.append(key, value.toString());
        return params;
      }, new URLSearchParams());
  }, []);

  // 함수형 프로그래밍: 고차 함수를 이용한 데이터 페처 팩토리
  const createDataFetcher = useCallback((endpoint: string, setter: Function, processor?: (data: any) => any) => {
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
    return createDataFetcher(
      `/api/admin/sales?${queryParams.toString()}`,
      (data: any) => {
        setSalesData(data.records);
        setSalesStats(data.stats);
      }
    );
  }, [salesFilter, createQueryParams, createDataFetcher]);

  const fetchPredictions = useMemo(() => {
    const queryParams = createQueryParams({ days: predictionDays, category: predictionFilter.category });
    return createDataFetcher(
      `/api/admin/predictions?${queryParams.toString()}`,
      setPredictions,
      (data: any) => predictionFilter.needsReorder ? data.filter((item: any) => item.needsReorder) : data
    );
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
    const fetcher = tabDataFetchers[activeTab as keyof typeof tabDataFetchers];
    if (fetcher) {
      fetcher().catch(() => {
        // 오류는 withErrorHandling에서 이미 처리되므로 여기서는 무시
      });
    }
  }, [activeTab, tabDataFetchers]);
  
  // 함수형 프로그래밍: 고차 함수를 이용한 필터 변경 핸들러 팩토리
  const createFilterHandler = useCallback((setter: Function) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;
      
      setter((prev: any) => ({
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
    number: (value: string) => parseFloat(value),
    boolean: (value: string) => value === 'true',
    json: (value: string) => {
      try {
        return JSON.parse(value);
      } catch (e) {
        throw new Error('JSON 형식이 올바르지 않습니다.');
      }
    },
    string: (value: string) => value
  }), []);

  // 함수형 프로그래밍: 설정 변경 핸들러
  const handleSettingChange = useCallback((key: string, value: string) => {
    const setting = settings[key] as Setting;
    if (!setting) return;

    try {
      const converter = valueConverters[setting.type as keyof typeof valueConverters];
      const processedValue = converter ? converter(value) : value;
      updateSetting(key, processedValue, setting.type, setting.description || '');
    } catch (error) {
      toast((error as Error).message, 'error');
    }
  }, [settings, valueConverters, toast]);
  
  // 설정 업데이트/생성
  const updateSetting = async (key: string, value: any, type: string, description: string) => {
    try {
      const response = await apiClient.put(`/api/admin/settings/${key}`, {
        value,
        type,
        description
      });
      
      // 설정 목록 새로고침
      fetchSettings();
      
      toast('설정이 성공적으로 업데이트되었습니다.', 'success');
    } catch (error) {
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
        } catch (e) {
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
    } catch (error) {
      console.error('설정 생성 오류:', error);
      toast('설정을 생성하는 중 오류가 발생했습니다.', 'error');
    }
  };
  
  // 설정 삭제
  const deleteSetting = async (key: string) => {
    try {
      const response = await apiClient.delete(`/api/admin/settings/${key}`);
      
      // 설정 목록 새로고침
      fetchSettings();
      
      toast('설정이 성공적으로 삭제되었습니다.', 'success');
    } catch (error) {
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
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">관리자 대시보드</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="sales">
            <BarChart className="h-4 w-4 mr-2" />
            판매 데이터
          </TabsTrigger>
          <TabsTrigger value="predictions">
            <Map className="h-4 w-4 mr-2" />
            재고 예측
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            시스템 설정
          </TabsTrigger>
        </TabsList>
        
        {/* 판매 데이터 탭 */}
        <TabsContent value="sales">
          <FilterCard title="판매 데이터 필터" onApply={applySalesFilter}>
            <FilterField
              label="시작일"
              type="date"
              name="startDate"
              value={salesFilter.startDate}
              onChange={handleSalesFilterChange}
            />
            <FilterField
              label="종료일"
              type="date"
              name="endDate"
              value={salesFilter.endDate}
              onChange={handleSalesFilterChange}
            />
            <FilterField
              label="카테고리"
              name="category"
              value={salesFilter.category}
              onChange={handleSalesFilterChange}
              placeholder="카테고리"
            />
            <FilterField
              label="브랜드"
              name="brand"
              value={salesFilter.brand}
              onChange={handleSalesFilterChange}
              placeholder="브랜드"
            />
          </FilterCard>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[
              { title: '총 판매액', value: memoizedSalesStats.totalSales, formatter: (v: number) => `${v.toLocaleString()}원` },
              { title: '총 판매 수량', value: memoizedSalesStats.totalQuantity, formatter: (v: number) => `${v.toLocaleString()}개` },
              { title: '판매 기록 수', value: memoizedSalesStats.recordCount, formatter: (v: number) => `${v.toLocaleString()}건` }
            ].map(stat => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>판매 기록</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={[
                  { key: 'saleDate', label: '날짜', render: (value) => new Date(value).toLocaleDateString() },
                  { key: 'product', label: '제품명', render: (value) => value.name },
                  { key: 'product', label: '카테고리', render: (value) => value.category },
                  { key: 'quantity', label: '수량' },
                  { key: 'amount', label: '금액', render: (value) => `${value.toLocaleString()}원` },
                  { key: 'user', label: '담당자', render: (value) => value.name }
                ]}
                data={filteredSalesData}
                loading={loading}
                emptyMessage="판매 기록이 없습니다."
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 재고 예측 탭 */}
        <TabsContent value="predictions">
          <FilterCard title="재고 예측 설정" onApply={applyPredictionFilter}>
            <div>
              <label className="block text-sm font-medium mb-1">예측 기간 (일)</label>
              <Input
                type="number"
                value={predictionDays}
                onChange={(e) => setPredictionDays(parseInt(e.target.value))}
                min="1"
                max="365"
              />
            </div>
            <FilterField
              label="카테고리"
              name="category"
              value={predictionFilter.category}
              onChange={handlePredictionFilterChange}
              placeholder="카테고리"
            />
            <FilterField
              label="재주문 필요 항목만 표시"
              type="checkbox"
              name="needsReorder"
              value={predictionFilter.needsReorder}
              onChange={handlePredictionFilterChange}
              placeholder="재주문 필요 항목만 표시"
            />
          </FilterCard>
          
          <Card>
            <CardHeader>
              <CardTitle>재고 예측 결과</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={[
                  { key: 'productName', label: '제품명' },
                  { key: 'category', label: '카테고리' },
                  { key: 'currentStock', label: '현재 재고' },
                  { key: 'predictedDemand', label: '예상 수요' },
                  { key: 'suggestedOrderQuantity', label: '권장 주문량' },
                  { 
                    key: 'needsReorder', 
                    label: '재주문 필요',
                    render: (value) => (
                      <span className={`px-2 py-1 rounded text-sm ${
                        value 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {value ? '필요' : '불필요'}
                      </span>
                    )
                  }
                ]}
                data={predictions}
                loading={loading}
                emptyMessage="예측 결과가 없습니다."
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 시스템 설정 탭 */}
        <TabsContent value="settings">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>새 설정 추가</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { key: 'key', label: '키', placeholder: '설정 키' },
                { key: 'value', label: '값', placeholder: '설정 값' },
                { key: 'description', label: '설명', placeholder: '설정 설명' }
              ].map(field => (
                <FilterField
                  key={field.key}
                  label={field.label}
                  name={field.key}
                  value={newSetting[field.key as keyof typeof newSetting]}
                  onChange={handleNewSettingChange}
                  placeholder={field.placeholder}
                />
              ))}
              <FilterField
                label="타입"
                type="select"
                name="type"
                value={newSetting.type}
                onChange={handleNewSettingChange}
                options={[
                  { value: 'string', label: '문자열' },
                  { value: 'number', label: '숫자' },
                  { value: 'boolean', label: '불린' },
                  { value: 'json', label: 'JSON' }
                ]}
              />
            </CardContent>
            <CardFooter>
              <Button onClick={createSetting}>설정 추가</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>시스템 설정</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">데이터를 불러오는 중...</span>
                </div>
              ) : Object.keys(settings).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(settings).map(([key, setting]) => (
                    <div key={key} className="border p-4 rounded">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div>
                          <label className="block text-sm font-medium mb-1">키</label>
                          <p className="text-sm text-gray-600">{key}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">값</label>
                          {setting.type === 'boolean' ? (
                            <select
                              value={setting.value}
                              onChange={(e) => handleSettingChange(key, e.target.value)}
                              className="w-full p-2 border rounded"
                            >
                              <option value="true">true</option>
                              <option value="false">false</option>
                            </select>
                          ) : setting.type === 'json' ? (
                            <textarea
                              value={typeof setting.value === 'object' ? JSON.stringify(setting.value, null, 2) : setting.value}
                              onChange={(e) => handleSettingChange(key, e.target.value)}
                              className="w-full p-2 border rounded"
                              rows={3}
                            />
                          ) : (
                            <Input
                              type={setting.type === 'number' ? 'number' : 'text'}
                              value={setting.value}
                              onChange={(e) => handleSettingChange(key, e.target.value)}
                            />
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">타입</label>
                          <p className="text-sm text-gray-600">{setting.type}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">설명</label>
                          <p className="text-sm text-gray-600">{setting.description || '설명 없음'}</p>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteSetting(key)}
                            className="mt-2"
                          >
                            삭제
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">설정이 없습니다.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
});

export default AdminDashboardPage;
