import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, orderBy, query, Timestamp, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { MenuItem } from '../types';

export const useMenuItems = () => {
  const { currentUser } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setMenuItems([]);
      setLoading(false);
      setError(null);
      return;
    }

    // Use orderBy query with proper index as recommended in README
    // Try to set up real-time listener first
    const menuItemsRef = query(collection(db, 'menuItems'), orderBy('createdAt', 'asc'));
    
    const unsubscribe = onSnapshot(menuItemsRef, (snapshot) => {
      const items: MenuItem[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as MenuItem));
      
      setMenuItems(items);
      setLoading(false);
      setError(null);
    }, async (error) => {
      console.error('Error with real-time listener:', error);
      
      // If real-time listener fails due to permissions, try a one-time read
      try {
        const snapshot = await getDocs(collection(db, 'menuItems'));
        const items: MenuItem[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as MenuItem)).sort((a, b) => {
          // Client-side sorting since we can't use orderBy
          const aTime = a.createdAt?.toMillis() || 0;
          const bTime = b.createdAt?.toMillis() || 0;
          return aTime - bTime;
        });
        
        setMenuItems(items);
        setLoading(false);
        setError('Using fallback mode - real-time updates disabled. Please configure Firebase security rules as described in README.md');
      } catch (fallbackError) {
        console.error('Fallback read also failed:', fallbackError);
        setError('Firebase security rules not configured. Please set up Firestore security rules in Firebase Console as described in README.md');
        setLoading(false);
        setMenuItems([]); // Set empty array to prevent undefined state
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const addMenuItem = async (name: string, price: number) => {
    if (!currentUser) {
      throw new Error('Authentication required');
    }

    try {
      await addDoc(collection(db, 'menuItems'), {
        name,
        price,
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw new Error(`Failed to add menu item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const deleteMenuItem = async (itemId: string) => {
    if (!currentUser) {
      throw new Error('ログインが必要です');
    }

    try {
      await deleteDoc(doc(db, 'menuItems', itemId));
    } catch (error) {
      console.error('Error deleting menu item:', error);
      throw error;
    }
  };

  return { menuItems, loading, error, addMenuItem, deleteMenuItem };
};