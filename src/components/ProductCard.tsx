import { Link } from "react-router-dom";
import type { Product, UserRatings } from "../types";
import useLocalStorage from "../hooks/useLocalStorage";
import StarRating from "./StarRating";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [userRatings, setUserRatings] = useLocalStorage<UserRatings>(
    "userRatings",
    {}
  );

  const handleUserRatingChange = (newRating: number) => {
    setUserRatings((prevRatings) => ({
      ...prevRatings,
      [product.id]: newRating,
    }));
  };

  const displayRating = userRatings[product.id] || product.rating.rate;

  const displayedReviewCount =
    userRatings[product.id] && product.rating.count === 0
      ? 1
      : userRatings[product.id] && userRatings[product.id] !== 0
      ? product.rating.count + 1
      : product.rating.count;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col p-3 transform hover:scale-105 h-full">
      <Link
        to={`/dashboard/products/${product.id}`}
        className="flex flex-col flex-grow text-center"
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-contain mb-4"
        />

        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 min-h-[3rem] line-clamp-2">
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
        <div className="mb-3 flex items-center space-x-1 flex-wrap justify-center text-center">
          <StarRating
            initialRating={userRatings[product.id] || 0}
            onRatingChange={handleUserRatingChange}
            size="small"
          />
          <span className="text-yellow-600 font-bold text-sm">
            ({displayRating.toFixed(1)})
          </span>

          <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm whitespace-nowrap">
            ({displayedReviewCount}{" "}
            {displayedReviewCount === 1 ? "review" : "reviews"})
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
