<<<<<<< HEAD
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
        <div className="min-h-screen bg-gray-50">
          {renderCurrentPage()}
          <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        </div>
      </ProtectedRoute>
=======
import { AuthProvider } from './contexts/AuthContext';
import { LoginForm } from './components/LoginForm';
import { OrdersPage } from './components/OrdersPage';
import { ManagePage } from './components/ManagePage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { Navigation } from './components/Navigation';
import { useAuth } from './contexts/AuthContext';
import { useState } from 'react';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'orders' | 'manage' | 'analytics'>('orders');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      {currentPage === 'orders' && <OrdersPage />}
      {currentPage === 'manage' && <ManagePage />}
      {currentPage === 'analytics' && <AnalyticsPage />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
>>>>>>> 9b74d41 (change responsible design)
    </AuthProvider>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App; 
>>>>>>> 9b74d41 (change responsible design)
