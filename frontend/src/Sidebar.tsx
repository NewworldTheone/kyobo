import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Package, 
  Settings, 
  FileText, 
  Boxes,
  MoveRight,
  Upload,
  Scan,
  UserCog,
  Brain,
  X
} from 'lucide-react';
import { useAuth } from './hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user } = useAuth();
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 md:z-auto
        flex flex-col w-64 min-h-screen bg-white dark:bg-gray-800 
        border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        md:flex
      `}>
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-4 md:hidden">
          <span className="text-lg font-semibold">메뉴</span>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700'
              }`
            }
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            대시보드
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700'
              }`
            }
          >
            <Package className="w-5 h-5 mr-3" />
            제품 관리
          </NavLink>

          <NavLink
            to="/barcode"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700'
              }`
            }
          >
            <Scan className="w-5 h-5 mr-3" />
            바코드 스캔
          </NavLink>

          <NavLink
            to="/products/bulk-upload"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700'
              }`
            }
          >
            <Upload className="w-5 h-5 mr-3" />
            대량 업로드
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700'
              }`
            }
          >
            <MoveRight className="w-5 h-5 mr-3" />
            위치 이동
          </NavLink>

          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700'
              }`
            }
          >
            <FileText className="w-5 h-5 mr-3" />
            보고서
          </NavLink>

          <NavLink
            to="/ai-insights"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700'
              }`
            }
          >
            <Brain className="w-5 h-5 mr-3" />
            AI 인사이트
          </NavLink>

          {(user?.role === 'admin' || user?.role === 'ADMIN') && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700'
                }`
              }
            >
              <UserCog className="w-5 h-5 mr-3" />
              관리자
            </NavLink>
          )}

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700'
              }`
            }
          >
            <Settings className="w-5 h-5 mr-3" />
            설정
          </NavLink>
        </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
