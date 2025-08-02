'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navigation } from '@/components/Navigation';
import { MENU_ITEMS, createOrder, subscribeToPendingOrders } from '@/lib/orders';
import { Order } from '@/types';
import { Plus, Check } from 'lucide-react';

export default function OrdersPage() {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToPendingOrders(setPendingOrders, 100);
    return () => unsubscribe();
  }, []);

  const handleOrderClick = async (itemName: string) => {
    setLoading(true);
    try {
      await createOrder(itemName);
    } catch (error) {
      console.error('注文作成エラー:', error);
      alert('注文の作成に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* 保留中注文数表示 */}
          <div className="mb-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        保留中の注文
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {pendingOrders.length}件
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* メニューアイテム */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleOrderClick(item.name)}
                disabled={loading}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-center">
                    <div className="flex-shrink-0">
                      <Plus className="h-8 w-8 text-primary-600" />
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      ¥{item.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* 保留中注文リスト（モバイル表示） */}
          <div className="mt-8 md:hidden">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              保留中の注文
            </h3>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {pendingOrders.slice(0, 10).map((order) => (
                  <li key={order.id} className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.itemName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.createdAt.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 