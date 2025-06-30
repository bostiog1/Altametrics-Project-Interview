import React from "react";
import ProductCard from "../../components/ProductCard";
import type { Product } from "../../types";

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
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

