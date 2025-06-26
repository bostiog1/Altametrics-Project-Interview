import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { productsApi } from "../../api";
import type { Product, ProductCategory } from "../../types";

interface ProductsState {
  products: Product[];
  categories: ProductCategory[];
  filteredProducts: Product[];
  selectedCategory: ProductCategory | "all";
  sortBy: "priceAsc" | "priceDesc" | "ratingAsc" | "ratingDesc" | "none";
  isLoading: boolean;
  error: string | null;

  selectedProduct: Product | null;
  isProductDetailLoading: boolean;
  productDetailError: string | null;
}

const initialState: ProductsState = {
  products: [],
  categories: [],
  filteredProducts: [],
  selectedCategory: "all",
  sortBy: "none",
  isLoading: false,
  error: null,
  selectedProduct: null,
  isProductDetailLoading: false,
  productDetailError: null,
};

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
    if (error.response && error.response.status === 404) {
      return rejectWithValue("Product not found.");
    }
    return rejectWithValue(errorMessage);
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setCategoryFilter: (
      state,
      action: PayloadAction<ProductCategory | "all">
    ) => {
      state.selectedCategory = action.payload;
      productsSlice.caseReducers.applyFiltersAndSort(state);
    },
    setSortBy: (state, action: PayloadAction<ProductsState["sortBy"]>) => {
      state.sortBy = action.payload;
      productsSlice.caseReducers.applyFiltersAndSort(state);
    },
    applyFiltersAndSort: (state) => {
      let tempProducts = [...state.products];

      if (state.selectedCategory !== "all") {
        tempProducts = tempProducts.filter(
          (product) => product.category === state.selectedCategory
        );
      }

      if (state.sortBy === "priceAsc") {
        tempProducts.sort((a, b) => a.price - b.price);
      } else if (state.sortBy === "priceDesc") {
        tempProducts.sort((a, b) => b.price - a.price);
      } else if (state.sortBy === "ratingAsc") {
        tempProducts.sort((a, b) => a.rating.rate - b.rating.rate);
      } else if (state.sortBy === "ratingDesc") {
        tempProducts.sort((a, b) => b.rating.rate - a.rating.rate);
      }

      state.filteredProducts = tempProducts;
    },
    clearProductError: (state) => {
      state.error = null;
      state.productDetailError = null;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.productDetailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.isLoading = false;
          state.products = action.payload;
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
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<ProductCategory[]>) => {
          state.categories = ["all", ...action.payload];
        }
      )
      .addCase(
        fetchCategories.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          console.error("Failed to load categories:", action.payload);
          if (!state.error) {
            state.error = action.payload || "Failed to load categories.";
          }
        }
      )
      .addCase(fetchProductById.pending, (state) => {
        state.isProductDetailLoading = true;
        state.selectedProduct = null;
        state.productDetailError = null;
      })
      .addCase(
        fetchProductById.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.isProductDetailLoading = false;
          state.selectedProduct = action.payload;
        }
      )
      .addCase(
        fetchProductById.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.isProductDetailLoading = false;
          state.selectedProduct = null;
          state.productDetailError =
            action.payload || "Failed to load product details.";
        }
      );
  },
});

export const {
  setCategoryFilter,
  setSortBy,
  clearProductError,
  clearSelectedProduct,
} = productsSlice.actions;

export default productsSlice.reducer;
