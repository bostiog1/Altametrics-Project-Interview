import axios from "axios";
import { API_BASE_URL } from "../utils/constants"; // Value import
import type { Product, ProductCategory } from "../types/index"; // Type-only import

export const productsApi = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await axios.get<Product[]>(`${API_BASE_URL}/products`);
    return response.data;
  },
  getProductById: async (id: number): Promise<Product> => {
    const response = await axios.get<Product>(`${API_BASE_URL}/products/${id}`);
    return response.data;
  },
  getAllCategories: async (): Promise<ProductCategory[]> => {
    const response = await axios.get<ProductCategory[]>(
      `${API_BASE_URL}/products/categories`
    );
    return response.data;
  },
};
