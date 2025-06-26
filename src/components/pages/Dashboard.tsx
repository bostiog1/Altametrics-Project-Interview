// src/components/layout/Dashboard.tsx
import React, { useState, useRef, useEffect } from "react"; // Added useRef, useEffect
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar"; // Import the Sidebar component
import Topbar from "./Topbar"; // Import the Topbar component

/**
 * Dashboard layout component.
 * Provides a responsive layout with an overlay sidebar and a top navigation bar.
 * The main content area renders nested routes via the <Outlet /> component.
 */
const Dashboard: React.FC = () => {
  // State to manage the open/closed state of the sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Changed from isCollapsed, default to false (closed)

  // Refs for the sidebar div and the topbar's burger button
  const sidebarRef = useRef<HTMLDivElement>(null);
  const topbarBurgerRef = useRef<HTMLButtonElement>(null);

  /**
   * Toggles the sidebar's open state.
   */
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  /**
   * Explicitly closes the sidebar.
   */
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Effect to handle clicks outside the sidebar or the topbar burger button
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If sidebar is open
      // AND the click is outside the sidebar element itself
      // AND the click is NOT on the topbar's burger button (to prevent immediate close after opening)
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        topbarBurgerRef.current &&
        !topbarBurgerRef.current.contains(event.target as Node)
      ) {
        closeSidebar(); // Close the sidebar
      }
    };

    // Add event listener only when the sidebar is open
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up the event listener when the component unmounts or sidebar closes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]); // Re-run effect when sidebar's open state changes

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-sans">
      {/* Sidebar component */}
      <Sidebar
        isSidebarOpen={isSidebarOpen} // Pass the open state
        closeSidebar={closeSidebar} // Pass the close function for the 'X' button
        sidebarRef={sidebarRef} // Pass the ref for click-outside detection
      />

      {/* Main content area - no margin shift as sidebar overlays */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar component */}
        <Topbar
          toggleSidebar={toggleSidebar} // Topbar uses this to open the sidebar
          topbarBurgerRef={topbarBurgerRef} // Pass the ref for click-outside detection
        />

        {/* Removed the fixed overlay div - the useEffect handles closing on outside clicks */}

        {/* Main content scrollable area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

// // src/components/layout/Dashboard.tsx
// import React, { useState } from "react";
// import { Outlet } from "react-router-dom"; // Used to render nested routes

// import Sidebar from "./Sidebar"; // Import the Sidebar component
// import Topbar from "./Topbar"; // Import the Topbar component

// /**
//  * Dashboard layout component.
//  * Provides a responsive layout with a collapsible sidebar and a top navigation bar.
//  * The main content area renders nested routes via the <Outlet /> component.
//  */
// const Dashboard: React.FC = () => {
//   // State to manage the collapsed/expanded state of the sidebar
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   /**
//    * Toggles the sidebar's collapsed state.
//    */
//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   return (
//     <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-sans">
//       {/* Sidebar component */}
//       <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

//       {/* Overlay for mobile view when sidebar is open */}
//       {!isCollapsed && (
//         <div
//           className="fixed inset-0 bg-black/50 md:hidden z-40"
//           onClick={toggleSidebar} // Close sidebar when overlay is clicked
//         />
//       )}

//       {/* Main content area */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Topbar component */}
//         <Topbar toggleSidebar={toggleSidebar} />

//         {/* Main content scrollable area */}
//         <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
//           <Outlet />{" "}
//           {/* Renders the nested route components (e.g., ProductsPage, ProductDetailPage) */}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
