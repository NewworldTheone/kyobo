import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { NavLink } from 'react-router-dom';
import { BarChart3, Package, Settings, FileText, MoveRight, Upload, Scan, UserCog, Brain, X } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
const Sidebar = ({ isOpen, onClose }) => {
    const { user } = useAuth();
    return (_jsxs(_Fragment, { children: [isOpen && (_jsx("div", { className: "fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden", onClick: onClose })), _jsxs("aside", { className: `
        fixed md:static inset-y-0 left-0 z-50 md:z-auto
        flex flex-col w-64 min-h-screen bg-white dark:bg-gray-800 
        border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        md:flex
      `, children: [_jsxs("div", { className: "flex items-center justify-between p-4 md:hidden", children: [_jsx("span", { className: "text-lg font-semibold", children: "\uBA54\uB274" }), _jsx("button", { onClick: onClose, className: "p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsx("div", { className: "flex-1 px-3 py-4", children: _jsxs("nav", { className: "space-y-1", children: [_jsxs(NavLink, { to: "/", className: ({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive
                                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700'}`, children: [_jsx(BarChart3, { className: "w-5 h-5 mr-3" }), "\uB300\uC2DC\uBCF4\uB4DC"] }), _jsxs(NavLink, { to: "/products", className: ({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive
                                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700'}`, children: [_jsx(Package, { className: "w-5 h-5 mr-3" }), "\uC81C\uD488 \uAD00\uB9AC"] }), _jsxs(NavLink, { to: "/barcode", className: ({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive
                                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700'}`, children: [_jsx(Scan, { className: "w-5 h-5 mr-3" }), "\uBC14\uCF54\uB4DC \uC2A4\uCE94"] }), _jsxs(NavLink, { to: "/products/bulk-upload", className: ({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive
                                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700'}`, children: [_jsx(Upload, { className: "w-5 h-5 mr-3" }), "\uB300\uB7C9 \uC5C5\uB85C\uB4DC"] }), _jsxs(NavLink, { to: "/products", className: ({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive
                                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700'}`, children: [_jsx(MoveRight, { className: "w-5 h-5 mr-3" }), "\uC704\uCE58 \uC774\uB3D9"] }), _jsxs(NavLink, { to: "/reports", className: ({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive
                                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700'}`, children: [_jsx(FileText, { className: "w-5 h-5 mr-3" }), "\uBCF4\uACE0\uC11C"] }), _jsxs(NavLink, { to: "/ai-insights", className: ({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive
                                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700'}`, children: [_jsx(Brain, { className: "w-5 h-5 mr-3" }), "AI \uC778\uC0AC\uC774\uD2B8"] }), ((user === null || user === void 0 ? void 0 : user.role) === 'admin' || (user === null || user === void 0 ? void 0 : user.role) === 'ADMIN') && (_jsxs(NavLink, { to: "/admin", className: ({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive
                                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700'}`, children: [_jsx(UserCog, { className: "w-5 h-5 mr-3" }), "\uAD00\uB9AC\uC790"] })), _jsxs(NavLink, { to: "/settings", className: ({ isActive }) => `flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive
                                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700'}`, children: [_jsx(Settings, { className: "w-5 h-5 mr-3" }), "\uC124\uC815"] })] }) })] })] }));
};
export default Sidebar;
