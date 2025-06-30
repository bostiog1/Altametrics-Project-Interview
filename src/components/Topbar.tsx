import type { RefObject } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setSortBy } from "../features/products/productsSlice";

import { FaBars, FaSearch } from "react-icons/fa";
import DarkMode from "./DarkMode";

interface TopbarProps {
  toggleSidebar: () => void;
  topbarBurgerRef: RefObject<HTMLButtonElement>;
}

const Topbar: React.FC<TopbarProps> = ({ toggleSidebar, topbarBurgerRef }) => {
  const dispatch = useAppDispatch();
  const { sortBy } = useAppSelector((state) => state.products);

  const handleSortByPrice = () => {
    if (sortBy === "priceAsc") {
      dispatch(setSortBy("priceDesc"));
    } else if (sortBy === "priceDesc") {
      dispatch(setSortBy("none"));
    } else {
      dispatch(setSortBy("priceAsc"));
    }
  };

  const handleSortByRating = () => {
    if (sortBy === "ratingAsc") {
      dispatch(setSortBy("ratingDesc"));
    } else if (sortBy === "ratingDesc") {
      dispatch(setSortBy("none"));
    } else {
      dispatch(setSortBy("ratingAsc"));
    }
  };

  const isPriceActive = sortBy.startsWith("price");
  const isRatingActive = sortBy.startsWith("rating");

  return (
    <header className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 flex flex-col justify-center items-center shadow-md">
      <div className="flex w-full justify-start items-center mb-3 md:mb-4">
        <button
          ref={topbarBurgerRef}
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 mr-3"
          aria-label="Toggle sidebar"
        >
          <FaBars className="text-gray-900 dark:text-white" />
        </button>
        <div className="relative flex-grow mx-2 md:mx-4">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            aria-label="Search products"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-500 dark:text-gray-400" />
          </div>
        </div>
        <DarkMode />
      </div>

      <div className="flex items-center space-x-4 w-full justify-center md:justify-start">
        <span className="text-md text-gray-700 dark:text-gray-300">
          Sort by:
        </span>
        <button
          onClick={handleSortByPrice}
          className={`
    py-1 px-4 rounded-xl transition shadow-sm font-semibold
    ${
      isPriceActive
        ? "bg-blue-900 text-white hover:bg-blue-800 " +
          "dark:bg-blue-700 dark:hover:bg-blue-600 dark:text-white"
        : "bg-gray-200 text-gray-900 hover:bg-gray-300 " +
          "dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"
    }`}
        >
          Price {isPriceActive && (sortBy === "priceAsc" ? "▲" : "▼")}
        </button>
        <button
          onClick={handleSortByRating}
          className={`
    py-1 px-4 rounded-xl transition shadow-sm font-semibold
    ${
      isRatingActive
        ? "bg-blue-900 text-white hover:bg-blue-800 " +
          "dark:bg-blue-700 dark:hover:bg-blue-600 dark:text-white"
        : "bg-gray-200 text-gray-900 hover:bg-gray-300 " +
          "dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"
    }`}
        >
          Rating {isRatingActive && (sortBy === "ratingAsc" ? "▲" : "▼")}
        </button>
      </div>
    </header>
  );
};

export default Topbar;
