import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes'; // Updated import path: AppRoutes will now be in src/routes/

/**
 * Main application component.
 * Sets up the React Router for navigation.
 */
const App: React.FC = () => {
  return (
    <Router>
      <AppRoutes /> {/* All routing logic is now encapsulated in AppRoutes */}
    </Router>
  );
};

export default App;


// // src/App.tsx
// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { useAppSelector, useAppDispatch } from "./store/hooks";
// import { logout } from "./feature/auth/authSlice"; // Import logout action

// // Import LoginPage from AuthViews
// import { LoginPage } from "./feature/auth/AuthViews";
// // Import ProductsPage from ProductViews
// import {
//   ProductsPage,
//   ProductDetailPage,
// } from "./feature/products/ProductViews";
// // ProductDetailPage will be imported later in a bonus phase
// // import { ProductDetailPage } from './features/products/ProductViews';

// // A simple component to protect routes, checks if a token exists
// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const { token } = useAppSelector((state) => state.auth);
//   const dispatch = useAppDispatch(); // Use dispatch for logout

//   const handleLogout = () => {
//     dispatch(logout()); // Dispatch the logout action
//   };

//   if (!token) {
//     return <Navigate to="/" replace />;
//   }
//   return (
//     <div className="min-h-screen flex flex-col">
//       <header className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-md">
//         <h1 className="text-2xl font-bold">Fake Store</h1>
//         <button
//           onClick={handleLogout} // Call handleLogout on click
//           className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
//         >
//           Logout
//         </button>
//       </header>
//       <main className="flex-grow">{children}</main>
//     </div>
//   );
// };

// const App: React.FC = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />

//         <Route
//           path="/products"
//           element={
//             <ProtectedRoute>
//               <ProductsPage />
//             </ProtectedRoute>
//           }
//         />

//         {/* NEW: Activated Protected route for a single product detail page */}
//         <Route
//           path="/products/:id"
//           element={
//             <ProtectedRoute>
//               <ProductDetailPage />{" "}
//               {/* <-- NEW: Render ProductDetailPage here */}
//             </ProtectedRoute>
//           }
//         />

//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;
