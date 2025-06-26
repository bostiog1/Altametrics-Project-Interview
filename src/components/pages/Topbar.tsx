// src/components/pages/topbar.tsx
import type { RefObject } from "react"; // NEW: Import RefObject
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setSortBy } from "../../feature/products/productsSlice";

// Import icons from react-icons/fa
import {
  FaBars, // For the burger menu
  FaSearch, // For the search icon (loupe)
} from "react-icons/fa";

interface TopbarProps {
  toggleSidebar: () => void; // Function to open/close the sidebar
  topbarBurgerRef: RefObject<HTMLButtonElement>; // Ref for the topbar burger button
}

/**
 * Topbar component for the dashboard layout.
 * Includes a search bar, sidebar toggle, and interactive sorting buttons.
 * Uses Font Awesome icons.
 */
const Topbar: React.FC<TopbarProps> = ({ toggleSidebar, topbarBurgerRef }) => {
  const dispatch = useAppDispatch();
  const { sortBy } = useAppSelector((state) => state.products); // Get current sort state

  /**
   * Handles clicking the Price sort button.
   * Cycles through: None -> Price Low to High -> Price High to Low -> None
   */
  const handleSortByPrice = () => {
    if (sortBy === "priceAsc") {
      dispatch(setSortBy("priceDesc"));
    } else if (sortBy === "priceDesc") {
      dispatch(setSortBy("none"));
    } else {
      dispatch(setSortBy("priceAsc"));
    }
  };

  /**
   * Handles clicking the Rating sort button.
   * Cycles through: None -> Rating Low to High -> Rating High to Low -> None
   */
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
      {/* Top Section: Burger menu, Search bar */}
      <div className="flex w-full justify-start items-center mb-3 md:mb-4">
        {" "}
        {/* Align items to start */}
        {/* Burger menu button */}
        <button
          ref={topbarBurgerRef} // Apply ref here
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 mr-3"
          aria-label="Toggle sidebar"
        >
          <FaBars className="text-gray-900 dark:text-white" />
        </button>
        {/* Search Bar with Loupe Icon */}
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
      </div>

      {/* Bottom Section: Sorting buttons */}
      <div className="flex items-center space-x-4 w-full justify-center md:justify-start">
        {" "}
        {/* Align items to start */}
        <span className="text-md text-gray-700 dark:text-gray-300">
          Sort by:
        </span>
        <button
          onClick={handleSortByPrice}
          className={`
            py-2 px-4 rounded-md transition duration-200 shadow-sm font-semibold
            ${
              isPriceActive
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
        >
          Price {isPriceActive && (sortBy === "priceAsc" ? "▲" : "▼")}
        </button>
        <button
          onClick={handleSortByRating}
          className={`
            py-2 px-4 rounded-md transition duration-200 shadow-sm font-semibold
            ${
              isRatingActive
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
        >
          Rating {isRatingActive && (sortBy === "ratingAsc" ? "▲" : "▼")}
        </button>
      </div>
    </header>
  );
};

export default Topbar;

// // src/components/pages/topbar.tsx
// import React from "react";
// import { useAppDispatch, useAppSelector } from "../../store/hooks";
// import { setSortBy } from "../../feature/products/productsSlice";

// // Import icons from react-icons/fa
// import {
//   FaBars, // For the burger menu
//   FaSearch, // For the search icon (loupe)
// } from "react-icons/fa";

// interface TopbarProps {
//   toggleSidebar: () => void;
// }

// /**
//  * Topbar component for the dashboard layout.
//  * Includes a search bar, sidebar toggle, and interactive sorting buttons.
//  * Uses Font Awesome icons.
//  */
// const Topbar: React.FC<TopbarProps> = ({ toggleSidebar }) => {
//   const dispatch = useAppDispatch();
//   const { sortBy } = useAppSelector((state) => state.products); // Get current sort state

//   /**
//    * Handles clicking the Price sort button.
//    * Cycles through: None -> Price Low to High -> Price High to Low -> None
//    */
//   const handleSortByPrice = () => {
//     if (sortBy === "priceAsc") {
//       dispatch(setSortBy("priceDesc"));
//     } else if (sortBy === "priceDesc") {
//       dispatch(setSortBy("none"));
//     } else {
//       dispatch(setSortBy("priceAsc"));
//     }
//   };

//   /**
//    * Handles clicking the Rating sort button.
//    * Cycles through: None -> Rating Low to High -> Rating High to Low -> None
//    */
//   const handleSortByRating = () => {
//     if (sortBy === "ratingAsc") {
//       dispatch(setSortBy("ratingDesc"));
//     } else if (sortBy === "ratingDesc") {
//       dispatch(setSortBy("none"));
//     } else {
//       dispatch(setSortBy("ratingAsc"));
//     }
//   };

//   const isPriceActive = sortBy.startsWith("price");
//   const isRatingActive = sortBy.startsWith("rating");

//   return (
//     <header className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 flex flex-col justify-center items-center shadow-md">
//       {/* Top Section: Burger menu, Search bar */}
//       <div className="flex w-full justify-between items-center mb-3 md:mb-4">
//         {/* Burger menu button for mobile */}
//         <button
//           onClick={toggleSidebar}
//           className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 mr-3"
//           aria-label="Toggle sidebar"
//         >
//           <FaBars className="text-gray-900 dark:text-white" />
//         </button>

//         {/* Search Bar with Loupe Icon */}
//         <div className="relative flex-grow mx-2 md:mx-4">
//           <input
//             type="text"
//             placeholder="Search products..."
//             className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
//             aria-label="Search products"
//           />
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <FaSearch className="text-gray-500 dark:text-gray-400" />
//           </div>
//         </div>
//       </div>

//       {/* Bottom Section: Sorting buttons */}
//       <div className="flex items-center space-x-4 w-full justify-center md:justify-start">
//         <span className="text-md text-gray-700 dark:text-gray-300">
//           Sort by:
//         </span>
//         <button
//           onClick={handleSortByPrice}
//           className={`
//             py-2 px-4 rounded-md transition duration-200 shadow-sm font-semibold
//             ${
//               isPriceActive
//                 ? "bg-blue-600 text-white hover:bg-blue-700"
//                 : "bg-blue-500 text-white hover:bg-blue-600"
//             }`}
//         >
//           Price {isPriceActive && (sortBy === "priceAsc" ? "▲" : "▼")}
//         </button>
//         <button
//           onClick={handleSortByRating}
//           className={`
//             py-2 px-4 rounded-md transition duration-200 shadow-sm font-semibold
//             ${
//               isRatingActive
//                 ? "bg-blue-600 text-white hover:bg-blue-700"
//                 : "bg-blue-500 text-white hover:bg-blue-600"
//             }`}
//         >
//           Rating {isRatingActive && (sortBy === "ratingAsc" ? "▲" : "▼")}
//         </button>
//       </div>
//     </header>
//   );
// };

// export default Topbar;

// // src/components/pages/topbar.tsx
// import React from "react";
// import { useAppDispatch, useAppSelector } from "../../store/hooks";
// import { logout } from "../../feature/auth/authSlice";
// import { setSortBy } from "../../feature/products/productsSlice"; // Still dispatching sort directly to Redux

// // Simple burger icon for toggling (using inline SVG)
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

// interface TopbarProps {
//   toggleSidebar: () => void;
// }

// /**
//  * Topbar component for the dashboard layout.
//  * Includes a search bar, sidebar toggle, logout button, and new interactive sorting buttons.
//  */
// const Topbar: React.FC<TopbarProps> = ({ toggleSidebar }) => {
//   const dispatch = useAppDispatch();
//   const { sortBy } = useAppSelector((state) => state.products); // Get current sort state

//   /**
//    * Dispatches the logout action.
//    */
//   const handleLogout = () => {
//     dispatch(logout());
//   };

//   /**
//    * Handles clicking the Price sort button.
//    * Cycles through: None -> Price Low to High -> Price High to Low -> None
//    */
//   const handleSortByPrice = () => {
//     if (sortBy === "priceAsc") {
//       dispatch(setSortBy("priceDesc"));
//     } else if (sortBy === "priceDesc") {
//       dispatch(setSortBy("none"));
//     } else {
//       dispatch(setSortBy("priceAsc"));
//     }
//   };

//   /**
//    * Handles clicking the Rating sort button.
//    * Cycles through: None -> Rating Low to High -> Rating High to Low -> None
//    */
//   const handleSortByRating = () => {
//     if (sortBy === "ratingAsc") {
//       dispatch(setSortBy("ratingDesc"));
//     } else if (sortBy === "ratingDesc") {
//       dispatch(setSortBy("none"));
//     } else {
//       dispatch(setSortBy("ratingAsc"));
//     }
//   };

//   const isPriceActive = sortBy.startsWith("price");
//   const isRatingActive = sortBy.startsWith("rating");

//   return (
//     <header className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 flex flex-col md:flex-row justify-between items-center shadow-md">
//       {/* Top row: Burger menu, Search bar, Logout button */}
//       <div className="flex w-full md:w-auto justify-between items-center mb-4 md:mb-0">
//         {/* Burger menu button for mobile */}
//         <button
//           onClick={toggleSidebar}
//           className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 mr-3"
//           aria-label="Toggle sidebar"
//         >
//           <BurgerIcon className="text-gray-900 dark:text-white" />
//         </button>

//         {/* Placeholder for Search Bar */}
//         <div className="flex-grow mx-2 md:mx-4">
//           <input
//             type="text"
//             placeholder="Search products..."
//             className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
//             aria-label="Search products"
//           />
//         </div>

//         {/* Logout button */}
//         <div>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 shadow-sm"
//           >
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* Bottom row (only visible on larger screens or extended topbar): Sorting buttons */}
//       <div className="flex items-center space-x-4 w-full md:w-auto justify-center md:justify-end">
//         <span className="text-md text-gray-700 dark:text-gray-300">
//           Sort by:
//         </span>
//         <button
//           onClick={handleSortByPrice}
//           className={`
//             py-2 px-4 rounded-md transition duration-200 shadow-sm font-semibold
//             ${
//               isPriceActive
//                 ? "bg-blue-600 text-white hover:bg-blue-700"
//                 : "bg-blue-500 text-white hover:bg-blue-600"
//             }`}
//         >
//           Price {isPriceActive && (sortBy === "priceAsc" ? "▲" : "▼")}
//         </button>
//         <button
//           onClick={handleSortByRating}
//           className={`
//             py-2 px-4 rounded-md transition duration-200 shadow-sm font-semibold
//             ${
//               isRatingActive
//                 ? "bg-blue-600 text-white hover:bg-blue-700"
//                 : "bg-blue-500 text-white hover:bg-blue-600"
//             }`}
//         >
//           Rating {isRatingActive && (sortBy === "ratingAsc" ? "▲" : "▼")}
//         </button>
//       </div>
//     </header>
//   );
// };

// export default Topbar;

// // src/components/pages/topbar.tsx
// import React from "react";
// import { useAppDispatch, useAppSelector } from "../../store/hooks"; // Corrected path
// import { logout } from "../../feature/auth/authSlice"; // Corrected path
// import { setSortBy } from "../../feature/products/productsSlice"; // NEW: Import setSortBy

// // Simple burger icon for toggling (using inline SVG)
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

// interface TopbarProps {
//   toggleSidebar: () => void;
// }

// /**
//  * Topbar component for the dashboard layout.
//  * Includes app title, sidebar toggle, logout button, and product sorting options.
//  */
// const Topbar: React.FC<TopbarProps> = ({ toggleSidebar }) => {
//   const dispatch = useAppDispatch();
//   const { sortBy } = useAppSelector((state) => state.products); // Get current sort state

//   /**
//    * Dispatches the logout action.
//    */
//   const handleLogout = () => {
//     dispatch(logout());
//   };

//   /**
//    * Handles changes in the sort dropdown.
//    */
//   const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     dispatch(
//       setSortBy(
//         e.target.value as
//           | "priceAsc"
//           | "priceDesc"
//           | "ratingAsc"
//           | "ratingDesc"
//           | "none"
//       )
//     );
//   };

//   return (
//     <header className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 flex justify-between items-center shadow-md">
//       {/* Left section: Burger icon and App Title */}
//       <div className="flex items-center">
//         {/* Burger menu button for mobile */}
//         <button
//           onClick={toggleSidebar}
//           className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 mr-3"
//           aria-label="Toggle sidebar"
//         >
//           <BurgerIcon className="text-gray-900 dark:text-white" />
//         </button>
//         <h1 className="text-2xl font-bold">Fake Store</h1>
//       </div>

//       {/* Center section: Sorting options (now a select dropdown) */}
//       <div className="flex items-center space-x-2">
//         <label
//           htmlFor="sort-by"
//           className="text-md text-gray-700 dark:text-gray-300 hidden sm:block"
//         >
//           Sort by:
//         </label>
//         <select
//           id="sort-by"
//           value={sortBy}
//           onChange={handleSortChange}
//           className="border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
//         >
//           <option value="none">None</option>
//           <option value="priceAsc">Price: Low to High</option>
//           <option value="priceDesc">Price: High to Low</option>
//           <option value="ratingAsc">Rating: Low to High</option>
//           <option value="ratingDesc">Rating: High to Low</option>
//         </select>
//       </div>

//       {/* Right section: Logout button */}
//       <div>
//         <button
//           onClick={handleLogout}
//           className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 shadow-sm"
//         >
//           Logout
//         </button>
//       </div>
//     </header>
//   );
// };

// export default Topbar;

// // src/components/layout/Topbar.tsx
// import React from "react";
// import { useAppDispatch } from "../../store/hooks"; // Assuming this hook provides dispatch
// import { logout } from "../../feature/auth/authSlice"; // Import logout action

// // Simple burger icon for toggling (using inline SVG)
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

// interface TopbarProps {
//   toggleSidebar: () => void;
// }

// /**
//  * Topbar component for the dashboard layout.
//  * Includes app title, sidebar toggle, logout button, and product sorting options.
//  */
// const Topbar: React.FC<TopbarProps> = ({ toggleSidebar }) => {
//   const dispatch = useAppDispatch();

//   /**
//    * Dispatches the logout action.
//    */
//   const handleLogout = () => {
//     dispatch(logout());
//   };

//   /**
//    * Placeholder function for sorting by price.
//    * In a real app, this would dispatch a Redux action or update context to sort products.
//    */
//   const handleSortByPrice = () => {
//     console.log("Sort by Price clicked");
//     // Implement actual sorting logic here (e.g., dispatch an action)
//   };

//   /**
//    * Placeholder function for sorting by rating.
//    * In a real app, this would dispatch a Redux action or update context to sort products.
//    */
//   const handleSortByRating = () => {
//     console.log("Sort by Rating clicked");
//     // Implement actual sorting logic here (e.g., dispatch an action)
//   };

//   return (
//     <header className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 flex justify-between items-center shadow-md">
//       {/* Left section: Burger icon and App Title */}
//       <div className="flex items-center">
//         {/* Burger menu button for mobile */}
//         <button
//           onClick={toggleSidebar}
//           className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 mr-3"
//           aria-label="Toggle sidebar"
//         >
//           <BurgerIcon className="text-gray-900 dark:text-white" />
//         </button>
//         <h1 className="text-2xl font-bold">Fake Store</h1>
//       </div>

//       {/* Center section: Sorting options */}
//       <div className="flex items-center space-x-4">
//         <span className="text-md text-gray-700 dark:text-gray-300 hidden sm:block">
//           Sort by:
//         </span>
//         <button
//           onClick={handleSortByPrice}
//           className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 shadow-sm"
//         >
//           Price
//         </button>
//         <button
//           onClick={handleSortByRating}
//           className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 shadow-sm"
//         >
//           Rating
//         </button>
//       </div>

//       {/* Right section: Logout button */}
//       <div>
//         <button
//           onClick={handleLogout}
//           className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 shadow-sm"
//         >
//           Logout
//         </button>
//       </div>
//     </header>
//   );
// };

// export default Topbar;
