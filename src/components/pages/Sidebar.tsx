import React, { useEffect, useState } from "react";
import type { RefObject } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchCategories,
  setCategoryFilter,
} from "../../feature/products/productsSlice";
import { logout } from "../../feature/auth/authSlice";

import {
  FaTimes,
  FaCaretDown,
  FaHome,
  FaBoxOpen,
  FaSignOutAlt,
} from "react-icons/fa";

interface SidebarProps {
  isSidebarOpen: boolean;
  closeSidebar: () => void;
  sidebarRef: RefObject<HTMLDivElement>;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  closeSidebar,
  sidebarRef,
}) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { categories, selectedCategory } = useAppSelector(
    (state) => state.products
  );

  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(true);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryClick = (category: string) => {
    dispatch(setCategoryFilter(category));
  };

  const handleProductsToggle = () => {
    setIsProductsDropdownOpen(!isProductsDropdownOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    closeSidebar();
  };

  return (
    <div
      ref={sidebarRef}
      className={`
        fixed inset-y-0 left-0
        flex flex-col
        h-screen
        w-64
        z-50                       /* Higher z-index to overlay content */
        bg-white dark:bg-gray-800
        text-gray-900 dark:text-white
        border-r border-gray-200 dark:border-gray-700
        transition-transform duration-300 ease-in-out
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } /* Slide in/out */
        shadow-lg
      `}
    >
      <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold dark:text-white mr-auto">
          Fake Store
        </h1>
        <button
          onClick={closeSidebar}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
          aria-label="Close sidebar"
        >
          <FaTimes className="text-gray-900 dark:text-white" />
        </button>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <Link
          to="/dashboard"
          onClick={() => handleCategoryClick("all")}
          className={`flex items-center p-3 rounded-md hover:bg-blue-100 dark:hover:bg-gray-700 transition duration-150
            ${
              selectedCategory === "all" &&
              (location.pathname === "/dashboard" ||
                location.pathname === "/dashboard/")
                ? "bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300 font-semibold"
                : "text-gray-700 dark:text-white"
            }`}
        >
          <FaHome className="text-xl mr-3" />
          <span className="text-base">Home</span>
        </Link>

        <div className="mt-2">
          <button
            onClick={handleProductsToggle}
            className={`flex items-center w-full text-left p-3 rounded-md hover:bg-blue-100 dark:hover:bg-gray-700 transition duration-150
              ${
                location.pathname.startsWith("/dashboard") &&
                selectedCategory !== "all"
                  ? "bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300 font-semibold"
                  : "text-gray-700 dark:text-white"
              }`}
            aria-expanded={isProductsDropdownOpen}
            aria-controls="products-categories-menu"
          >
            <FaBoxOpen className="text-xl mr-3" />
            <span className="text-base">Products</span>
            <FaCaretDown
              className={`h-5 w-5 ml-auto transition-transform duration-200 ${
                isProductsDropdownOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {isProductsDropdownOpen && (
            <ul id="products-categories-menu" className="space-y-1 mt-1 pl-6">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => handleCategoryClick(category)}
                    className={`flex items-center w-full text-left p-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150
                      ${
                        selectedCategory === category
                          ? "bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300 font-semibold"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                  >
                    <span className="capitalize text-base">{category}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>

      <div className="flex justify-center p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 shadow-sm"
        >
          <FaSignOutAlt className="inline-block mr-2" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
