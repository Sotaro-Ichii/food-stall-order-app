'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navigation } from '@/components/Navigation';
import { subscribeToPendingOrders, markOrderAsCompleted } from '@/lib/orders';
import { Order } from '@/types';
import { Check, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function ManagePage() {
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const unsubscribe = subscribeToPendingOrders(setPendingOrders, 100);
    return () => unsubscribe();
  }, []);

  const handleMarkAsDone = async (orderId: string) => {
    setLoading(prev => ({ ...prev, [orderId]: true }));
    try {
      await markOrderAsCompleted(orderId);
      // 完了した注文をcompletedOrdersに追加
      const completedOrder = pendingOrders.find(order => order.id === orderId);
      if (completedOrder) {
        setCompletedOrders(prev => [completedOrder, ...prev]);
      }
    } catch (error) {
      console.error('注文完了エラー:', error);
      alert('注文の完了処理に失敗しました。');
    } finally {
      setLoading(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm:ss', { locale: ja });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              注文管理
            </h1>

            {/* 保留中注文 */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                  保留中の注文 ({pendingOrders.length}件)
                </h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {pendingOrders.length === 0 ? (
                  <li className="px-4 py-4 text-center text-gray-500">
                    保留中の注文はありません
                  </li>
                ) : (
                  pendingOrders.map((order) => (
                    <li key={order.id} className="px-4 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {order.itemName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatTime(order.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <button
                            onClick={() => handleMarkAsDone(order.id)}
                            disabled={loading[order.id]}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            {loading[order.id] ? '処理中...' : '完了'}
                          </button>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* 完了済み注文 */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div 
                className="px-4 py-5 sm:px-6 cursor-pointer"
                onClick={() => setShowCompleted(!showCompleted)}
              >
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center justify-between">
                  <div className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    完了済み注文 ({completedOrders.length}件)
                  </div>
                  {showCompleted ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </h3>
              </div>
              
              {showCompleted && (
                <ul className="divide-y divide-gray-200">
                  {completedOrders.length === 0 ? (
                    <li className="px-4 py-4 text-center text-gray-500">
                      完了済みの注文はありません
                    </li>
                  ) : (
                    completedOrders.map((order) => (
                      <li key={order.id} className="px-4 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">
                                {order.itemName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatTime(order.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              完了
                            </span>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 