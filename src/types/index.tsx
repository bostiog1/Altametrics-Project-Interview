// --- API Related Types ---
export interface ApiError {
  message: string;
  statusCode?: number;
}

// --- Auth Related Types ---
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

// --- Product Related Types ---
export interface ProductRating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
}

export type ProductCategory = string;

export interface UserRatings {
  [productId: number]: number;
}
