import React, { useState, useRef, useEffect } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const topbarBurgerRef = useRef<HTMLButtonElement>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        topbarBurgerRef.current &&
        !topbarBurgerRef.current.contains(event.target as Node)
      ) {
        closeSidebar();
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-sans">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        closeSidebar={closeSidebar}
        sidebarRef={sidebarRef as React.RefObject<HTMLDivElement>}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          toggleSidebar={toggleSidebar}
          topbarBurgerRef={
            topbarBurgerRef as React.RefObject<HTMLButtonElement>
          }
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
