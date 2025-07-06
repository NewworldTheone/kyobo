import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';
import ProductsPage from './ProductsPage';
import ProductDetailPage from './ProductDetailPage';
import ProductNewPage from './ProductNewPage';
import ProductBulkUploadPage from './ProductBulkUploadPage';
import ProductAdjustInventoryPage from './ProductAdjustInventoryPage';
import ProductMoveLocationPage from './ProductMoveLocationPage';
import BarcodeScannerPage from './BarcodeScannerPage';
import AdminDashboardPage from './AdminDashboardPage';
import ReportsPage from './ReportsPage';
import SettingsPage from './SettingsPage';
import AIInsightsPage from './AIInsightsPage';
import Layout from './Layout';
import NotFoundPage from './NotFoundPage';

// 인증이 필요한 라우트를 위한 래퍼 컴포넌트
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// 인증이 필요없는 라우트를 위한 래퍼 컴포넌트
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardPage />} />
        <Route path="barcode" element={<BarcodeScannerPage />} />
        <Route path="products">
          <Route index element={<ProductsPage />} />
          <Route path="new" element={<ProductNewPage />} />
          <Route path="bulk-upload" element={<ProductBulkUploadPage />} />
          <Route path=":id" element={<ProductDetailPage />} />
          <Route path=":id/adjust" element={<ProductAdjustInventoryPage />} />
          <Route path=":id/move" element={<ProductMoveLocationPage />} />
        </Route>
        <Route path="admin" element={<AdminDashboardPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="ai-insights" element={<AIInsightsPage />} />
              <Route path="settings" element={<SettingsPage />} />
      </Route>
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return <AppRoutes />;
}
