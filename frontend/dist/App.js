import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
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
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) {
        return _jsx("div", { children: "Loading..." });
    }
    return isAuthenticated ? _jsx(_Fragment, { children: children }) : _jsx(Navigate, { to: "/login" });
};
// 인증이 필요없는 라우트를 위한 래퍼 컴포넌트
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) {
        return _jsx("div", { children: "Loading..." });
    }
    return !isAuthenticated ? _jsx(_Fragment, { children: children }) : _jsx(Navigate, { to: "/" });
};
function AppRoutes() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(PublicRoute, { children: _jsx(LoginPage, {}) }) }), _jsxs(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(Layout, {}) }), children: [_jsx(Route, { index: true, element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "barcode", element: _jsx(BarcodeScannerPage, {}) }), _jsxs(Route, { path: "products", children: [_jsx(Route, { index: true, element: _jsx(ProductsPage, {}) }), _jsx(Route, { path: "new", element: _jsx(ProductNewPage, {}) }), _jsx(Route, { path: "bulk-upload", element: _jsx(ProductBulkUploadPage, {}) }), _jsx(Route, { path: ":id", element: _jsx(ProductDetailPage, {}) }), _jsx(Route, { path: ":id/adjust", element: _jsx(ProductAdjustInventoryPage, {}) }), _jsx(Route, { path: ":id/move", element: _jsx(ProductMoveLocationPage, {}) })] }), _jsx(Route, { path: "admin", element: _jsx(AdminDashboardPage, {}) }), _jsx(Route, { path: "reports", element: _jsx(ReportsPage, {}) }), _jsx(Route, { path: "ai-insights", element: _jsx(AIInsightsPage, {}) }), _jsx(Route, { path: "settings", element: _jsx(SettingsPage, {}) })] }), _jsx(Route, { path: "*", element: _jsx(NotFoundPage, {}) })] }));
}
export default function App() {
    return _jsx(AppRoutes, {});
}
