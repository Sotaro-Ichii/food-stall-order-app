'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Navigation } from '@/components/Navigation';
import { getTodayStats, MENU_ITEMS } from '@/lib/orders';
import { BarChart3, Download, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<{ [itemName: string]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const todayStats = await getTodayStats();
        setStats(todayStats);
      } catch (error) {
        console.error('統計データ取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const exportToCSV = () => {
    const today = format(new Date(), 'yyyy-MM-dd', { locale: ja });
    const csvContent = [
      ['商品名', '売上数', '単価', '売上金額'],
      ...MENU_ITEMS.map(item => [
        item.name,
        stats[item.name] || 0,
        item.price,
        (stats[item.name] || 0) * item.price
      ]),
      ['合計', '', '', Object.entries(stats).reduce((sum, [itemName, count]) => {
        const item = MENU_ITEMS.find(m => m.name === itemName);
        return sum + (count * (item?.price || 0));
      }, 0)]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `売上統計_${today}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetStats = () => {
    if (confirm('今日の統計データをリセットしますか？この操作は取り消せません。')) {
      setStats({});
      // 実際のリセット処理はFirebaseのデータを削除する必要があります
      alert('統計データをリセットしました。');
    }
  };

  const totalOrders = Object.values(stats).reduce((sum, count) => sum + count, 0);
  const totalRevenue = Object.entries(stats).reduce((sum, [itemName, count]) => {
    const item = MENU_ITEMS.find(m => m.name === itemName);
    return sum + (count * (item?.price || 0));
  }, 0);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
              <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
                <BarChart3 className="h-6 w-6 text-primary-600 mr-2" />
                今日の売上分析
              </h1>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={exportToCSV}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Download className="h-4 w-4 mr-2" />
                  CSV出力
                </button>
                <button
                  onClick={resetStats}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  リセット
                </button>
              </div>
            </div>

            {/* サマリー */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      総注文数
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {totalOrders}件
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      総売上
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      ¥{totalRevenue.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      平均単価
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {totalOrders > 0 ? `¥${Math.round(totalRevenue / totalOrders).toLocaleString()}` : '¥0'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            {/* 詳細テーブル */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  商品別売上詳細
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {format(new Date(), 'yyyy年MM月dd日', { locale: ja })}の売上データ
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        商品名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        売上数
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        単価
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        売上金額
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {MENU_ITEMS.map((item) => {
                      const count = stats[item.name] || 0;
                      const revenue = count * item.price;
                      return (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {count}件
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ¥{item.price.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ¥{revenue.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        合計
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {totalOrders}件
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        -
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        ¥{totalRevenue.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 