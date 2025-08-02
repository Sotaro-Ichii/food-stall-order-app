import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot, addDoc, updateDoc, deleteDoc, doc, where, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';

export const useOrders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      orderBy('createdAt', 'desc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          completedAt: doc.data().completedAt?.toDate(),
          quantity: doc.data().quantity || 1
        })) as Order[];
        setOrders(ordersData);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Firestore permission error:', error);
        setError('データの読み込みに失敗しました。管理者に連絡してください。');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [currentUser]);

  const addOrder = async (itemName: string) => {
    if (!currentUser) {
      throw new Error('ログインが必要です');
    }

    try {
      await addDoc(collection(db, 'orders'), {
        itemName,
        quantity: 1,
        status: 'completed',
        createdAt: Timestamp.now(),
        completedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status'], completedAt?: Date) => {
    if (!currentUser) {
      throw new Error('ログインが必要です');
    }

    try {
      const orderRef = doc(db, 'orders', orderId);
      const updateData: any = { status };
      if (completedAt) {
        updateData.completedAt = Timestamp.fromDate(completedAt);
      }
      await updateDoc(orderRef, updateData);
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  };

  const completeOrder = async (orderId: string) => {
    await updateOrderStatus(orderId, 'completed', new Date());
  };

  const cancelOrder = async (orderId: string) => {
    if (!currentUser) {
      throw new Error('ログインが必要です');
    }

    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
    }
  };

  const completedOrders = orders.filter(order => {
    if (order.status !== 'completed' || !order.completedAt) return false;
    const today = format(new Date(), 'yyyy-MM-dd');
    const orderDate = format(order.completedAt, 'yyyy-MM-dd');
    return today === orderDate;
  });

  return { completedOrders, loading, error, addOrder, cancelOrder };
};