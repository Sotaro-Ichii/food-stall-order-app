'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, AuthError } from 'firebase/auth';
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
    // Wait a bit for Firebase to initialize
    const timer = setTimeout(() => {
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
        }, (error: AuthError) => {
          console.error('Auth state change error:', error);
          // Don't show error for auth/invalid-api-key during development
          if (error.code === 'auth/invalid-api-key') {
            console.warn('Firebase API key error - this might be expected during development');
          } else {
            setFirebaseError(true);
          }
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Auth initialization error:', error);
        setFirebaseError(true);
        setLoading(false);
      }
    }, 1000); // Wait 1 second for Firebase to initialize

    return () => clearTimeout(timer);
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