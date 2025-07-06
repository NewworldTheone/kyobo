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
import { ProductFormData } from './types/form';

const ProductNewPage = () => {
  const navigate = useNavigate();
  const { toast } = useToastContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isCategorizingProduct, setIsCategorizingProduct] = useState(false);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{ x: number; y: number; layoutId: string } | null>(null);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<ProductFormData>();
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
    } catch (error) {
      console.error('AI 설명 생성 오류:', error);
      toast('AI 설명 생성에 실패했습니다.', 'error');
    } finally {
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
    } catch (error) {
      console.error('AI 카테고리 분류 오류:', error);
      toast('AI 카테고리 분류에 실패했습니다.', 'error');
    } finally {
      setIsCategorizingProduct(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
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
    } catch (error) {
      console.error('제품 등록 오류:', error);
      toast('제품을 등록하는 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">신규 제품 등록</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>제품 정보 입력</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">제품명 *</Label>
                <Input
                  id="name"
                  {...register('name', { required: '제품명을 입력해주세요' })}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message as string}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  {...register('sku', { required: 'SKU를 입력해주세요' })}
                />
                {errors.sku && (
                  <p className="text-sm text-red-600">{errors.sku.message as string}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="category">카테고리 *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={categorizeProduct}
                    disabled={isCategorizingProduct || !watchedFields[0]}
                    className="text-xs"
                  >
                    {isCategorizingProduct ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <Wand2 className="h-3 w-3 mr-1" />
                    )}
                    AI 분류
                  </Button>
                </div>
                <Input
                  id="category"
                  {...register('category', { required: '카테고리를 입력해주세요' })}
                />
                {errors.category && (
                  <p className="text-sm text-red-600">{errors.category.message as string}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brand">브랜드 *</Label>
                <Input
                  id="brand"
                  {...register('brand', { required: '브랜드를 입력해주세요' })}
                />
                {errors.brand && (
                  <p className="text-sm text-red-600">{errors.brand.message as string}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">위치 *</Label>
                <Input
                  id="location"
                  {...register('location', { required: '위치를 입력해주세요' })}
                />
                {errors.location && (
                  <p className="text-sm text-red-600">{errors.location.message as string}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">수량 *</Label>
                <Input
                  id="quantity"
                  type="number"
                  {...register('quantity', { 
                    required: '수량을 입력해주세요',
                    min: { value: 0, message: '수량은 0 이상이어야 합니다' }
                  })}
                />
                {errors.quantity && (
                  <p className="text-sm text-red-600">{errors.quantity.message as string}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="safetyStock">안전 재고 *</Label>
                <Input
                  id="safetyStock"
                  type="number"
                  {...register('safetyStock', { 
                    required: '안전 재고를 입력해주세요',
                    min: { value: 0, message: '안전 재고는 0 이상이어야 합니다' }
                  })}
                />
                {errors.safetyStock && (
                  <p className="text-sm text-red-600">{errors.safetyStock.message as string}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">단가 *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register('price', { 
                    required: '단가를 입력해주세요',
                    min: { value: 0, message: '단가는 0 이상이어야 합니다' }
                  })}
                />
                {errors.price && (
                  <p className="text-sm text-red-600">{errors.price.message as string}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">제품 설명</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateDescription}
                  disabled={isGeneratingDescription || !watchedFields[0] || !watchedFields[1] || !watchedFields[2]}
                  className="text-xs"
                >
                  {isGeneratingDescription ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Sparkles className="h-3 w-3 mr-1" />
                  )}
                  AI 생성
                </Button>
              </div>
              <textarea
                id="description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-kyobo focus:border-transparent"
                placeholder="제품에 대한 상세 설명을 입력하세요..."
                {...register('description')}
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⌛</span>
                    저장 중...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    저장
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductNewPage;