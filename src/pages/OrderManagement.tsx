import React, { useState } from 'react';
import { Check, Clock, ChevronDown, ChevronUp, X } from 'lucide-react';
import { format } from 'date-fns';
import { useOrders } from '../hooks/useOrders';

const OrderManagement: React.FC = () => {
  const { pendingOrders, completedOrders, completeOrder, cancelOrder, loading, error } = useOrders();
  const [showCompleted, setShowCompleted] = useState(false);

  const handleCompleteOrder = async (orderId: string) => {
    try {
      await completeOrder(orderId);
    } catch (error) {
      console.error('Error completing order:', error);
    }
  };

  const handleCancelOrder = async (orderId: string, itemName: string) => {
    if (!confirm(`「${itemName}」のオーダーを取り消しますか？`)) return;

    try {
      await cancelOrder(orderId);
    } catch (error) {
      console.error('Error canceling order:', error);
      alert('オーダーの取り消しに失敗しました');
    }
  };

  if (loading) {
    return (
      <div className="p-4 pb-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">エラーが発生しました</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 min-h-screen bg-gray-50 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Management</h1>
        <div className="bg-orange-100 rounded-lg p-4 border border-orange-200">
          <p className="text-orange-800 font-semibold">
            Pending Orders: {pendingOrders.length}
          </p>
        </div>
      </div>

      {/* Pending Orders */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-orange-600" />
          Pending Orders
        </h2>
        
        {pendingOrders.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-center">
            <p className="text-gray-500">No pending orders</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {order.itemName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {format(order.createdAt, 'HH:mm:ss')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCancelOrder(order.id, order.itemName)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCompleteOrder(order.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Done
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Orders */}
      <div>
        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className="w-full bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex items-center justify-between mb-3"
        >
          <div className="flex items-center">
            <Check className="w-5 h-5 mr-2 text-green-600" />
            <span className="font-semibold text-gray-800">
              Completed Today ({completedOrders.length})
            </span>
          </div>
          {showCompleted ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {showCompleted && (
          <div className="space-y-2">
            {completedOrders.length === 0 ? (
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-gray-500">No completed orders today</p>
              </div>
            ) : (
              completedOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-green-50 rounded-lg p-3 border border-green-200"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">
                      {order.itemName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {order.completedAt && format(order.completedAt, 'HH:mm')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;