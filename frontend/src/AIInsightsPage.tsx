import React, { useState, useEffect } from 'react';
import { productService } from './services/productService';
import { aiService } from './services/aiService';
import { useToastContext } from './ToastContext';
import { Brain, TrendingUp, Package, Loader2, RefreshCw } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

const AIInsightsPage = () => {
  const { toast } = useToastContext();
  const [products, setProducts] = useState<any[]>([]);
  const [inventoryAnalysis, setInventoryAnalysis] = useState<string>('');
  const [salesAnalysis, setSalesAnalysis] = useState<string>('');
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
    } catch (error) {
      console.error('제품 데이터 로드 오류:', error);
      toast('제품 데이터를 불러오는데 실패했습니다.', 'error');
    } finally {
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
    } catch (error) {
      console.error('재고 분석 오류:', error);
      toast('재고 분석에 실패했습니다.', 'error');
    } finally {
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
    } catch (error) {
      console.error('판매 분석 오류:', error);
      toast('판매 분석에 실패했습니다.', 'error');
    } finally {
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

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center mb-6">
        <Brain className="h-6 w-6 mr-3 text-kyobo" />
        <h1 className="text-2xl font-bold text-gray-900">AI 인사이트</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={loadProducts}
          disabled={isLoadingProducts}
          className="ml-auto"
        >
          {isLoadingProducts ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          새로고침
        </Button>
      </div>

      {/* 재고 현황 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">전체 제품</p>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-red-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">부족 재고</p>
                <p className="text-2xl font-bold text-red-600">{stats.lowStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-orange-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">과다 재고</p>
                <p className="text-2xl font-bold text-orange-600">{stats.overStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">총 재고 가치</p>
                <p className="text-2xl font-bold text-green-600">
                  ₩{stats.totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 재고 최적화 분석 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                재고 최적화 분석
              </CardTitle>
              <Button
                onClick={generateInventoryAnalysis}
                disabled={isLoadingInventory || products.length === 0}
                size="sm"
              >
                {isLoadingInventory ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Brain className="h-4 w-4 mr-2" />
                )}
                AI 분석
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {inventoryAnalysis ? (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-gray-700">
                  {inventoryAnalysis}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>AI 분석 버튼을 클릭하여 재고 최적화 제안을 받아보세요.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 판매 분석 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                판매 예측 분석
              </CardTitle>
              <Button
                onClick={generateSalesAnalysis}
                disabled={isLoadingSales || products.length === 0}
                size="sm"
              >
                {isLoadingSales ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Brain className="h-4 w-4 mr-2" />
                )}
                AI 분석
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {salesAnalysis ? (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-gray-700">
                  {salesAnalysis}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>AI 분석 버튼을 클릭하여 판매 예측과 인사이트를 받아보세요.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI 기능 안내 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            AI 기능 안내
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Package className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold mb-2">재고 최적화</h3>
              <p className="text-sm text-gray-600">
                현재 재고 상황을 분석하여 최적화 방안을 제안합니다.
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold mb-2">판매 예측</h3>
              <p className="text-sm text-gray-600">
                과거 데이터를 바탕으로 미래 판매를 예측하고 분석합니다.
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Brain className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <h3 className="font-semibold mb-2">스마트 제안</h3>
              <p className="text-sm text-gray-600">
                AI가 비즈니스 성장을 위한 실행 가능한 제안을 제공합니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsightsPage;