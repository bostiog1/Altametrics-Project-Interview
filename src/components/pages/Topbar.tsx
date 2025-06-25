// src/components/layout/Topbar.tsx
import React from "react";
import { useAppDispatch } from "../../store/hooks"; // Assuming this hook provides dispatch
import { logout } from "../../feature/auth/authSlice"; // Import logout action

// Simple burger icon for toggling (using inline SVG)
const BurgerIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

interface TopbarProps {
  toggleSidebar: () => void;
}

/**
 * Topbar component for the dashboard layout.
 * Includes app title, sidebar toggle, logout button, and product sorting options.
 */
const Topbar: React.FC<TopbarProps> = ({ toggleSidebar }) => {
  const dispatch = useAppDispatch();

  /**
   * Dispatches the logout action.
   */
  const handleLogout = () => {
    dispatch(logout());
  };

  /**
   * Placeholder function for sorting by price.
   * In a real app, this would dispatch a Redux action or update context to sort products.
   */
  const handleSortByPrice = () => {
    console.log("Sort by Price clicked");
    // Implement actual sorting logic here (e.g., dispatch an action)
  };

  /**
   * Placeholder function for sorting by rating.
   * In a real app, this would dispatch a Redux action or update context to sort products.
   */
  const handleSortByRating = () => {
    console.log("Sort by Rating clicked");
    // Implement actual sorting logic here (e.g., dispatch an action)
  };

  return (
    <header className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 flex justify-between items-center shadow-md">
      {/* Left section: Burger icon and App Title */}
      <div className="flex items-center">
        {/* Burger menu button for mobile */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 mr-3"
          aria-label="Toggle sidebar"
        >
          <BurgerIcon className="text-gray-900 dark:text-white" />
        </button>
        <h1 className="text-2xl font-bold">Fake Store</h1>
      </div>

      {/* Center section: Sorting options */}
      <div className="flex items-center space-x-4">
        <span className="text-md text-gray-700 dark:text-gray-300 hidden sm:block">
          Sort by:
        </span>
        <button
          onClick={handleSortByPrice}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 shadow-sm"
        >
          Price
        </button>
        <button
          onClick={handleSortByRating}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 shadow-sm"
        >
          Rating
        </button>
      </div>

      {/* Right section: Logout button */}
      <div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 shadow-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
