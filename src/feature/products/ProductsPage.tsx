import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchProducts, clearProductError } from "./productsSlice"; 
import LoadingSpinner from "../../components/LoadingSpinner";
import { ProductList } from "./ProductList"; 

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

export default ProductsPage;
