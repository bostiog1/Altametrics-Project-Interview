// src/features/products/productsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { productsApi } from "../../api"; // Relative path to api folder
import type { Product, ProductCategory } from "../../types"; // Relative path to types/index.ts

interface ProductsState {
  products: Product[]; // All fetched products (unfiltered, unsorted)
  categories: ProductCategory[]; // All fetched categories
  filteredProducts: Product[]; // Products after applying filters and sorts
  selectedCategory: ProductCategory | "all"; // Current category filter
  sortBy: "priceAsc" | "priceDesc" | "ratingAsc" | "ratingDesc" | "none"; // Current sort option
  isLoading: boolean; // Loading state for product fetching
  error: string | null; // Error message for product fetching

  // --- NEW: For Product Detail Page ---
  selectedProduct: Product | null; // Stores the currently viewed product details
  isProductDetailLoading: boolean; // Loading state for single product fetch
  productDetailError: string | null; // Error for single product fetch
  // --- END NEW ---
}

const initialState: ProductsState = {
  products: [],
  categories: [],
  filteredProducts: [],
  selectedCategory: "all", // Default filter
  sortBy: "none", // Default sort
  isLoading: false,
  error: null,
  // --- NEW: For Product Detail Page ---
  selectedProduct: null, // Initially no product is selected
  isProductDetailLoading: false, // Loading state for single product fetch
  productDetailError: null, // Error for single product fetch
  // --- END NEW ---
};

// Async Thunk for fetching all products
export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await productsApi.getAllProducts();
    return response;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch products.";
    return rejectWithValue(errorMessage);
  }
});

// Async Thunk for fetching product categories
export const fetchCategories = createAsyncThunk<
  ProductCategory[],
  void,
  { rejectValue: string }
>("products/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const response = await productsApi.getAllCategories();
    return response;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch categories.";
    return rejectWithValue(errorMessage);
  }
});

// --- NEW: Async Thunk for fetching a single product by ID ---
export const fetchProductById = createAsyncThunk<
  Product,
  number,
  { rejectValue: string }
>("products/fetchProductById", async (productId, { rejectWithValue }) => {
  try {
    const response = await productsApi.getProductById(productId);
    return response;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      `Failed to fetch product with ID: ${productId}.`;
    // If the product is not found (e.g., 404), return a specific error
    if (error.response && error.response.status === 404) {
      return rejectWithValue("Product not found.");
    }
    return rejectWithValue(errorMessage);
  }
});
// --- END NEW ---

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Sets the selected category and triggers filtering/sorting
    setCategoryFilter: (
      state,
      action: PayloadAction<ProductCategory | "all">
    ) => {
      state.selectedCategory = action.payload;
      // Apply filters and sort immediately when filter changes
      productsSlice.caseReducers.applyFiltersAndSort(state);
    },
    // Sets the sort order and triggers filtering/sorting
    setSortBy: (state, action: PayloadAction<ProductsState["sortBy"]>) => {
      state.sortBy = action.payload;
      // Apply filters and sort immediately when sort changes
      productsSlice.caseReducers.applyFiltersAndSort(state);
    },
    // Helper reducer (not exported) to apply current filters and sort
    applyFiltersAndSort: (state) => {
      let tempProducts = [...state.products]; // Start with original products

      // 1. Filter by Category
      if (state.selectedCategory !== "all") {
        tempProducts = tempProducts.filter(
          (product) => product.category === state.selectedCategory
        );
      }

      // 2. Sort
      if (state.sortBy === "priceAsc") {
        tempProducts.sort((a, b) => a.price - b.price);
      } else if (state.sortBy === "priceDesc") {
        tempProducts.sort((a, b) => b.price - a.price);
      } else if (state.sortBy === "ratingAsc") {
        // Sort by rating.rate ascending
        tempProducts.sort((a, b) => a.rating.rate - b.rating.rate);
      } else if (state.sortBy === "ratingDesc") {
        // Sort by rating.rate descending
        tempProducts.sort((a, b) => b.rating.rate - a.rating.rate);
      }

      state.filteredProducts = tempProducts; // Update the displayed products
    },
    // Action to clear any product-related error messages
    clearProductError: (state) => {
      state.error = null;
      state.productDetailError = null; // Clear detail error too
    },
    // --- NEW: Action to clear selected product when leaving detail page ---
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.productDetailError = null;
    },
    // --- END NEW ---
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchProducts lifecycle
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.isLoading = false;
          state.products = action.payload;
          // Once products are fetched, apply initial filters/sort
          productsSlice.caseReducers.applyFiltersAndSort(state);
        }
      )
      .addCase(
        fetchProducts.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.isLoading = false;
          state.error = action.payload || "Failed to load products.";
        }
      )
      // Handle fetchCategories lifecycle
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<ProductCategory[]>) => {
          // Add 'all' option to the categories list
          state.categories = ["all", ...action.payload];
        }
      )
      .addCase(
        fetchCategories.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          // You might want a separate error state for categories if critical
          console.error("Failed to load categories:", action.payload);
          // For now, just set error if products also failed
          if (!state.error) {
            // Don't overwrite product fetch error
            state.error = action.payload || "Failed to load categories.";
          }
        }
      )
      // --- NEW: Handle fetchProductById lifecycle ---
      .addCase(fetchProductById.pending, (state) => {
        state.isProductDetailLoading = true;
        state.selectedProduct = null; // Clear previous product
        state.productDetailError = null; // Clear previous error
      })
      .addCase(
        fetchProductById.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.isProductDetailLoading = false;
          state.selectedProduct = action.payload; // Store the fetched product
        }
      )
      .addCase(
        fetchProductById.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.isProductDetailLoading = false;
          state.selectedProduct = null; // No product on failure
          state.productDetailError =
            action.payload || "Failed to load product details.";
        }
      );
    // --- END NEW ---
  },
});

// Export actions
export const {
  setCategoryFilter,
  setSortBy,
  clearProductError,
  clearSelectedProduct,
} = productsSlice.actions;

// Export the reducer
export default productsSlice.reducer;
