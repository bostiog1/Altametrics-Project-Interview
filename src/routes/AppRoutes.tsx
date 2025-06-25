// src/routes/AppRoutes.tsx
import React, { useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Import your page components (paths checked against src/routes/)
import { LoginPage } from "../feature/auth/AuthViews";
import {
  ProductsPage,
  ProductDetailPage,
} from "../feature/products/ProductViews";

// Import layout and common components (paths checked against src/routes/)
import ProtectedRoute from "./ProtectedRoute"; // ProtectedRoute is in src/routes/
import Dashboard from "../components/pages/Dashboard"; // Dashboard is in src/components/pages/

/**
 * Defines all application routes.
 * Uses a memoized array for performance and clarity.
 * Protects routes using the ProtectedRoute component and nested routes within Dashboard.
 */
export const AppRoutes: React.FC = () => {
  const routes = useMemo(
    () => [
      { path: "/", element: <LoginPage /> },
      {
        path: "/dashboard/*", // Use /* for nested routes within the Dashboard
        element: (
          <ProtectedRoute>
            <Dashboard /> {/* Dashboard will render Outlet for its children */}
          </ProtectedRoute>
        ),
        children: [
          { path: "", element: <ProductsPage /> }, // Default child route for /dashboard is ProductsPage
          { path: "products/:id", element: <ProductDetailPage /> }, // Correct: /dashboard/products/:id for detail
          // You can add more dashboard-specific routes here if needed in the future
          // e.g., { path: 'profile', element: <ProfilePage /> },
        ],
      },
      { path: "*", element: <Navigate to="/" replace /> }, // Catch-all for undefined routes
    ],
    []
  );

  return (
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element}>
          {route.children?.map((child, childIndex) => (
            <Route key={childIndex} path={child.path} element={child.element} />
          ))}
        </Route>
      ))}
    </Routes>
  );
};
