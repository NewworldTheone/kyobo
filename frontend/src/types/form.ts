export interface ProductFormData {
  name: string;
  sku: string;
  category: string;
  brand: string;
  location: string;
  quantity: string; // form에서는 string으로 받은 후 변환
  safetyStock: string; // form에서는 string으로 받은 후 변환
  price: string; // form에서는 string으로 받은 후 변환
  description?: string;
}

export interface FileUploadFormData {
  file: FileList;
}