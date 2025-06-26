import React, { useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../components/pages/Dashboard";
import { LoginPage } from "../feature/auth/AuthViews";
import {
  ProductDetailPage,
  ProductsPage,
} from "../feature/products/ProductViews";
export const AppRoutes: React.FC = () => {
  const routes = useMemo(
    () => [
      { path: "/", element: <LoginPage /> },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <ProductsPage /> },
          { path: "products/:id", element: <ProductDetailPage /> },
        ],
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
    []
  );

  return <Routes>{routes.map(renderRoute)}</Routes>;
};

function renderRoute(route: any, index: number) {
  return (
    <Route key={index} path={route.path} element={route.element}>
      {route.children?.map((child: any, childIndex: number) => (
        <Route
          key={childIndex}
          index={child.index}
          path={child.path}
          element={child.element}
        />
      ))}
    </Route>
  );
}
