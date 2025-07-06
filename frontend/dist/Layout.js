import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
export default function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-100 dark:bg-gray-900", children: [_jsx(Navbar, { onToggleSidebar: toggleSidebar }), _jsxs("div", { className: "flex", children: [_jsx(Sidebar, { isOpen: isSidebarOpen, onClose: () => setIsSidebarOpen(false) }), _jsx("main", { className: "flex-1 p-4 md:p-6 max-w-7xl mx-auto", children: _jsx("div", { className: "rounded-lg bg-white dark:bg-gray-800 p-4 md:p-6 shadow-sm", children: _jsx(Outlet, {}) }) })] })] }));
}
