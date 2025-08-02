import React from 'react';
import { Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { useOrders } from '../hooks/useOrders';

const OrderManagement: React.FC = () => {
  const { completedOrders, cancelOrder, loading, error } = useOrders();

  const handleDeleteOrder = async (orderId: string, itemName: string) => {
    if (!confirm(`「${itemName}」のオーダーを削除しますか？`)) return;

    try {
      await cancelOrder(orderId);
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('オーダーの削除に失敗しました');
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
    <div className="p-4 pb-24 bg-gray-50 h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Management</h1>
        <div className="bg-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-green-800 font-semibold">
            Today's Orders: {completedOrders.length}
          </p>
        </div>
      </div>

      {/* Today's Orders */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <Check className="w-5 h-5 mr-2 text-green-600" />
          Today's Orders
        </h2>
        
        {completedOrders.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-center">
            <p className="text-gray-500">No orders today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {completedOrders.map((order) => (
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
                      {order.completedAt && format(order.completedAt, 'HH:mm:ss')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteOrder(order.id, order.itemName)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;