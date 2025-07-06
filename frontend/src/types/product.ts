export interface Product {
  id: string
  name: string
  sku: string
  category: string
  brand: string
  location: string
  quantity: number
  safetyStock: number
  price: number
  description?: string
  productImage?: string
  locationImage?: string
  coordinates?: {
    x: number;
    y: number;
    layoutId: string;
  }
  createdAt: string
  updatedAt: string
}

export interface ProductFilter {
  search?: string
  category?: string
  brand?: string
  location?: string
  lowStock?: boolean
}
