import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import OrderEntry from './pages/OrderEntry';
import OrderManagement from './pages/OrderManagement';
import Analytics from './pages/Analytics';
import UserApproval from './components/UserApproval';

type Page = 'entry' | 'management' | 'analytics';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('entry');
  const [showUserApproval, setShowUserApproval] = useState(false);
  const { isApproved, logout } = useAuth();

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

  // 承認されていない場合は承認待ち画面を表示
  if (!isApproved) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">承認待ち</h1>
          <p className="text-gray-600 mb-6">
            アカウントの承認をお待ちください。<br />
            管理者が承認すると、アプリケーションを使用できるようになります。
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors w-full"
            >
              再確認
            </button>
            <button
              onClick={async () => {
                try {
                  await logout();
                  // ログアウト後にページをリロードして確実にログイン画面に戻る
                  window.location.reload();
                } catch (error) {
                  console.error('Logout error:', error);
                }
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors w-full"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="h-full bg-gray-50 flex flex-col">
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {renderCurrentPage()}
        </div>
        <Navigation 
          currentPage={currentPage} 
          onPageChange={setCurrentPage} 
          onShowUserApproval={() => setShowUserApproval(true)}
        />
        {showUserApproval && (
          <UserApproval onClose={() => setShowUserApproval(false)} />
        )}
      </div>
    </ProtectedRoute>
  );
}

export default App;