import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ProductPage from "../pages/ProductPage";
import PerfumesPage from "../pages/PerfumesPage";
import CartPage from "../pages/CartPage";
import LoginPage from "../pages/LoginPage";
import { ScrollToTop } from "./ScrollToTop";
import { CartProvider } from "../context/CartContext";
import { AuthProvider, useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  return children;
};

const HomeRouter = () => {
  const { user } = useAuth();
  if (user?.role === 'basic_role') {
    return <Navigate to="/perfumes" />;
  }
  return <HomePage />;
};

export default function App() {
  return (
    <AuthProvider>                                      
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <HomeRouter />
              </ProtectedRoute>
            } />
            <Route path="/perfumes" element={
              <ProtectedRoute>
                <PerfumesPage />
              </ProtectedRoute>
            } />
            <Route path="/producto/:id" element={
              <ProtectedRoute>
                <ProductPage />
              </ProtectedRoute>
            } />
            <Route path="/cart" element={
              <ProtectedRoute allowedRoles={['admin_role', 'sales_role', 'basic_role']}>
                <CartPage />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}