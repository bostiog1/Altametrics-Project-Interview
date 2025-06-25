// src/components/layout/Sidebar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

// Simple burger icon for toggling (using inline SVG for broad compatibility)
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

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

/**
 * Sidebar component for navigation.
 * Features collapse/expand functionality and links to different sections of the dashboard.
 * Product categories are presented as clickable items that would ideally filter the ProductsPage.
 */
const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();

  return (
    <div
      className={`
        fixed md:relative
        flex flex-col
        h-screen
        z-50
        bg-white dark:bg-gray-800
        text-gray-900 dark:text-white
        border-r border-gray-200 dark:border-gray-700
        transition-all duration-300 ease-in-out
        ${
          isCollapsed
            ? "-translate-x-full md:translate-x-0 md:w-20"
            : "translate-x-0 w-64"
        }
        shadow-lg md:shadow-none
      `}
    >
      {/* Sidebar Header */}
      <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <h1 className="text-xl font-bold dark:text-white mr-auto">
            Fake Store
          </h1>
        )}
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ${
            isCollapsed ? "mx-auto" : ""
          }`}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <BurgerIcon className="text-gray-900 dark:text-white" />
        </button>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        {/* User Profile Section (Optional, can be added later if user info is available) */}
        {/*
        {!isCollapsed && (
          <div className="mb-4 text-center">
            <div className="flex items-center justify-center">
              <img
                alt="profile-user"
                width="80px"
                height="80px"
                src="https://placehold.co/80x80/007bff/ffffff?text=User"
                className="rounded-full border-2 border-blue-500 shadow-md"
              />
            </div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-white mt-2">
              John Doe
            </h2>
          </div>
        )}
        */}

        <div className="space-y-2">
          {/* Home Link */}
          <Link
            to="/dashboard"
            className={`flex items-center p-3 rounded-md hover:bg-blue-100 dark:hover:bg-gray-700 transition duration-150
              ${
                location.pathname === "/dashboard"
                  ? "bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300 font-semibold"
                  : "text-gray-700 dark:text-white"
              }`}
          >
            <span className="text-xl">🏠</span>
            {!isCollapsed && <span className="ml-3">Home</span>}
          </Link>

          {/* Products Section */}
          <div>
            <Link
              to="/dashboard/products"
              className={`flex items-center p-3 rounded-md hover:bg-blue-100 dark:hover:bg-gray-700 transition duration-150
                ${
                  location.pathname.startsWith("/dashboard/products")
                    ? "bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300 font-semibold"
                    : "text-gray-700 dark:text-white"
                }`}
            >
              <span className="text-xl">🛍️</span>
              {!isCollapsed && <span className="ml-3">Products</span>}
            </Link>

            {/* Product Categories (these would ideally trigger filters on the ProductsPage) */}
            {!isCollapsed && (
              <ul className="ml-6 mt-2 space-y-1">
                {/* These could be Link components if you had separate routes for categories,
                    but given your `ProductFiltersProps`, they are likely for filtering on ProductsPage */}
                <li>
                  <a
                    href="#" // Use onClick event to trigger filter, or pass a category ID to ProductsPage
                    className="flex items-center p-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    onClick={(e) => {
                      e.preventDefault(); /* Implement filter for Electronics */
                    }}
                  >
                    <span className="mr-2 text-lg">💡</span> Electronics
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center p-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    onClick={(e) => {
                      e.preventDefault(); /* Implement filter for Jewelery */
                    }}
                  >
                    <span className="mr-2 text-lg">💎</span> Jewellery
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center p-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    onClick={(e) => {
                      e.preventDefault(); /* Implement filter for Men's Clothing */
                    }}
                  >
                    <span className="mr-2 text-lg">👨‍👕</span> Men's Clothing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center p-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    onClick={(e) => {
                      e.preventDefault(); /* Implement filter for Women's Clothing */
                    }}
                  >
                    <span className="mr-2 text-lg">👚</span> Women's Clothing
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
