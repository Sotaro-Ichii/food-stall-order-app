import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isApproved: boolean;
  checkApproval: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(false);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    
    // ログイン後に承認状態をチェック
    const approved = await checkApproval(email);
    setIsApproved(approved);
  };

  const signup = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // 新規ユーザーを承認待ちリストに追加
    await setDoc(doc(db, 'pendingUsers', userCredential.user.uid), {
      email: email,
      createdAt: new Date(),
      status: 'pending'
    });
    
    // 新規登録後はログアウト
    await signOut(auth);
  };

  const logout = async () => {
    console.log('AuthContext: ログアウト処理開始');
    await signOut(auth);
    console.log('AuthContext: Firebase認証からログアウト完了');
    // ログアウト時に承認状態もリセット
    setIsApproved(false);
    setCurrentUser(null);
    console.log('AuthContext: 状態リセット完了');
  };

  const checkApproval = async (email: string): Promise<boolean> => {
    try {
      // 承認済みユーザーリストをチェック
      const approvedQuery = query(collection(db, 'approvedUsers'), where('email', '==', email));
      const approvedSnapshot = await getDocs(approvedQuery);
      
      if (!approvedSnapshot.empty) {
        return true;
      }
      
      // 管理者ユーザーかチェック（demo@foodstall.comは常に承認済み）
      if (email === 'demo@foodstall.com') {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking approval:', error);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('AuthContext: 認証状態変更', user ? 'ログイン' : 'ログアウト');
      setCurrentUser(user);
      
      if (user) {
        // ユーザーがログインしたら承認状態をチェック
        console.log('AuthContext: 承認状態チェック開始');
        const approved = await checkApproval(user.email || '');
        setIsApproved(approved);
        console.log('AuthContext: 承認状態', approved);
      } else {
        console.log('AuthContext: ユーザーなし、承認状態をfalseに設定');
        setIsApproved(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading,
    isApproved,
    checkApproval
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};