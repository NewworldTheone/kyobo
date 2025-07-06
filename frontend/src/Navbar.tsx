import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { Button } from './components/ui/button';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, logout } = useAuth();
  
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost"
              size="icon"
              className="mr-2 md:hidden"
              aria-label="메뉴 열기"
              onClick={onToggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="text-xl font-semibold">교보문고 재고관리</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="relative">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-700">
                <div className="px-4 py-2">
                  <p className="text-sm">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
                <hr className="my-1 border-gray-200 dark:border-gray-600" />
                <button
                  onClick={() => logout()}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
