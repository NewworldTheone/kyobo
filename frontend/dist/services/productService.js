import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: false,
});
// Add a request interceptor to include the token in all requests
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// Add a response interceptor
apiClient.interceptors.response.use((response) => response, (error) => {
    var _a;
    if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
        localStorage.removeItem('token');
    }
    return Promise.reject(error);
});
export const productService = {
    // 제품 목록 조회
    async getProducts(filters) {
        try {
            const response = await apiClient.get('/products', { params: filters });
            return response.data.data;
        }
        catch (error) {
            console.error('제품 목록 조회 오류:', error);
            throw error;
        }
    },
    // 제품 상세 조회
    async getProduct(id) {
        try {
            const response = await apiClient.get(`/products/${id}`);
            return response.data.data;
        }
        catch (error) {
            console.error('제품 상세 조회 오류:', error);
            throw error;
        }
    },
    // 제품 생성
    async createProduct(product) {
        try {
            const response = await apiClient.post('/products', product);
            return response.data.data;
        }
        catch (error) {
            console.error('제품 생성 오류:', error);
            throw error;
        }
    },
    // 제품 수정
    async updateProduct(id, product) {
        try {
            const response = await apiClient.put(`/products/${id}`, product);
            return response.data.data;
        }
        catch (error) {
            console.error('제품 수정 오류:', error);
            throw error;
        }
    },
    // 제품 삭제
    async deleteProduct(id) {
        try {
            await apiClient.delete(`/products/${id}`);
        }
        catch (error) {
            console.error('제품 삭제 오류:', error);
            throw error;
        }
    },
    // 재고 조정
    async adjustInventory(id, quantity, memo) {
        try {
            const response = await apiClient.post(`/products/${id}/adjust`, { quantity, memo });
            return response.data.data;
        }
        catch (error) {
            console.error('재고 조정 오류:', error);
            throw error;
        }
    },
    // 위치 이동
    async moveLocation(id, toLocation) {
        try {
            const response = await apiClient.post(`/products/${id}/move`, { toLocation });
            return response.data.data;
        }
        catch (error) {
            console.error('위치 이동 오류:', error);
            throw error;
        }
    },
    // 대량 업로드
    async bulkUpload(file) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await apiClient.post('/products/bulk-upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return {
                success: response.data.success,
                failed: response.data.failed,
                errors: response.data.errors
            };
        }
        catch (error) {
            console.error('대량 업로드 오류:', error);
            throw error;
        }
    },
    // CSV 내보내기 URL 생성
    getExportUrl(filters) {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== '') {
                    params.append(key, value.toString());
                }
            });
        }
        return `${API_BASE_URL}/products/export?${params.toString()}`;
    }
};
