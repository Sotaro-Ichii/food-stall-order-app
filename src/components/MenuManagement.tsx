import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useMenuItems } from '../hooks/useMenuItems';

interface MenuManagementProps {
  onClose: () => void;
}

const MenuManagement: React.FC<MenuManagementProps> = ({ onClose }) => {
  const { menuItems, loading, addMenuItem, deleteMenuItem } = useMenuItems();
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPrice.trim()) return;

    const price = parseFloat(newItemPrice);
    if (isNaN(price) || price <= 0) {
      alert('有効な価格を入力してください');
      return;
    }

    try {
      setIsAdding(true);
      await addMenuItem(newItemName.trim(), price);
      setNewItemName('');
      setNewItemPrice('');
    } catch (error) {
      console.error('Error adding menu item:', error);
      if (error instanceof Error && error.message.includes('Missing or insufficient permissions')) {
        const confirmResult = confirm(
          'メニューの追加に失敗しました。\n\n' +
          'Firebase Consoleでセキュリティルールを設定する必要があります。\n' +
          'Firebase Consoleを開きますか？\n\n' +
          '詳細はREADME.mdの「Firestore Security Rules」セクションを参照してください。'
        );
        
        if (confirmResult) {
          window.open('https://console.firebase.google.com/project/food-stall-order-app/firestore/rules', '_blank');
        }
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        alert(`メニューの追加に失敗しました: ${errorMessage}`);
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteItem = async (itemId: string, itemName: string) => {
    if (!confirm(`「${itemName}」を削除しますか？`)) return;

    try {
      await deleteMenuItem(itemId);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      alert('メニューの削除に失敗しました');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">メニュー管理</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <form onSubmit={handleAddItem} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="メニュー名"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isAdding}
              />
              <input
                type="number"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                placeholder="価格"
                min="1"
                step="1"
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isAdding}
              />
              <button
                type="submit"
                disabled={isAdding || !newItemName.trim() || !newItemPrice.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        <div className="overflow-y-auto max-h-96">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">読み込み中...</p>
            </div>
          ) : menuItems.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              メニューがありません
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {menuItems.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-800">{item.name}</span>
                    <p className="text-sm text-gray-500">¥{item.price?.toLocaleString() || '価格未設定'}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteItem(item.id, item.name)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;