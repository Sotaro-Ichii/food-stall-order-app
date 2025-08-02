import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import OrderEntry from './pages/OrderEntry';
import OrderManagement from './pages/OrderManagement';
import Analytics from './pages/Analytics';

type Page = 'entry' | 'management' | 'analytics';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('entry');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'entry':
        return <OrderEntry />;
      case 'management':
        return <OrderManagement />;
      case 'analytics':
        return <Analytics />;
      default:
        return <OrderEntry />;
    }
  };

  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="h-full bg-gray-50 flex flex-col">
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {renderCurrentPage()}
          </div>
          <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;