'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { FirebaseError } from '@/components/FirebaseError';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  firebaseError: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  firebaseError: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState(false);

  useEffect(() => {
    if (!auth) {
      console.warn('Firebase Auth is not initialized. Please check your environment variables.');
      setFirebaseError(true);
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      }, (error) => {
        console.error('Auth state change error:', error);
        setFirebaseError(true);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Auth initialization error:', error);
      setFirebaseError(true);
      setLoading(false);
    }
  }, []);

  if (firebaseError) {
    return <FirebaseError />;
  }

  return (
    <AuthContext.Provider value={{ user, loading, firebaseError }}>
      {children}
    </AuthContext.Provider>
  );
}; 