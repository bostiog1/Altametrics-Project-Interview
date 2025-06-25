// src/components/layout/Dashboard.tsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom"; // Used to render nested routes

import Sidebar from "./Sidebar"; // Import the Sidebar component
import Topbar from "./Topbar"; // Import the Topbar component

/**
 * Dashboard layout component.
 * Provides a responsive layout with a collapsible sidebar and a top navigation bar.
 * The main content area renders nested routes via the <Outlet /> component.
 */
const Dashboard: React.FC = () => {
  // State to manage the collapsed/expanded state of the sidebar
  const [isCollapsed, setIsCollapsed] = useState(false);

  /**
   * Toggles the sidebar's collapsed state.
   */
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white font-sans">
      {/* Sidebar component */}
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

      {/* Overlay for mobile view when sidebar is open */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={toggleSidebar} // Close sidebar when overlay is clicked
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar component */}
        <Topbar toggleSidebar={toggleSidebar} />

        {/* Main content scrollable area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />{" "}
          {/* Renders the nested route components (e.g., ProductsPage, ProductDetailPage) */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
