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
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50 shadow-lg">
      <div className="flex justify-around items-center py-2 px-4">
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