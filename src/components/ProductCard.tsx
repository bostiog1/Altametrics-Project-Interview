// src/components/ProductCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import type { Product, UserRatings } from "../types"; // NEW: Import UserRatings
import { useAppDispatch } from "../store/hooks";
import useLocalStorage from "../hooks/useLocalStorage"; // NEW: Import useLocalStorage hook
import StarRating from "./StarRating"; // NEW: Import StarRating component

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  // NEW: State for user-assigned ratings
  // The key 'userRatings' should be consistent across components that use it
  const [userRatings, setUserRatings] = useLocalStorage<UserRatings>(
    "userRatings",
    {}
  );

  // NEW: Handle user assigning a rating
  const handleUserRatingChange = (newRating: number) => {
    setUserRatings((prevRatings) => ({
      ...prevRatings,
      [product.id]: newRating,
    }));
  };

  // Determine which rating to display: user's rating if it exists, otherwise API's rating
  const displayRating = userRatings[product.id] || product.rating.rate;
  const displayRatingCount = userRatings[product.id]
    ? "Your rating"
    : `${product.rating.count} reviews`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col p-4 transform   hover:scale-105 h-full">
      <Link
        to={`/dashboard/products/${product.id}`}
        className="flex flex-col flex-grow text-center"
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-contain mb-4"
        />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 min-h-[3rem]">
          {product.title}
        </h3>
      </Link>
      <p className="text-xl font-bold text-blue-600 mb-2">
        ${product.price.toFixed(2)}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 capitalize">
        {product.category}
      </p>
      <div className="mt-auto pt-2 border-t border-gray-200 dark:border-gray-700 flex flex-col items-center">
        {/* NEW: Display UserRating component */}
        <div className="mb-3 flex items-center space-x-2">
          <StarRating
            initialRating={userRatings[product.id] || 0} // Use user's rating, or 0 if none
            onRatingChange={handleUserRatingChange}
            size="small"
          />
          <span className="text-yellow-600 font-bold text-sm">
            ({displayRating.toFixed(1)})
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-xs">
            ({displayRatingCount})
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
