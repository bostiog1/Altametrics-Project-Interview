// src/features/products/ProductViews.tsx
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks"; // Relative path
import { useParams, useNavigate } from "react-router-dom"; // Relative path
import {
  fetchProducts,
  fetchCategories,
  setCategoryFilter,
  setSortBy,
  clearProductError,
  fetchProductById, // NEW: Import fetchProductById
  clearSelectedProduct, // NEW: Import clearSelectedProduct
} from "./productsSlice"; // Relative path
import LoadingSpinner from "../../components/LoadingSpinner"; // Relative path
import ProductCard from "../../components/ProductCard"; // Relative path
import type { ProductCategory, Product } from "../../types"; // Relative path

import useLocalStorage from "../../hooks/useLocalStorage"; // NEW: Import useLocalStorage
import type { UserRatings } from "../../types"; // NEW: Import UserRatings
import StarRating from "../../components/StarRating"; // NEW: Import StarRating

// --- Product Filters Component ---
interface ProductFiltersProps {
  categories: ProductCategory[];
  selectedCategory: ProductCategory | "all";
  sortBy: "priceAsc" | "priceDesc" | "ratingAsc" | "ratingDesc" | "none";
  onCategoryChange: (category: ProductCategory | "all") => void;
  onSortChange: (
    sortOption: "priceAsc" | "priceDesc" | "ratingAsc" | "ratingDesc" | "none"
  ) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  selectedCategory,
  sortBy,
  onCategoryChange,
  onSortChange,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-6 p-4 bg-gray-50 rounded-lg shadow-sm mb-6">
      <div className="flex items-center space-x-2">
        <label htmlFor="category-filter" className="text-gray-700 font-medium">
          Filter by Category:
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) =>
            onCategoryChange(e.target.value as ProductCategory | "all")
          }
          className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "all"
                ? "All Categories"
                : category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <label htmlFor="sort-by" className="text-gray-700 font-medium">
          Sort by:
        </label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={(e) =>
            onSortChange(
              e.target.value as
                | "priceAsc"
                | "priceDesc"
                | "ratingAsc"
                | "ratingDesc"
                | "none"
            )
          }
          className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="none">None</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="ratingAsc">Rating: Low to High</option>
          <option value="ratingDesc">Rating: High to Low</option>
        </select>
      </div>
    </div>
  );
};

// --- Product List Component ---
interface ProductListProps {
  products: Product[];
  // onAssignRating and getStoredRating props will be added later
}

export const ProductList: React.FC<ProductListProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <p className="text-center text-lg text-gray-600 mt-10">
        No products found matching your criteria.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

// --- Products Page Component ---
export const ProductsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    filteredProducts,
    categories,
    selectedCategory,
    sortBy,
    isLoading,
    error,
  } = useAppSelector((state) => state.products);

  // Fetch products and categories on component mount
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    // Clean up any error state when component mounts or dependencies change
    return () => {
      dispatch(clearProductError());
    };
  }, [dispatch]); // Only re-run if dispatch changes (it won't)

  // Handlers for filter and sort changes
  const handleCategoryChange = (category: ProductCategory | "all") => {
    dispatch(setCategoryFilter(category));
  };

  const handleSortChange = (
    sortOption: "priceAsc" | "priceDesc" | "ratingAsc" | "ratingDesc" | "none"
  ) => {
    dispatch(setSortBy(sortOption));
  };

  // --- Loading and Error States ---
  if (isLoading && filteredProducts.length === 0) {
    // Only show full spinner if no products loaded yet
    return (
      <div className="min-h-[60vh] flex items-center justify-center flex-col text-blue-600">
        <LoadingSpinner size="large" color="text-blue-600" />
        <p className="mt-4 text-xl font-medium">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center flex-col text-red-600 text-center p-4">
        <h2 className="text-2xl font-bold mb-4">Error Loading Products!</h2>
        <p className="text-lg mb-6">{error}</p>
        <button
          onClick={() => {
            dispatch(clearProductError()); // Clear error before retrying
            dispatch(fetchProducts());
            dispatch(fetchCategories());
          }}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  // --- Main Products Page Content ---
  return (
    <div className="p-4">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
        Product Catalog
      </h1>

      <ProductFilters
        categories={categories}
        selectedCategory={selectedCategory}
        sortBy={sortBy}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
      />

      <ProductList products={filteredProducts} />
    </div>
  );
};

// --- NEW: Product Detail Page Component ---
export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the product ID from the URL
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedProduct, isProductDetailLoading, productDetailError } =
    useAppSelector((state) => state.products);

  // NEW: State for user-assigned ratings
  const [userRatings, setUserRatings] = useLocalStorage<UserRatings>(
    "userRatings",
    {}
  );
  const currentUserRating = selectedProduct
    ? userRatings[selectedProduct.id]
    : 0; // Get rating for this product

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(Number(id))); // Fetch product by ID
    }

    // Cleanup: Clear the selected product when leaving the page
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [id, dispatch]); // Re-fetch if ID changes

  // NEW: Handle user assigning a rating for the detailed product
  const handleUserRatingChange = (newRating: number) => {
    if (selectedProduct) {
      setUserRatings((prevRatings) => ({
        ...prevRatings,
        [selectedProduct.id]: newRating,
      }));
    }
  };

  if (isProductDetailLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center flex-col text-blue-600">
        <LoadingSpinner size="large" color="text-blue-600" />
        <p className="mt-4 text-xl font-medium">Loading product details...</p>
      </div>
    );
  }

  if (productDetailError) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center flex-col text-red-600 text-center p-4">
        <h2 className="text-2xl font-bold mb-4">Error Loading Product!</h2>
        <p className="text-lg mb-6">{productDetailError}</p>
        <button
          onClick={() => navigate("/products")} // Go back to products list
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Back to Products
        </button>
      </div>
    );
  }

  if (!selectedProduct) {
    // This case might happen if ID is invalid or product not found and error was cleared
    return (
      <div className="min-h-[70vh] flex items-center justify-center flex-col text-gray-600 text-center p-4">
        <h2 className="text-2xl font-bold mb-4">
          No Product Selected or Found
        </h2>
        <button
          onClick={() => navigate("/products")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Back to Products
        </button>
      </div>
    );
  }
  // Determine which rating to display: user's rating if it exists, otherwise API's rating
  const displayRatingValue =
    currentUserRating || (selectedProduct ? selectedProduct.rating.rate : 0);
  const displayRatingCount = currentUserRating
    ? "Your rating"
    : `${selectedProduct!.rating.count} reviews`;

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-xl my-8 max-w-4xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full transition duration-200 flex items-center"
      >
        &larr; Back to Products
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 flex items-center justify-center p-4 bg-gray-50 rounded-lg">
          <img
            src={selectedProduct!.image} // Use ! as selectedProduct is guaranteed here by earlier checks
            alt={selectedProduct!.title}
            className="max-h-96 object-contain rounded-lg shadow"
          />
        </div>
        <div className="md:w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {selectedProduct!.title}
          </h1>
          <p className="text-blue-600 text-3xl font-extrabold mb-4">
            ${selectedProduct!.price.toFixed(2)}
          </p>
          <p className="text-gray-700 text-lg mb-4 leading-relaxed">
            {selectedProduct!.description}
          </p>
          <div className="mb-4">
            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full capitalize">
              {selectedProduct!.category}
            </span>
          </div>
          {/* NEW: Display UserRating component and combined rating info */}
          <div className="flex items-center text-gray-700 text-md mb-6 space-x-2">
            <StarRating
              initialRating={currentUserRating} // Use the user's rating
              onRatingChange={handleUserRatingChange}
              size="large"
            />
            <span className="text-yellow-600 font-bold text-lg">
              ({displayRatingValue.toFixed(1)})
            </span>
            <span className="text-gray-500 text-sm">
              ({displayRatingCount})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
