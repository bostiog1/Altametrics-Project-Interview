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

// --- NEW: User Ratings Type ---
// A map where key is productId (number) and value is the user's rating (number 1-5)
export interface UserRatings {
  [productId: number]: number;
}
