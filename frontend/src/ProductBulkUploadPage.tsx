import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { productService } from './services/productService';
import { useToastContext } from './ToastContext';
import { ArrowLeft, Upload, FileUp, AlertTriangle, CheckCircle, Download } from 'lucide-react';
import { FileUploadFormData } from './types/form';

const ProductBulkUploadPage = () => {
  const navigate = useNavigate();
  const { toast } = useToastContext();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    successCount: number;
    errorCount: number;
    errors?: string[];
  } | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<FileUploadFormData>();
  
  // 선택된 파일 감시
  const watchedFile = watch('file');
  const selectedFileName = watchedFile && watchedFile.length > 0 ? watchedFile[0].name : null;
  
  // 샘플 CSV 다운로드
  const downloadSampleCSV = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/products/sample-csv`);
      
      if (!response.ok) {
        throw new Error('샘플 파일 다운로드에 실패했습니다.');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'sample_products.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast('샘플 CSV 파일이 다운로드되었습니다.', 'success');
    } catch (error) {
      console.error('샘플 CSV 다운로드 오류:', error);
      toast('샘플 파일 다운로드에 실패했습니다.', 'error');
    }
  };
  
  // CSV 파일 내용 검증 및 자동 수정
  const validateAndFixCSV = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          let content = e.target?.result as string;
          
          // BOM 제거
          if (content.charCodeAt(0) === 0xFEFF) {
            content = content.slice(1);
          }
          
          const lines = content.split('\n').filter(line => line.trim());
          
          if (lines.length === 0) {
            reject(new Error('파일이 비어있습니다.'));
            return;
          }
          
          // 헤더 검증 및 수정
          const expectedHeaders = ['name', 'sku', 'category', 'brand', 'location', 'quantity', 'safetyStock', 'price', 'description'];
          const firstLine = lines[0].toLowerCase().replace(/\s/g, '');
          
          let headers: string[];
          if (!expectedHeaders.every(header => firstLine.includes(header.toLowerCase()))) {
            // 헤더가 없거나 잘못된 경우 자동으로 추가
            headers = expectedHeaders;
            lines.unshift(headers.join(','));
          } else {
            headers = lines[0].split(',').map(h => h.trim());
          }
          
          // 데이터 행 검증
          const dataLines = lines.slice(1);
          const fixedLines = [headers.join(',')];
          
          for (let i = 0; i < dataLines.length; i++) {
            const line = dataLines[i];
            const values = line.split(',').map(v => v.trim());
            
            // 필수 필드 개수 맞추기
            while (values.length < expectedHeaders.length) {
              values.push('');
            }
            
            // 숫자 필드 검증 (quantity, safetyStock, price)
            const quantityIndex = 5;
            const safetyStockIndex = 6;
            const priceIndex = 7;
            
            if (values[quantityIndex] && isNaN(Number(values[quantityIndex]))) {
              values[quantityIndex] = '0';
            }
            if (values[safetyStockIndex] && isNaN(Number(values[safetyStockIndex]))) {
              values[safetyStockIndex] = '0';
            }
            if (values[priceIndex] && isNaN(Number(values[priceIndex]))) {
              values[priceIndex] = '0';
            }
            
            fixedLines.push(values.join(','));
          }
          
          // 수정된 내용으로 새 파일 생성
          const fixedContent = fixedLines.join('\n');
          const blob = new Blob([fixedContent], { type: 'text/csv;charset=utf-8;' });
          const fixedFile = new File([blob], file.name, { type: 'text/csv' });
          
          resolve(fixedFile);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
      reader.readAsText(file, 'utf-8');
    });
  };
  
  const onSubmit = async (data: FileUploadFormData) => {
    if (!data.file || data.file.length === 0) {
      toast('파일을 선택해주세요.', 'error');
      return;
    }
    
    const file = data.file[0];
    
    // 파일 타입 검증
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/csv'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(file.type) && fileExtension !== 'csv') {
      toast('CSV 파일만 업로드 가능합니다.', 'error');
      return;
    }
    
    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast('파일 크기는 10MB를 초과할 수 없습니다.', 'error');
      return;
    }
    
    setIsUploading(true);
    setUploadResult(null); // 이전 결과 초기화
    
    try {
      // 파일 자동 검증 및 수정
      let processedFile = file;
      try {
        processedFile = await validateAndFixCSV(file);
        if (processedFile !== file) {
          toast('파일 형식이 자동으로 수정되었습니다.', 'info');
        }
      } catch (validationError) {
        console.warn('파일 자동 수정 실패:', validationError);
        // 자동 수정에 실패해도 원본 파일로 계속 진행
      }
      
      const result = await productService.bulkUpload(processedFile);
      
      setUploadResult({
        successCount: result.success || 0,
        errorCount: result.failed || 0,
        errors: result.errors || []
      });

      if (result.success > 0) {
        toast(`${result.success}개의 제품이 성공적으로 업로드되었습니다.`, 'success');
      }
      if (result.failed > 0) {
        toast(`${result.failed}개의 제품 업로드에 실패했습니다.`, 'error');
      }
      
      // 성공 시 폼 리셋
      if (result.success > 0 && result.failed === 0) {
        reset();
      }
    } catch (error: any) {
      console.error('대량 업로드 오류:', error);
      
      // 에러 응답 처리
      if (error.response?.data?.error) {
        toast(error.response.data.error, 'error');
        
        // 상세 에러 정보가 있는 경우
        if (error.response.data.details) {
          setUploadResult({
            successCount: 0,
            errorCount: 1,
            errors: Array.isArray(error.response.data.details) 
              ? error.response.data.details 
              : [error.response.data.details]
          });
        }
      } else if (error.response?.status === 413) {
        toast('파일 크기가 너무 큽니다.', 'error');
      } else if (error.response?.status === 415) {
        toast('지원하지 않는 파일 형식입니다.', 'error');
      } else {
        toast('파일을 업로드하는 중 오류가 발생했습니다.', 'error');
      }
    } finally {
      setIsUploading(false);
    }
  };
  
  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'csv') {
        // react-hook-form의 setValue를 사용하여 파일 설정
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        
        // 폼 이벤트 트리거
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
      } else {
        toast('CSV 파일만 업로드 가능합니다.', 'error');
      }
    }
  };
  
  return (
    <div className="container-main">
      <div className="page-header">
        <button
          onClick={() => navigate(-1)}
          className="btn-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="page-title">대량 업로드</h1>
      </div>
      
      <div className="card">
        <div className="card-header flex items-center">
          <FileUp className="text-icon text-kyobo" />
          <h2 className="card-title">CSV 파일 업로드</h2>
        </div>
        
        <div className="card-body">
          {/* 샘플 CSV 다운로드 버튼 */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-1">샘플 CSV 파일</h3>
                <p className="text-sm text-blue-700">올바른 형식의 샘플 파일을 다운로드하여 참고하세요.</p>
              </div>
              <button
                type="button"
                onClick={downloadSampleCSV}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                샘플 다운로드
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-form">
            <div>
              <label className="form-label">
                CSV 파일 선택
              </label>
              <div 
                className="file-upload-area"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="file-upload-content">
                  <Upload className="file-upload-icon" />
                  <div className="file-upload-text">
                    <label
                      htmlFor="file-upload"
                      className="file-upload-label"
                    >
                      <span>파일 선택</span>
                      <input
                        id="file-upload"
                        type="file"
                        className="file-upload-input"
                        accept=".csv,text/csv,application/csv,application/vnd.ms-excel"
                        {...register('file', { 
                          required: '파일을 선택해주세요',
                          validate: {
                            isCSV: (files) => {
                              if (!files || files.length === 0) return true;
                              const file = files[0];
                              const fileExtension = file.name.split('.').pop()?.toLowerCase();
                              return fileExtension === 'csv' || 'CSV 파일만 업로드 가능합니다.';
                            },
                            size: (files) => {
                              if (!files || files.length === 0) return true;
                              const file = files[0];
                              return file.size <= 10 * 1024 * 1024 || '파일 크기는 10MB를 초과할 수 없습니다.';
                            }
                          }
                        })}
                      />
                    </label>
                    <p className="pl-1">또는 여기에 파일을 끌어다 놓으세요</p>
                  </div>
                  {selectedFileName && (
                    <p className="mt-2 text-sm text-gray-600">
                      선택된 파일: {selectedFileName}
                    </p>
                  )}
                  <p className="file-upload-hint">
                    CSV 파일만 업로드 가능합니다. 최대 10MB
                  </p>
                </div>
              </div>
              {errors.file && (
                <p className="form-error">{errors.file.message}</p>
              )}
            </div>
            
            <div className="info-box">
              <h3 className="info-box-title">CSV 파일 형식</h3>
              <div className="info-box-content">
                <p>다음 열을 포함해야 합니다:</p>
                <ul className="info-box-list">
                  <li><strong>sku</strong> (필수): 제품 고유 코드</li>
                  <li><strong>name</strong> (필수): 제품명</li>
                  <li><strong>category</strong> (필수): 카테고리</li>
                  <li><strong>brand</strong> (필수): 브랜드</li>
                  <li><strong>location</strong> (필수): 위치</li>
                  <li><strong>quantity</strong> (필수): 수량 (숫자)</li>
                  <li><strong>safetyStock</strong> (필수): 안전 재고 (숫자)</li>
                  <li><strong>price</strong> (필수): 단가 (숫자)</li>
                  <li><strong>description</strong> (선택): 제품 설명</li>
                </ul>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800 font-medium">주의사항:</p>
                  <ul className="mt-1 text-sm text-yellow-700 list-disc list-inside">
                    <li>첫 번째 행은 반드시 헤더(컬럼명)여야 합니다.</li>
                    <li>SKU는 중복될 수 없습니다.</li>
                    <li>수량, 안전재고, 가격은 숫자 형식이어야 합니다.</li>
                    <li>UTF-8 인코딩을 사용해주세요.</li>
                  </ul>
                </div>
                <p className="mt-3">
                  <a
                    href="/api/products/sample-csv"
                    download="products_sample.csv"
                    className="info-box-link"
                  >
                    샘플 CSV 파일 다운로드
                  </a>
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-buttons">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary"
                disabled={isUploading}
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isUploading || !watchedFile || watchedFile.length === 0}
                className="btn-primary"
              >
                {isUploading ? '업로드 중...' : '업로드'}
              </button>
            </div>
          </form>
          
          {uploadResult && (
            <div className={`result-display ${
              uploadResult.errorCount > 0 ? 'result-display-error' : 'result-display-success'
            }`}>
              <div className="result-display-content">
                <div className="result-display-icon">
                  {uploadResult.errorCount > 0 ? (
                    <AlertTriangle className="text-icon text-red-400" />
                  ) : (
                    <CheckCircle className="text-icon text-green-400" />
                  )}
                </div>
                <div className="result-display-body">
                  <h3 className={`result-display-title ${
                    uploadResult.errorCount > 0 ? 'text-red-800' : 'text-green-800'
                  }`}>
                    업로드 결과
                  </h3>
                  <div className={`result-display-details ${
                    uploadResult.errorCount > 0 ? 'text-red-700' : 'text-green-700'
                  }`}>
                    <p>성공: {uploadResult.successCount}건</p>
                    {uploadResult.errorCount > 0 && (
                      <p>실패: {uploadResult.errorCount}건</p>
                    )}
                    
                    {uploadResult.errors && uploadResult.errors.length > 0 && (
                      <div className="result-display-errors">
                        <p className="result-display-errors-title">오류 내역:</p>
                        <ul className="result-display-errors-list">
                          {uploadResult.errors.slice(0, 10).map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                          {uploadResult.errors.length > 10 && (
                            <li className="text-sm italic">
                              ... 그 외 {uploadResult.errors.length - 10}개의 오류
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {uploadResult.successCount > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <button
                        onClick={() => navigate('/products')}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        제품 목록으로 이동 →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductBulkUploadPage;