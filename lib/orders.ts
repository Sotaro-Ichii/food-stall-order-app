import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Order } from '@/types';

// メニューアイテムの定義
export const MENU_ITEMS = [
  { id: 'yakitori', name: '焼き鳥', price: 200 },
  { id: 'yakitori_x2', name: '焼き鳥 x2', price: 400 },
  { id: 'yakitori_x3', name: '焼き鳥 x3', price: 600 },
  { id: 'takoyaki', name: 'たこ焼き', price: 300 },
  { id: 'okonomiyaki', name: 'お好み焼き', price: 500 },
  { id: 'ramen', name: 'ラーメン', price: 800 },
  { id: 'udon', name: 'うどん', price: 600 },
  { id: 'sushi', name: '寿司', price: 1000 },
  { id: 'tempura', name: '天ぷら', price: 700 },
  { id: 'gyoza', name: '餃子', price: 400 },
];

// 新しい注文を作成
export const createOrder = async (itemName: string): Promise<void> => {
  try {
    await addDoc(collection(db, 'orders'), {
      itemName,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('注文作成エラー:', error);
    throw error;
  }
};

// 保留中の注文を取得（リアルタイム）
export const subscribeToPendingOrders = (
  callback: (orders: Order[]) => void,
  limitCount: number = 100
) => {
  const q = query(
    collection(db, 'orders'),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  return onSnapshot(q, (snapshot) => {
    const orders: Order[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        itemName: data.itemName,
        status: data.status,
        createdAt: data.createdAt?.toDate() || new Date(),
      });
    });
    callback(orders);
  });
};

// 注文を完了としてマーク
export const markOrderAsCompleted = async (orderId: string): Promise<void> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: 'completed',
      completedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('注文完了エラー:', error);
    throw error;
  }
};

// 今日の注文統計を取得
export const getTodayStats = async (): Promise<{ [itemName: string]: number }> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const q = query(
    collection(db, 'orders'),
    where('status', '==', 'completed'),
    where('completedAt', '>=', Timestamp.fromDate(today))
  );

  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const stats: { [itemName: string]: number } = {};
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const itemName = data.itemName;
        stats[itemName] = (stats[itemName] || 0) + 1;
      });
      
      unsubscribe();
      resolve(stats);
    }, reject);
  });
}; 