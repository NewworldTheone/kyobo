import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from './services/productService';
import { offlineService } from './services/offlineService';
import { useToastContext } from './ToastContext';
import { ArrowLeft, Save, AlertTriangle, Plus, Minus } from 'lucide-react';

const ProductAdjustInventoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToastContext();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const queryClient = useQueryClient();
  
  const [quantity, setQuantity] = useState<number>(0);
  const [memo, setMemo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id!),
    enabled: !!id
  });
  
  const adjustMutation = useMutation({
    mutationFn: (data: { productId: string; quantity: number; memo: string }) =>
        productService.adjustInventory(data.productId, data.quantity, data.memo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      toast('제품 재고가 성공적으로 조정되었습니다.', 'success');
      navigate(`/products/${id}`);
    },
    onError: (error) => {
      console.error('재고 조정 오류:', error);
      toast('제품 재고를 조정하는 중 오류가 발생했습니다.', 'error');
      setIsSubmitting(false);
    }
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || quantity === 0) return;
    
    setIsSubmitting(true);
    
    if (isOnline) {
      // 온라인 모드: 직접 API 호출
      adjustMutation.mutate({ productId: id, quantity, memo });
    } else {
      // 오프라인 모드: IndexedDB에 저장
      try {
        await offlineService.queueInventoryAdjustment(id, quantity, memo);
        toast('오프라인 상태입니다. 온라인 연결 시 자동으로 동기화됩니다.', 'info');
        navigate(`/products/${id}`);
      } catch (error) {
        console.error('오프라인 재고 조정 오류:', error);
        toast('오프라인 작업을 저장하는 중 오류가 발생했습니다.', 'error');
        setIsSubmitting(false);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="loading-spinner">
        <div className="loading-spinner-icon"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="alert alert-error mb-6">
        <div className="alert-content">
          <div className="alert-icon">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="alert-content">
            <p className="alert-message">
              제품 정보를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-main">
      <div className="page-header">
        <button
          onClick={() => navigate(-1)}
          className="btn-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="page-title">재고 조정</h1>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{product.name}</h2>
          <p className="card-subtitle">SKU: {product.sku}</p>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-form">
            <div>
              <label htmlFor="currentQuantity" className="form-label">
                현재 재고
              </label>
              <input
                type="text"
                id="currentQuantity"
                value={product.quantity}
                disabled
                className="form-input-disabled"
              />
            </div>
            
            <div>
              <label htmlFor="adjustmentType" className="form-label">
                조정 유형
              </label>
              <div className="inventory-adjust-type-options">
                <div className="inventory-adjust-type-option">
                  <input
                    id="adjustmentTypeIn"
                    name="adjustmentType"
                    type="radio"
                    checked={quantity > 0}
                    onChange={() => setQuantity(Math.abs(quantity) || 1)}
                    className="form-radio"
                  />
                  <label htmlFor="adjustmentTypeIn" className="form-radio-label">
                    <Plus className="text-icon-sm text-green-500" />
                    입고
                  </label>
                </div>
                <div className="inventory-adjust-type-option">
                  <input
                    id="adjustmentTypeOut"
                    name="adjustmentType"
                    type="radio"
                    checked={quantity < 0}
                    onChange={() => setQuantity(quantity === 0 ? -1 : -Math.abs(quantity))}
                    className="form-radio"
                  />
                  <label htmlFor="adjustmentTypeOut" className="form-radio-label">
                    <Minus className="text-icon-sm text-red-500" />
                    출고
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="quantity" className="form-label">
                수량
              </label>
              <input
                type="number"
                id="quantity"
                value={Math.abs(quantity)}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setQuantity(quantity < 0 ? -value : value);
                }}
                min="1"
                required
                className="form-input"
              />
            </div>
            
            <div>
              <label htmlFor="memo" className="form-label">
                메모
              </label>
              <textarea
                id="memo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                rows={3}
                className="form-textarea"
                placeholder="조정 사유 또는 참고 사항"
              />
            </div>
            
            {!isOnline && (
              <div className="inventory-adjust-offline-notice">
                <div className="inventory-adjust-offline-content">
                  <div className="inventory-adjust-offline-icon">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="inventory-adjust-offline-text">
                    <h3 className="inventory-adjust-offline-title">오프라인 모드</h3>
                    <div className="inventory-adjust-offline-message">
                      <p>
                        현재 오프라인 상태입니다. 재고 조정 작업은 저장되며, 온라인 연결 시 자동으로 동기화됩니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-buttons">
              <button
                type="button"
                onClick={() => navigate(`/products/${id}`)}
                className="btn-secondary"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting || quantity === 0}
                className="btn-primary"
              >
                <Save className="text-icon" />
                {isSubmitting ? '처리 중...' : '재고 조정'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductAdjustInventoryPage;
