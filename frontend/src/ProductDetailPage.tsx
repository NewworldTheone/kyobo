import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import apiClient from './services/authService';
import { useToastContext } from './ToastContext';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Loader2, Upload, MapPin, Image as ImageIcon, Save, Trash2 } from 'lucide-react';
import { Product } from './types/product';
import { ProductFormData, Coordinates, Layout, LocationHistory } from './types/detail';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToastContext();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  
  // 이미지 업로드 상태
  const [productImage, setProductImage] = useState<string | null>(null);
  const [locationImage, setLocationImage] = useState<string | null>(null);
  const [uploadingProductImage, setUploadingProductImage] = useState(false);
  const [uploadingLocationImage, setUploadingLocationImage] = useState(false);
  
  // 위치 정보 상태
  const [locationHistory, setLocationHistory] = useState<LocationHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates>({ x: 0, y: 0, layoutId: '' });
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<Layout | null>(null);
  
  // 제품 정보 상태
  const [formData, setFormData] = useState<ProductFormData>({
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
    try {
      const response = await apiClient.get('/api/locations/layouts');
      setLayouts(response.data.data);
    } catch (error: any) {
      console.error('레이아웃 목록 로드 오류:', error);
      // 404 오류인 경우 빈 배열로 설정하여 무한 루프 방지
      if (error.response?.status === 404) {
        setLayouts([]);
      }
    }
  }, []);

  // 특정 레이아웃 로드
  const fetchLayoutById = useCallback(async (layoutId: string) => {
    if (!layoutId) return;
    
    try {
      const response = await apiClient.get(`/api/locations/layouts/${layoutId}`);
      setSelectedLayout(response.data.data);
    } catch (error: any) {
      console.error('레이아웃 상세 로드 오류:', error);
      // 404 오류인 경우 선택된 레이아웃을 null로 설정
      if (error.response?.status === 404) {
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
      } catch (error) {
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'safetyStock' || name === 'price' 
        ? parseFloat(value) || 0
        : value
    }));
  };
  
  // 이미지 업로드 핸들러
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'location') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
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
      } else {
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
      } else {
        setLocationImage(`/api/uploads/locations/${imageUrl}`);
        setUploadingLocationImage(false);
      }
      
      toast('이미지가 성공적으로 업로드되었습니다.', 'success');
      
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      toast('이미지 업로드 중 오류가 발생했습니다.', 'error');
      
      if (type === 'product') {
        setUploadingProductImage(false);
      } else {
        setUploadingLocationImage(false);
      }
    }
  };
  
  // 이미지 삭제 핸들러
  const handleDeleteImage = async (type: 'product' | 'location') => {
    try {
      if (type === 'product') {
        setUploadingProductImage(true);
      } else {
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
      } else {
        setLocationImage(null);
        setUploadingLocationImage(false);
      }
      
      toast('이미지가 성공적으로 삭제되었습니다.', 'success');
      
    } catch (error) {
      console.error('이미지 삭제 오류:', error);
      toast('이미지 삭제 중 오류가 발생했습니다.', 'error');
      
      if (type === 'product') {
        setUploadingProductImage(false);
      } else {
        setUploadingLocationImage(false);
      }
    }
  };
  
  // 레이아웃 선택 핸들러
  const handleLayoutSelect = async (layoutId: string) => {
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
    } catch (error: any) {
      console.error('레이아웃 선택 오류:', error);
      if (error.response?.status === 404) {
        toast('선택한 레이아웃을 찾을 수 없습니다.', 'error');
      } else {
        toast('레이아웃을 선택하는 중 오류가 발생했습니다.', 'error');
      }
    }
  };
  
  // 좌표 선택 핸들러 (레이아웃 맵에서 클릭)
  const handleCoordinateSelect = (e: React.MouseEvent<HTMLDivElement>) => {
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
        productImage: product?.productImage,
        locationImage: product?.locationImage
      };
      
      await apiClient.put(`/api/products/${id}`, updatedProduct);
      
      // 제품 정보 다시 로드
      const response = await apiClient.get(`/api/products/${id}`);
      setProduct(response.data.data);
      
      toast('제품 정보가 성공적으로 저장되었습니다.', 'success');
      
    } catch (error) {
      console.error('제품 정보 저장 오류:', error);
      toast('제품 정보 저장 중 오류가 발생했습니다.', 'error');
    } finally {
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
      
    } catch (error) {
      console.error('위치 정보 업데이트 오류:', error);
      toast('위치 정보 업데이트 중 오류가 발생했습니다.', 'error');
    } finally {
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
    } catch (error) {
      console.error('위치 이력 조회 오류:', error);
      toast('위치 이력을 불러오는 중 오류가 발생했습니다.', 'error');
      setLoadingHistory(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">제품 정보를 불러오는 중...</span>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{formData.name}</h1>
        <div className="flex space-x-2">
          <Button onClick={() => navigate(-1)}>뒤로가기</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            저장
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="details">기본 정보</TabsTrigger>
          <TabsTrigger value="images">이미지</TabsTrigger>
          <TabsTrigger value="location">위치 관리</TabsTrigger>
        </TabsList>
        
        {/* 기본 정보 탭 */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>제품 기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">제품명</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  disabled
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">카테고리</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brand">브랜드</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">수량</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="safetyStock">안전 재고</Label>
                <Input
                  id="safetyStock"
                  name="safetyStock"
                  type="number"
                  value={formData.safetyStock}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">가격</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">위치</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">설명</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full h-32 px-3 py-2 border rounded-md"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                저장
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* 이미지 탭 */}
        <TabsContent value="images">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 제품 이미지 */}
            <Card>
              <CardHeader>
                <CardTitle>제품 이미지</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                {productImage ? (
                  <div className="relative w-full">
                    <img 
                      src={productImage} 
                      alt="제품 이미지" 
                      className="w-full h-64 object-contain border rounded-md"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleDeleteImage('product')}
                      disabled={uploadingProductImage}
                    >
                      {uploadingProductImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                ) : (
                  <div className="w-full h-64 border rounded-md flex flex-col items-center justify-center bg-gray-50">
                    <ImageIcon className="h-16 w-16 text-gray-300" />
                    <p className="text-gray-500 mt-2">제품 이미지 없음</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  <Label htmlFor="productImage" className="block mb-2">이미지 업로드</Label>
                  <Input id="productImage" type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'product')} />
                </div>
              </CardFooter>
            </Card>

            {/* 위치 이미지 */}
            <Card>
              <CardHeader>
                <CardTitle>위치 이미지</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                {locationImage ? (
                  <div className="relative w-full">
                    <img
                      src={locationImage}
                      alt="위치 이미지"
                      className="w-full h-64 object-contain border rounded-md"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleDeleteImage('location')}
                      disabled={uploadingLocationImage}
                    >
                      {uploadingLocationImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                ) : (
                  <div className="w-full h-64 border rounded-md flex flex-col items-center justify-center bg-gray-50">
                    <ImageIcon className="h-16 w-16 text-gray-300" />
                    <p className="text-gray-500 mt-2">위치 이미지 없음</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  <Label htmlFor="locationImage" className="block mb-2">이미지 업로드</Label>
                  <Input id="locationImage" type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'location')} />
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* 위치 관리 탭 */}
        <TabsContent value="location">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 레이아웃 선택 및 좌표 지정 */}
            <Card>
              <CardHeader>
                <CardTitle>위치 지정</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 레이아웃 선택 */}
                  <div className="space-y-2">
                    <Label htmlFor="layoutSelect">레이아웃 선택</Label>
                    <select
                      id="layoutSelect"
                      className="w-full p-2 border rounded-md"
                      value={coordinates.layoutId}
                      onChange={(e) => handleLayoutSelect(e.target.value)}
                    >
                      <option value="">레이아웃 선택</option>
                      {layouts.map((layout) => (
                        <option key={layout.id} value={layout.id}>
                          {layout.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* 좌표 선택 */}
                  <div className="space-y-2">
                    <Label>좌표 지정</Label>
                    <div className="flex space-x-4">
                      <div className="space-y-1 flex-1">
                        <Label htmlFor="xCoord">X 좌표</Label>
                        <Input
                          id="xCoord"
                          type="number"
                          value={coordinates.x}
                          onChange={(e) => setCoordinates(prev => ({ ...prev, x: parseInt(e.target.value) || 0 }))}
                          min="0"
                          max="100"
                        />
                      </div>
                      <div className="space-y-1 flex-1">
                        <Label htmlFor="yCoord">Y 좌표</Label>
                        <Input
                          id="yCoord"
                          type="number"
                          value={coordinates.y}
                          onChange={(e) => setCoordinates(prev => ({ ...prev, y: parseInt(e.target.value) || 0 }))}
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* 레이아웃 맵 표시 */}
                  <div className="mt-4">
                    <Label>레이아웃 맵 (클릭하여 위치 선택)</Label>
                    <div 
                      className="border rounded-md p-4 mt-2 bg-gray-50 h-64 flex items-center justify-center cursor-crosshair relative"
                      onClick={selectedLayout ? handleCoordinateSelect : undefined}
                    >
                      {selectedLayout ? (
                        <>
                          <div 
                            className="absolute w-4 h-4 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ left: `${coordinates.x}%`, top: `${coordinates.y}%` }}
                          />
                          <p className="absolute bottom-2 right-2 text-xs text-gray-500">
                            X: {coordinates.x}, Y: {coordinates.y}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-500">레이아웃을 선택하세요</p>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleLocationUpdate} 
                    disabled={saving || !coordinates.layoutId}
                    className="w-full mt-4"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MapPin className="h-4 w-4 mr-2" />}
                    위치 정보 저장
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* 위치 이력 */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>위치 이력</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchLocationHistory}
                  disabled={loadingHistory}
                >
                  {loadingHistory ? <Loader2 className="h-4 w-4 animate-spin" /> : "새로고침"}
                </Button>
              </CardHeader>
              <CardContent>
                {loadingHistory ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">이력을 불러오는 중...</span>
                  </div>
                ) : locationHistory.length > 0 ? (
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {locationHistory.map((history, index) => (
                      <div key={index} className="border rounded-md p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-500">위치: {history.newLocation}</p>
                          </div>
                          <p className="text-xs text-gray-400">{new Date(history.movedAt).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    위치 이력이 없습니다
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetailPage;