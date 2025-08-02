import React, { useState, useEffect } from 'react';
import { BarChart3, Download, RefreshCw, Calendar, TrendingUp, Clock, Target, Award } from 'lucide-react';
import { collection, query, where, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { format, startOfWeek, endOfWeek, subDays, isToday } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useMenuItems } from '../hooks/useMenuItems';

interface DailySales {
  itemName: string;
  quantity: number;
  revenue: number;
}

interface HourlySales {
  hour: number;
  count: number;
}

interface WeeklySales {
  date: string;
  count: number;
}

const Analytics: React.FC = () => {
  const [dailySales, setDailySales] = useState<DailySales[]>([]);
  const [hourlySales, setHourlySales] = useState<HourlySales[]>([]);
  const [weeklySales, setWeeklySales] = useState<WeeklySales[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averageOrderTime, setAverageOrderTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const { currentUser } = useAuth();
  const { menuItems, loading: menuLoading } = useMenuItems();

  useEffect(() => {
    if (currentUser && !menuLoading) {
      loadDailySales();
    } else {
      setLoading(false);
    }
  }, [currentUser, menuLoading, menuItems]);

  const loadDailySales = async () => {
    if (!currentUser) return;

    console.log('Loading sales data...');
    console.log('Menu items available:', menuItems);

    try {
      // Get all completed orders
      const q = query(
        collection(db, 'orders'),
        where('status', '==', 'completed')
      );

      const querySnapshot = await getDocs(q);
      
      // Create a price lookup map from menu items
      const priceMap: { [key: string]: number } = {};
      menuItems.forEach(item => {
        priceMap[item.name] = item.price || 0;
      });
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekStart = startOfWeek(today);
      const weekEnd = endOfWeek(today);
      
      const salesMap: { [key: string]: { quantity: number; revenue: number } } = {};
      const hourlyMap: { [key: number]: number } = {};
      const weeklyMap: { [key: string]: number } = {};
      let revenue = 0;
      let totalOrderTime = 0;
      let orderCount = 0;

      // Initialize hourly data
      for (let i = 0; i < 24; i++) {
        hourlyMap[i] = 0;
      }

      // Initialize weekly data
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        weeklyMap[format(date, 'yyyy-MM-dd')] = 0;
      }

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const completedAt = data.completedAt?.toDate();
        const createdAt = data.createdAt?.toDate();
        
        if (completedAt) {
          // Today's sales by item
          if (completedAt >= today) {
            const itemName = data.itemName;
            const quantity = data.quantity || 1;
            const itemPrice = priceMap[itemName] || 0;
            const itemRevenue = quantity * itemPrice;
            
            if (salesMap[itemName]) {
              salesMap[itemName].quantity += quantity;
              salesMap[itemName].revenue += itemRevenue;
            } else {
              salesMap[itemName] = { quantity, revenue: itemRevenue };
            }

            // Hourly sales (today only)
            const hour = completedAt.getHours();
            hourlyMap[hour] += quantity;

            // Calculate total revenue
            revenue += itemRevenue;
          }

          // Weekly sales
          if (completedAt >= weekStart && completedAt <= weekEnd) {
            const dateKey = format(completedAt, 'yyyy-MM-dd');
            if (weeklyMap[dateKey] !== undefined) {
              weeklyMap[dateKey] += data.quantity || 1;
            }
          }

          // Calculate average order time
          if (createdAt && completedAt && isToday(completedAt)) {
            const orderTime = (completedAt.getTime() - createdAt.getTime()) / 1000 / 60; // minutes
            totalOrderTime += orderTime;
            orderCount++;
          }
        }
      });

      const salesArray = Object.entries(salesMap).map(([itemName, data]) => ({
        itemName,
        quantity: data.quantity,
        revenue: data.revenue
      }));

      const hourlyArray = Object.entries(hourlyMap).map(([hour, count]) => ({
        hour: parseInt(hour),
        count
      }));

      const weeklyArray = Object.entries(weeklyMap).map(([date, count]) => ({
        date,
        count
      }));

      salesArray.sort((a, b) => b.quantity - a.quantity);
      setDailySales(salesArray);
      setHourlySales(hourlyArray);
      setWeeklySales(weeklyArray);
      setTotalRevenue(revenue);
      setAverageOrderTime(orderCount > 0 ? totalOrderTime / orderCount : 0);
      
      console.log('Final revenue:', revenue, 'Sales data:', salesArray);
    } catch (error) {
      console.error('Error loading daily sales:', error);
      setDailySales([]);
      setHourlySales([]);
      setWeeklySales([]);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      'Item Name,Quantity Sold,Revenue',
      ...dailySales.map(item => `${item.itemName},${item.quantity},¥${item.revenue}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-sales-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const resetDailyCount = async () => {
    if (!currentUser) return;

    if (!confirm('本日の売上データをリセットしますか？完了済みの注文がすべて削除されます。')) {
      return;
    }

    setResetting(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Use a simpler query without compound index requirement
      const q = query(
        collection(db, 'orders'),
        where('status', '==', 'completed')
      );

      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);
      let deleteCount = 0;

      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        const completedAt = data.completedAt?.toDate();
        
        // Filter on client side to avoid compound index requirement
        if (completedAt && completedAt >= today && completedAt < tomorrow) {
          batch.delete(doc(db, 'orders', docSnapshot.id));
          deleteCount++;
        }
      });

      if (deleteCount > 0) {
      await batch.commit();
        console.log(`Deleted ${deleteCount} orders`);
      }
      
      // Reload data
      await loadDailySales();
    } catch (error) {
      console.error('Error resetting daily count:', error);
      alert('データのリセットに失敗しました。もう一度お試しください。');
    } finally {
      setResetting(false);
    }
  };

  const totalOrders = dailySales.reduce((sum, item) => sum + item.quantity, 0);
  const peakHour = hourlySales.reduce((max, current) => 
    current.count > max.count ? current : max, { hour: 0, count: 0 }
  );
  const bestSellingItem = dailySales[0];

  return (
    <div className="p-4 pb-24 min-h-screen bg-gray-50 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Daily Analytics</h1>
        
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Orders</p>
                <p className="text-blue-800 font-bold text-2xl">{totalOrders}</p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Revenue</p>
                <p className="text-green-800 font-bold text-2xl">¥{totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Peak Hour</p>
                <p className="text-orange-800 font-bold text-2xl">{peakHour.hour}:00</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          
          <div className="bg-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Avg Time</p>
                <p className="text-purple-800 font-bold text-2xl">{averageOrderTime.toFixed(1)}m</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-3 mb-4">
          <p className="text-gray-600 text-sm text-center">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={exportToCSV}
          disabled={dailySales.length === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
        
        <button
          onClick={resetDailyCount}
          disabled={resetting || dailySales.length === 0}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${resetting ? 'animate-spin' : ''}`} />
          {resetting ? 'Resetting...' : 'Reset Count'}
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      ) : dailySales.length === 0 ? (
        <div className="bg-white rounded-lg p-6 text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No sales data for today</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Best Selling Item */}
          {bestSellingItem && (
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-800 font-semibold text-lg flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Best Seller Today
                  </p>
                  <p className="text-yellow-700 text-2xl font-bold">{bestSellingItem.itemName}</p>
                  <p className="text-yellow-600 text-sm">{bestSellingItem.quantity} orders</p>
                </div>
              </div>
            </div>
          )}

          {/* Hourly Sales Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Hourly Sales Pattern
              </h2>
            </div>
            <div className="p-4">
              <div className="flex items-end justify-between h-32 space-x-1">
                {hourlySales.map((hour) => (
                  <div key={hour.hour} className="flex flex-col items-center flex-1">
                    <div 
                      className="bg-blue-500 rounded-t w-full min-h-[4px] transition-all duration-300"
                      style={{ 
                        height: `${Math.max(4, (hour.count / Math.max(...hourlySales.map(h => h.count), 1)) * 100)}px` 
                      }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-1">{hour.hour}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly Trend */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Weekly Trend
              </h2>
            </div>
            <div className="p-4">
              <div className="flex items-end justify-between h-24 space-x-2">
                {weeklySales.map((day, index) => (
                  <div key={day.date} className="flex flex-col items-center flex-1">
                    <div 
                      className={`rounded-t w-full min-h-[4px] transition-all duration-300 ${
                        format(new Date(day.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                          ? 'bg-blue-600' : 'bg-gray-400'
                      }`}
                      style={{ 
                        height: `${Math.max(4, (day.count / Math.max(...weeklySales.map(d => d.count), 1)) * 80)}px` 
                      }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-1">
                      {format(new Date(day.date), 'EEE')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Items Sold Today */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Items Sold Today
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {dailySales.map((item, index) => (
                <div key={item.itemName} className="p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <span className="font-medium text-gray-800">{item.itemName}</span>
                      <p className="text-sm text-gray-500">¥{item.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-green-100 rounded-full px-3 py-1">
                      <span className="text-green-800 font-semibold">{item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;