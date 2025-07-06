import apiClient from './authService';
import { Product, ProductFilter, InventoryAdjustment, LocationHistory } from './types/product';

export interface BulkUploadResult {
  success: number;
  failed: number;
  errors?: string[];
}

interface ApiResponse<T> {
  status: string;
  data: T;
  message?: string;
}

interface BulkUploadResponse {
  status: string;
  data?: BulkUploadResult;
  message?: string;
  error?: string;
}

export const productService = {
  // 모든 제품 조회
  async getProducts(filters?: ProductFilter): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.brand) params.append('brand', filters.brand);
      if (filters?.location) params.append('location', filters.location);
      if (filters?.lowStock !== undefined) params.append('lowStock', String(filters.lowStock));

      const response = await apiClient.get<ApiResponse<Product[]>>(`/api/products?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('제품 목록 조회 오류:', error);
      throw error;
    }
  },

  // 특정 제품 조회
  async getProduct(id: string): Promise<Product> {
    try {
      const response = await apiClient.get<ApiResponse<Product>>(`/api/products/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('제품 조회 오류:', error);
      throw error;
    }
  },

  // 제품 생성
  async createProduct(productData: Partial<Product>): Promise<Product> {
    try {
      const response = await apiClient.post<ApiResponse<Product>>('/api/products', productData);
      return response.data.data;
    } catch (error) {
      console.error('제품 생성 오류:', error);
      throw error;
    }
  },

  // 제품 업데이트
  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    try {
      const response = await apiClient.put<ApiResponse<Product>>(`/api/products/${id}`, productData);
      return response.data.data;
    } catch (error) {
      console.error('제품 업데이트 오류:', error);
      throw error;
    }
  },

  // 제품 삭제
  async deleteProduct(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/products/${id}`);
    } catch (error) {
      console.error('제품 삭제 오류:', error);
      throw error;
    }
  },

  // 재고 조정
  async adjustInventory(id: string, quantity: number, memo?: string): Promise<Product> {
    try {
      const response = await apiClient.post<ApiResponse<Product>>(
        `/api/products/${id}/adjust`,
        { quantity, memo }
      );
      return response.data.data;
    } catch (error) {
      console.error('재고 조정 오류:', error);
      throw error;
    }
  },

  // 위치 이동
  async moveLocation(id: string, toLocation: string): Promise<{ product: Product; locationHistory: LocationHistory }> {
    try {
      const response = await apiClient.post<ApiResponse<{ product: Product; locationHistory: LocationHistory }>>(
        `/api/products/${id}/move`,
        { toLocation }
      );
      return response.data.data;
    } catch (error) {
      console.error('위치 이동 오류:', error);
      throw error;
    }
  },

  // CSV 내보내기 URL 생성
  getExportUrl(filters?: ProductFilter): string {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.brand) params.append('brand', filters.brand);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.lowStock !== undefined) params.append('lowStock', String(filters.lowStock));

    const baseUrl = apiClient.defaults.baseURL || '';
    return `${baseUrl}/api/products/export?${params.toString()}`;
  },

  // 위치 이력 조회
  async getLocationHistory(id: string): Promise<LocationHistory[]> {
    try {
      const response = await apiClient.get<ApiResponse<LocationHistory[]>>(
        `/api/products/${id}/location-history`
      );
      return response.data.data;
    } catch (error) {
      console.error('위치 이력 조회 오류:', error);
      throw error;
    }
  },

  // CSV 내보내기
  async exportProducts(filters?: ProductFilter): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.brand) params.append('brand', filters.brand);
      if (filters?.location) params.append('location', filters.location);
      if (filters?.lowStock !== undefined) params.append('lowStock', String(filters.lowStock));

      const response = await apiClient.get(`/api/products/export?${params}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('제품 내보내기 오류:', error);
      throw error;
    }
  },

  // 대량 업로드
  async bulkUpload(file: File): Promise<BulkUploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClient.post<BulkUploadResponse>('/api/products/bulk', formData, {
        timeout: 60000, // 60초
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload Progress: ${percentCompleted}%`);
          }
        },
      });

      if (response.data.status === 'success' && response.data.data) {
        return {
          success: response.data.data.success || 0,
          failed: response.data.data.failed || 0,
          errors: response.data.data.errors || [],
        };
      } else {
        throw new Error(response.data.message || response.data.error || '업로드 중 알 수 없는 오류가 발생했습니다.');
      }
    } catch (error: any) {
      console.error('Bulk upload error:', error);

      if (error.response) {
        const errorData = error.response.data;
        if (errorData && (errorData.message || errorData.error)) {
          throw new Error(errorData.message || errorData.error);
        }
        switch (error.response.status) {
          case 400:
            throw new Error('잘못된 요청입니다. CSV 파일 형식을 확인해주세요.');
          case 401:
            throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
          case 403:
            throw new Error('권한이 없습니다. 관리자에게 문의해주세요.');
          case 413:
            throw new Error('파일 크기가 너무 큽니다. 10MB 이하의 파일을 업로드해주세요.');
          default:
            throw new Error(`서버 오류 (${error.response.status})`);
        }
      } else if (error.request) {
        throw new Error('서버 응답 없음. 네트워크를 확인해주세요.');
      } else {
        throw new Error(error.message || '요청 중 오류가 발생했습니다.');
      }
    }
  }
  },

  // 샘플 CSV 다운로드
  async downloadSampleCSV(): Promise<void> {
    try {
      const response = await apiClient.get('/api/products/sample-csv', {
        responseType: 'blob',
      });
      
      // 파일 다운로드 처리
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products_sample.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Sample CSV download error:', error);
      throw new Error('샘플 파일 다운로드 중 오류가 발생했습니다.');
    }
  },

  // 오프라인 동기화
  async syncOfflineActions(actions: any[]): Promise<any> {
    try {
      const response = await apiClient.post<ApiResponse<any>>('/api/sync/sync', { actions });
      return response.data.data;
    } catch (error) {
      console.error('오프라인 동기화 오류:', error);
      throw error;
    }
  }
};