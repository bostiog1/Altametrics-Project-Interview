// src/components/pages/sidebar.tsx
import React, { useEffect, useState } from "react"; // NEW: Import RefObject
import type { RefObject } from "react"; // NEW: Import RefObject type
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchCategories,
  setCategoryFilter,
} from "../../feature/products/productsSlice";
import { logout } from "../../feature/auth/authSlice";

// Import icons from react-icons/fa
import {
  FaBars, // For the burger menu (collapsed state)
  FaTimes, // For the close (X) icon (open state)
  FaCaretDown, // For the dropdown caret
  FaHome, // For Home link
  FaBoxOpen, // For Products link
  FaSignOutAlt, // For Logout button
} from "react-icons/fa";

interface SidebarProps {
  isSidebarOpen: boolean; // NEW: Prop to control open/closed state
  closeSidebar: () => void; // NEW: Function to close sidebar
  sidebarRef: RefObject<HTMLDivElement>; // NEW: Ref for click-outside
}

/**
 * Sidebar component for navigation and category filtering.
 * Features overlay functionality, a nested 'Products' menu, and logout button.
 * Uses Font Awesome icons.
 */
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

  // State to control the visibility of the "Products" dropdown
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(true);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryClick = (category: string) => {
    dispatch(setCategoryFilter(category));
    // When clicking a category, if on mobile, you might want to close the sidebar.
    // However, the current requirement is to click X or outside to close.
    // For now, no explicit closeSidebar() here.
  };

  const handleProductsToggle = () => {
    setIsProductsDropdownOpen(!isProductsDropdownOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    closeSidebar(); // Close sidebar after logout
  };

  return (
    <div
      ref={sidebarRef} // Apply the ref here
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
      {/* Sidebar Header */}
      <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold dark:text-white mr-auto">
          Fake Store
        </h1>
        <button
          onClick={closeSidebar} // Click 'X' to close sidebar
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
          aria-label="Close sidebar"
        >
          <FaTimes className="text-gray-900 dark:text-white" /> {/* 'X' Icon */}
        </button>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        {/* Home Link */}
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

        {/* Products Section with Dropdown Toggle */}
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

          {/* Product Categories Dropdown */}
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

      {/* Footer / Logout Section */}
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

// // src/components/pages/sidebar.tsx
// import React, { useEffect, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../../store/hooks";
// import {
//   fetchCategories,
//   setCategoryFilter,
// } from "../../feature/products/productsSlice";
// import { logout } from "../../feature/auth/authSlice";

// // Import icons from react-icons/fa
// import {
//   FaBars, // For the burger menu
//   FaCaretDown, // For the dropdown caret
//   FaCaretUp, // For the dropdown caret (if needed for up state)
//   FaHome, // For Home link
//   FaBoxOpen, // For Products link
//   FaSignOutAlt, // For Logout button
// } from "react-icons/fa";

// interface SidebarProps {
//   isCollapsed: boolean;
//   toggleSidebar: () => void;
// }

// /**
//  * Sidebar component for navigation and category filtering.
//  * Features collapse/expand functionality and a nested 'Products' menu with categories.
//  * Includes logout button at the bottom, using Font Awesome icons.
//  */
// const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
//   const location = useLocation();
//   const dispatch = useAppDispatch();
//   const { categories, selectedCategory } = useAppSelector(
//     (state) => state.products
//   );

//   // State to control the visibility of the "Products" dropdown
//   const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(true);

//   useEffect(() => {
//     dispatch(fetchCategories());
//   }, [dispatch]);

//   const handleCategoryClick = (category: string) => {
//     dispatch(setCategoryFilter(category));
//   };

//   const handleProductsToggle = () => {
//     setIsProductsDropdownOpen(!isProductsDropdownOpen);
//   };

//   /**
//    * Dispatches the logout action.
//    */
//   const handleLogout = () => {
//     dispatch(logout());
//     // Optionally close sidebar on mobile after logout
//     if (!isCollapsed) {
//       toggleSidebar();
//     }
//   };

//   return (
//     <div
//       className={`
//         fixed md:relative
//         flex flex-col
//         h-screen
//         z-50
//         bg-white dark:bg-gray-800
//         text-gray-900 dark:text-white
//         border-r border-gray-200 dark:border-gray-700
//         transition-all duration-300 ease-in-out
//         ${
//           isCollapsed
//             ? "-translate-x-full md:translate-x-0 md:w-20"
//             : "translate-x-0 w-64"
//         }
//         shadow-lg md:shadow-none
//       `}
//     >
//       {/* Sidebar Header */}
//       <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
//         {!isCollapsed && (
//           <h1 className="text-xl font-bold dark:text-white mr-auto">
//             Fake Store
//           </h1>
//         )}
//         <button
//           onClick={toggleSidebar}
//           className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ${
//             isCollapsed ? "mx-auto" : ""
//           }`}
//           aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//         >
//           <FaBars className="text-gray-900 dark:text-white" />
//         </button>
//       </div>

//       <nav className="flex-1 p-4 overflow-y-auto">
//         {/* Home Link - always navigate to /dashboard (which shows all products by default) */}
//         <Link
//           to="/dashboard"
//           onClick={() => handleCategoryClick("all")} // Reset filter to "all" when navigating to home/dashboard
//           className={`flex items-center p-3 rounded-md hover:bg-blue-100 dark:hover:bg-gray-700 transition duration-150
//             ${
//               selectedCategory === "all" &&
//               (location.pathname === "/dashboard" ||
//                 location.pathname === "/dashboard/")
//                 ? "bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300 font-semibold"
//                 : "text-gray-700 dark:text-white"
//             }`}
//         >
//           <FaHome className="text-xl mr-3" /> {/* Home Icon */}
//           <span className="text-base">Home</span>
//         </Link>

//         {/* Products Section with Dropdown Toggle */}
//         <div className="mt-2">
//           <button
//             onClick={handleProductsToggle}
//             className={`flex items-center w-full text-left p-3 rounded-md hover:bg-blue-100 dark:hover:bg-gray-700 transition duration-150
//               ${
//                 location.pathname.startsWith("/dashboard") &&
//                 selectedCategory !== "all"
//                   ? "bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300 font-semibold"
//                   : "text-gray-700 dark:text-white"
//               }`}
//             aria-expanded={isProductsDropdownOpen}
//             aria-controls="products-categories-menu"
//           >
//             <FaBoxOpen className="text-xl mr-3" /> {/* Products Icon */}
//             <span className="text-base">Products</span>
//             <FaCaretDown
//               className={`h-5 w-5 ml-auto transition-transform duration-200 ${
//                 isProductsDropdownOpen ? "rotate-180" : "rotate-0"
//               }`}
//             />{" "}
//             {/* Caret icon */}
//           </button>

//           {/* Product Categories Dropdown */}
//           {!isCollapsed && isProductsDropdownOpen && (
//             <ul id="products-categories-menu" className="space-y-1 mt-1 pl-6">
//               {categories.map((category) => (
//                 <li key={category}>
//                   <button
//                     onClick={() => handleCategoryClick(category)}
//                     className={`flex items-center w-full text-left p-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150
//                       ${
//                         selectedCategory === category
//                           ? "bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300 font-semibold"
//                           : "text-gray-600 dark:text-gray-300"
//                       }`}
//                   >
//                     <span className="capitalize text-base">{category}</span>
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </nav>

//       {/* Footer / Logout Section */}
//       <div className="flex justify-center p-4 border-t border-gray-200 dark:border-gray-700">
//         <button
//           onClick={handleLogout}
//           className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 shadow-sm"
//         >
//           {!isCollapsed && "Logout"}
//           {isCollapsed && ( // Logout icon for collapsed state
//             <FaSignOutAlt className="h-6 w-6 mx-auto" />
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// // src/components/pages/sidebar.tsx
// import React, { useEffect, useState } from "react"; // Added useState
// import { Link, useLocation } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../../store/hooks";
// import {
//   fetchCategories,
//   setCategoryFilter,
// } from "../../feature/products/productsSlice";

// // Simple burger icon for toggling (using inline SVG for broad compatibility)
// const BurgerIcon: React.FC = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className="h-6 w-6"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M4 6h16M4 12h16M4 18h16"
//     />
//   </svg>
// );

// // Caret icon for dropdown (pointing down initially)
// const CaretDownIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className={`h-5 w-5 ml-auto transition-transform duration-200 ${
//       isOpen ? "rotate-180" : "rotate-0"
//     }`}
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//     strokeWidth={2}
//   >
//     <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//   </svg>
// );

// interface SidebarProps {
//   isCollapsed: boolean;
//   toggleSidebar: () => void;
// }

// /**
//  * Sidebar component for navigation and category filtering.
//  * Features collapse/expand functionality and a nested 'Products' menu with categories.
//  */
// const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
//   const location = useLocation();
//   const dispatch = useAppDispatch();
//   const { categories, selectedCategory } = useAppSelector(
//     (state) => state.products
//   );

//   // State to control the visibility of the "Products" dropdown
//   const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(true); // Start open or based on location

//   useEffect(() => {
//     dispatch(fetchCategories());
//   }, [dispatch]);

//   const handleCategoryClick = (category: string) => {
//     dispatch(setCategoryFilter(category));
//     // Do NOT call toggleSidebar() here, as per new requirement
//   };

//   const handleProductsToggle = () => {
//     setIsProductsDropdownOpen(!isProductsDropdownOpen);
//   };

//   return (
//     <div
//       className={`
//         fixed md:relative
//         flex flex-col
//         h-screen
//         z-50
//         bg-white dark:bg-gray-800
//         text-gray-900 dark:text-white
//         border-r border-gray-200 dark:border-gray-700
//         transition-all duration-300 ease-in-out
//         ${
//           isCollapsed
//             ? "-translate-x-full md:translate-x-0 md:w-20"
//             : "translate-x-0 w-64"
//         }
//         shadow-lg md:shadow-none
//       `}
//     >
//       {/* Sidebar Header */}
//       <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
//         {!isCollapsed && (
//           <h1 className="text-xl font-bold dark:text-white mr-auto">
//             Fake Store
//           </h1>
//         )}
//         <button
//           onClick={toggleSidebar}
//           className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ${
//             isCollapsed ? "mx-auto" : ""
//           }`}
//           aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//         >
//           <BurgerIcon className="text-gray-900 dark:text-white" />
//         </button>
//       </div>

//       <nav className="flex-1 p-4 overflow-y-auto">
//         {/* Home Link - always navigate to /dashboard (which shows all products by default) */}
//         <Link
//           to="/dashboard"
//           onClick={() => handleCategoryClick("all")} // Reset filter to "all" when navigating to home/dashboard
//           className={`flex items-center p-3 rounded-md hover:bg-blue-100 dark:hover:bg-gray-700 transition duration-150
//             ${
//               selectedCategory === "all" &&
//               (location.pathname === "/dashboard" ||
//                 location.pathname === "/dashboard/")
//                 ? "bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300 font-semibold"
//                 : "text-gray-700 dark:text-white"
//             }`}
//         >
//           <span className="text-xl">🏠</span>
//           {!isCollapsed && <span className="ml-3">Home (All Products)</span>}
//         </Link>

//         {/* Products Section with Dropdown Toggle */}
//         <div className="mt-2">
//           <button
//             onClick={handleProductsToggle}
//             className={`flex items-center w-full text-left p-3 rounded-md hover:bg-blue-100 dark:hover:bg-gray-700 transition duration-150
//               ${
//                 location.pathname.startsWith("/dashboard") &&
//                 selectedCategory !== "all"
//                   ? "bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300 font-semibold"
//                   : "text-gray-700 dark:text-white"
//               }`}
//             aria-expanded={isProductsDropdownOpen}
//             aria-controls="products-categories-menu"
//           >
//             <span className="text-xl">🛍️</span>
//             {!isCollapsed && (
//               <>
//                 <span className="ml-3">Products</span>
//                 <CaretDownIcon isOpen={isProductsDropdownOpen} />{" "}
//                 {/* Caret icon */}
//               </>
//             )}
//           </button>

//           {/* Product Categories Dropdown */}
//           {!isCollapsed && isProductsDropdownOpen && (
//             <ul id="products-categories-menu" className="space-y-1 mt-1 pl-6">
//               {" "}
//               {/* Indentation here */}
//               {categories.map((category) => (
//                 <li key={category}>
//                   <button
//                     onClick={() => handleCategoryClick(category)}
//                     className={`flex items-center w-full text-left p-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150
//                       ${
//                         selectedCategory === category
//                           ? "bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300 font-semibold"
//                           : "text-gray-600 dark:text-gray-300"
//                       }`}
//                   >
//                     <span className="mr-2 text-lg">📁</span>{" "}
//                     {/* Generic folder/item icon */}
//                     <span className="capitalize">{category}</span>
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;

// // src/components/pages/sidebar.tsx
// import React, { useEffect } from "react"; // Added useEffect
// import { Link, useLocation } from "react-router-dom";
// import { useAppDispatch, useAppSelector } from "../../store/hooks"; // NEW: Import Redux hooks
// import {
//   fetchCategories,
//   setCategoryFilter,
// } from "../../feature/products/productsSlice"; // NEW: Import product slice actions

// // Simple burger icon for toggling (using inline SVG for broad compatibility)
// const BurgerIcon: React.FC = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className="h-6 w-6"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M4 6h16M4 12h16M4 18h16"
//     />
//   </svg>
// );

// interface SidebarProps {
//   isCollapsed: boolean;
//   toggleSidebar: () => void;
// }

// /**
//  * Sidebar component for navigation and category filtering.
//  * Features collapse/expand functionality and links to different sections of the dashboard.
//  * Product categories are now clickable items that filter the ProductsPage via Redux.
//  */
// const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
//   const location = useLocation();
//   const dispatch = useAppDispatch();
//   // Get categories and the currently selected category from Redux
//   const { categories, selectedCategory } = useAppSelector(
//     (state) => state.products
//   );

//   // Fetch categories when the sidebar mounts
//   useEffect(() => {
//     dispatch(fetchCategories());
//   }, [dispatch]);

//   const handleCategoryClick = (category: string) => {
//     dispatch(setCategoryFilter(category));
//     // Optionally close sidebar on mobile after selection
//     if (!isCollapsed) {
//       toggleSidebar();
//     }
//   };

//   return (
//     <div
//       className={`
//         fixed md:relative
//         flex flex-col
//         h-screen
//         z-50
//         bg-white dark:bg-gray-800
//         text-gray-900 dark:text-white
//         border-r border-gray-200 dark:border-gray-700
//         transition-all duration-300 ease-in-out
//         ${
//           isCollapsed
//             ? "-translate-x-full md:translate-x-0 md:w-20"
//             : "translate-x-0 w-64"
//         }
//         shadow-lg md:shadow-none
//       `}
//     >
//       {/* Sidebar Header */}
//       <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
//         {!isCollapsed && (
//           <h1 className="text-xl font-bold dark:text-white mr-auto">
//             Fake Store
//           </h1>
//         )}
//         <button
//           onClick={toggleSidebar}
//           className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ${
//             isCollapsed ? "mx-auto" : ""
//           }`}
//           aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//         >
//           <BurgerIcon className="text-gray-900 dark:text-white" />
//         </button>
//       </div>

//       <nav className="flex-1 p-4 overflow-y-auto">
//         {/* Home Link - always navigate to /dashboard (which shows all products by default) */}
//         <Link
//           to="/dashboard"
//           onClick={() => handleCategoryClick("all")} // Reset filter to "all" when navigating to home/dashboard
//           className={`flex items-center p-3 rounded-md hover:bg-blue-100 dark:hover:bg-gray-700 transition duration-150
//             ${
//               selectedCategory === "all" &&
//               (location.pathname === "/dashboard" ||
//                 location.pathname === "/dashboard/")
//                 ? "bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300 font-semibold"
//                 : "text-gray-700 dark:text-white"
//             }`}
//         >
//           <span className="text-xl">🏠</span>
//           {!isCollapsed && <span className="ml-3">Home (All Products)</span>}
//         </Link>

//         {/* Product Categories */}
//         <h3
//           className={`text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 mt-4 mb-2 ${
//             isCollapsed ? "sr-only" : ""
//           }`}
//         >
//           Categories
//         </h3>
//         <ul className="space-y-1">
//           {categories.map((category) => (
//             <li key={category}>
//               <button
//                 onClick={() => handleCategoryClick(category)}
//                 className={`flex items-center w-full text-left p-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150
//                   ${
//                     selectedCategory === category
//                       ? "bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300 font-semibold"
//                       : "text-gray-600 dark:text-gray-300"
//                   }`}
//               >
//                 <span className="mr-2 text-lg">🛍️</span>{" "}
//                 {/* Generic icon, could be category specific */}
//                 {!isCollapsed && <span className="capitalize">{category}</span>}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;

// // src/components/layout/Sidebar.tsx
// import React from "react";
// import { Link, useLocation } from "react-router-dom";

// // Simple burger icon for toggling (using inline SVG for broad compatibility)
// const BurgerIcon: React.FC = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     className="h-6 w-6"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth={2}
//       d="M4 6h16M4 12h16M4 18h16"
//     />
//   </svg>
// );

// interface SidebarProps {
//   isCollapsed: boolean;
//   toggleSidebar: () => void;
// }

// /**
//  * Sidebar component for navigation.
//  * Features collapse/expand functionality and links to different sections of the dashboard.
//  * Product categories are presented as clickable items that would ideally filter the ProductsPage.
//  */
// const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
//   const location = useLocation();

//   return (
//     <div
//       className={`
//         fixed md:relative
//         flex flex-col
//         h-screen
//         z-50
//         bg-white dark:bg-gray-800
//         text-gray-900 dark:text-white
//         border-r border-gray-200 dark:border-gray-700
//         transition-all duration-300 ease-in-out
//         ${
//           isCollapsed
//             ? "-translate-x-full md:translate-x-0 md:w-20"
//             : "translate-x-0 w-64"
//         }
//         shadow-lg md:shadow-none
//       `}
//     >
//       {/* Sidebar Header */}
//       <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
//         {!isCollapsed && (
//           <h1 className="text-xl font-bold dark:text-white mr-auto">
//             Fake Store
//           </h1>
//         )}
//         <button
//           onClick={toggleSidebar}
//           className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ${
//             isCollapsed ? "mx-auto" : ""
//           }`}
//           aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//         >
//           <BurgerIcon className="text-gray-900 dark:text-white" />
//         </button>
//       </div>

//       <nav className="flex-1 p-4 overflow-y-auto">
//         {/* User Profile Section (Optional, can be added later if user info is available) */}
//         {/*
//         {!isCollapsed && (
//           <div className="mb-4 text-center">
//             <div className="flex items-center justify-center">
//               <img
//                 alt="profile-user"
//                 width="80px"
//                 height="80px"
//                 src="https://placehold.co/80x80/007bff/ffffff?text=User"
//                 className="rounded-full border-2 border-blue-500 shadow-md"
//               />
//             </div>
//             <h2 className="text-lg font-semibold text-gray-700 dark:text-white mt-2">
//               John Doe
//             </h2>
//           </div>
//         )}
//         */}

//         <div className="space-y-2">
//           {/* Home Link */}
//           <Link
//             to="/dashboard"
//             className={`flex items-center p-3 rounded-md hover:bg-blue-100 dark:hover:bg-gray-700 transition duration-150
//               ${
//                 location.pathname === "/dashboard"
//                   ? "bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300 font-semibold"
//                   : "text-gray-700 dark:text-white"
//               }`}
//           >
//             <span className="text-xl">🏠</span>
//             {!isCollapsed && <span className="ml-3">Home</span>}
//           </Link>

//           {/* Products Section */}
//           <div>
//             <Link
//               to="/dashboard/products"
//               className={`flex items-center p-3 rounded-md hover:bg-blue-100 dark:hover:bg-gray-700 transition duration-150
//                 ${
//                   location.pathname.startsWith("/dashboard/products")
//                     ? "bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-blue-300 font-semibold"
//                     : "text-gray-700 dark:text-white"
//                 }`}
//             >
//               <span className="text-xl">🛍️</span>
//               {!isCollapsed && <span className="ml-3">Products</span>}
//             </Link>

//             {/* Product Categories (these would ideally trigger filters on the ProductsPage) */}
//             {!isCollapsed && (
//               <ul className="ml-6 mt-2 space-y-1">
//                 {/* These could be Link components if you had separate routes for categories,
//                     but given your `ProductFiltersProps`, they are likely for filtering on ProductsPage */}
//                 <li>
//                   <a
//                     href="#" // Use onClick event to trigger filter, or pass a category ID to ProductsPage
//                     className="flex items-center p-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
//                     onClick={(e) => {
//                       e.preventDefault(); /* Implement filter for Electronics */
//                     }}
//                   >
//                     <span className="mr-2 text-lg">💡</span> Electronics
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="flex items-center p-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
//                     onClick={(e) => {
//                       e.preventDefault(); /* Implement filter for Jewelery */
//                     }}
//                   >
//                     <span className="mr-2 text-lg">💎</span> Jewellery
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="flex items-center p-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
//                     onClick={(e) => {
//                       e.preventDefault(); /* Implement filter for Men's Clothing */
//                     }}
//                   >
//                     <span className="mr-2 text-lg">👔</span> Men's Clothing
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="#"
//                     className="flex items-center p-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
//                     onClick={(e) => {
//                       e.preventDefault(); /* Implement filter for Women's Clothing */
//                     }}
//                   >
//                     <span className="mr-2 text-lg">👗</span> Women's Clothing
//                   </a>
//                 </li>
//               </ul>
//             )}
//           </div>
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;
