import { Product } from './product';

export interface ProductFormData {
  name: string;
  sku: string;
  category: string;
  brand: string;
  location: string;
  quantity: number;
  safetyStock: number;
  price: number;
  description: string;
}

export interface Coordinates {
  x: number;
  y: number;
  layoutId: string;
}

export interface Layout {
  id: string;
  name: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocationHistory {
  id: string;
  productId: string;
  previousLocation: string;
  newLocation: string;
  movedAt: string;
  movedBy: string;
}