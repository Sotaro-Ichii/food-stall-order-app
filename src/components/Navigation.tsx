<<<<<<< HEAD
import React from 'react';
import { ShoppingCart, ClipboardList, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavigationProps {
  currentPage: 'entry' | 'management' | 'analytics';
  onPageChange: (page: 'entry' | 'management' | 'analytics') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50">
      <div className="flex justify-around items-center py-2">
        <button
          onClick={() => onPageChange('entry')}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            currentPage === 'entry'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <ShoppingCart size={24} />
          <span className="text-xs mt-1">Order</span>
        </button>
        
        <button
          onClick={() => onPageChange('management')}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            currentPage === 'management'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <ClipboardList size={24} />
          <span className="text-xs mt-1">Manage</span>
        </button>
        
        <button
          onClick={() => onPageChange('analytics')}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            currentPage === 'analytics'
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <BarChart3 size={24} />
          <span className="text-xs mt-1">Analytics</span>
        </button>
        
        <button
          onClick={handleLogout}
          className="flex flex-col items-center p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={24} />
          <span className="text-xs mt-1">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
=======
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { LogOut, Plus, List, BarChart3 } from 'lucide-react';

interface NavigationProps {
  currentPage: 'orders' | 'manage' | 'analytics';
  onPageChange: (page: 'orders' | 'manage' | 'analytics') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  const navItems = [
    { key: 'orders' as const, label: '注文入力', icon: Plus },
    { key: 'manage' as const, label: '注文管理', icon: List },
    { key: 'analytics' as const, label: '分析', icon: BarChart3 },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">屋台注文管理</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => onPageChange(item.key)}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-primary-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <LogOut className="w-4 h-4 mr-2" />
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}; 
>>>>>>> 9b74d41 (change responsible design)
