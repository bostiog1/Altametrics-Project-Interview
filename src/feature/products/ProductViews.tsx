import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchProducts,
  clearProductError,
  fetchProductById,
  clearSelectedProduct,
} from "./productsSlice";
import LoadingSpinner from "../../components/LoadingSpinner";
import ProductCard from "../../components/ProductCard";
import type { Product } from "../../types";

import useLocalStorage from "../../hooks/useLocalStorage";
import type { UserRatings } from "../../types";
import StarRating from "../../components/StarRating";

interface ProductListProps {
  products: Product[];
}

export const ProductList: React.FC<ProductListProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <p className="text-center text-lg text-gray-600 dark:text-gray-300 mt-10 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
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

export const ProductsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filteredProducts, isLoading, error } = useAppSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
    return () => {
      dispatch(clearProductError());
    };
  }, [dispatch]);

  if (isLoading && filteredProducts.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center flex-col text-blue-600 dark:text-blue-400">
        <LoadingSpinner size="large" color="text-blue-600 dark:text-blue-400" />
        <p className="mt-4 text-xl font-medium">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center flex-col text-red-600 dark:text-red-400 text-center p-4">
        <h2 className="text-2xl font-bold mb-4">Error Loading Products!</h2>
        <p className="text-lg mb-6">{error}</p>
        <button
          onClick={() => {
            dispatch(clearProductError());
            dispatch(fetchProducts());
          }}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200
                     dark:bg-red-700 dark:hover:bg-red-800 dark:text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <ProductList products={filteredProducts} />
    </div>
  );
};

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedProduct, isProductDetailLoading, productDetailError } =
    useAppSelector((state) => state.products);

  const [userRatings, setUserRatings] = useLocalStorage<UserRatings>(
    "userRatings",
    {}
  );
  const currentUserRating = selectedProduct
    ? userRatings[selectedProduct.id]
    : 0;

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(Number(id)));
    }
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [id, dispatch]);

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
          onClick={() => navigate("/dashboard")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Back to Products
        </button>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center flex-col text-gray-600 text-center p-4">
        <h2 className="text-2xl font-bold mb-4">
          No Product Selected or Found
        </h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const displayRatingValue =
    currentUserRating || (selectedProduct ? selectedProduct.rating.rate : 0);
  const displayRatingCount = currentUserRating
    ? "Your rating"
    : `${selectedProduct!.rating.count} reviews`;

  return (
    <div className="container mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-2xl my-8 max-w-4xl">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full transition duration-200 flex items-center
          dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
      >
        &larr; Back to Products
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <img
            src={selectedProduct!.image}
            alt={selectedProduct!.title}
            className="max-h-96 object-contain rounded-lg shadow"
          />
        </div>
        <div className="md:w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {selectedProduct!.title}
          </h1>
          <p className="text-blue-600 text-3xl font-extrabold mb-4">
            ${selectedProduct!.price.toFixed(2)}
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-4 leading-relaxed">
            {selectedProduct!.description}
          </p>
          <div className="mb-4">
            <span
              className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full capitalize
           dark:bg-blue-800 dark:text-blue-100"
            >
              {selectedProduct!.category}
            </span>
          </div>
          <div className="flex items-center text-gray-700 dark:text-gray-300 text-md mb-6 space-x-2">
            <StarRating
              initialRating={currentUserRating}
              onRatingChange={handleUserRatingChange}
              size="large"
            />
            <span className="text-yellow-600 font-bold text-lg">
              ({displayRatingValue.toFixed(1)})
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              ({displayRatingCount})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
