import React from 'react';
import { Plus, Settings } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { useMenuItems } from '../hooks/useMenuItems';
import MenuManagement from '../components/MenuManagement';

const OrderEntry: React.FC = () => {
  const { pendingOrders, addOrder } = useOrders();
  const { menuItems, loading: menuLoading } = useMenuItems();
  const [showMenuManagement, setShowMenuManagement] = React.useState(false);

  const handleOrderCreate = async (itemName: string) => {
    try {
      await addOrder(itemName);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div className="p-4 pb-20 min-h-screen bg-gray-50">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-800">Create New Order</h1>
          <button
            onClick={() => setShowMenuManagement(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <div className="bg-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-blue-800 font-semibold text-lg">
            Active Orders: {pendingOrders.length}
          </p>
        </div>
      </div>

      {menuLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">メニューを読み込み中...</p>
        </div>
      ) : menuItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">メニューがありません</p>
          <button
            onClick={() => setShowMenuManagement(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center mx-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            メニューを追加
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleOrderCreate(item.name)}
              className="bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-400 rounded-xl p-6 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm"
            >
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 rounded-full p-3 mb-3">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <span className="font-semibold text-gray-800 text-center">
                  {item.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-gray-500">
        <p className="text-sm">Tap any item to create a new order</p>
      </div>

      {showMenuManagement && (
        <MenuManagement onClose={() => setShowMenuManagement(false)} />
      )}
    </div>
  );
};

export default OrderEntry;