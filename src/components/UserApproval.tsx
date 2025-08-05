import React, { useState, useEffect } from 'react';
import { X, Check, X as RejectIcon, Clock, Users } from 'lucide-react';
import { collection, query, getDocs, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface PendingUser {
  id: string;
  email: string;
  createdAt: Date;
  status: string;
}

const UserApproval: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const loadPendingUsers = async () => {
    try {
      const q = query(collection(db, 'pendingUsers'));
      const querySnapshot = await getDocs(q);
      const users: PendingUser[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
          id: doc.id,
          email: data.email,
          createdAt: data.createdAt?.toDate() || new Date(),
          status: data.status
        });
      });
      
      setPendingUsers(users);
    } catch (error) {
      console.error('Error loading pending users:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (userId: string, email: string) => {
    try {
      // 承認済みユーザーリストに追加
      await setDoc(doc(db, 'approvedUsers', userId), {
        email: email,
        approvedAt: new Date(),
        approvedBy: 'admin'
      });
      
      // 承認待ちリストから削除
      await deleteDoc(doc(db, 'pendingUsers', userId));
      
      // リストを更新
      await loadPendingUsers();
    } catch (error) {
      console.error('Error approving user:', error);
      alert('ユーザーの承認に失敗しました');
    }
  };

  const rejectUser = async (userId: string) => {
    try {
      // 承認待ちリストから削除
      await deleteDoc(doc(db, 'pendingUsers', userId));
      
      // リストを更新
      await loadPendingUsers();
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('ユーザーの拒否に失敗しました');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            ユーザー承認管理
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-96">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">読み込み中...</p>
            </div>
          ) : pendingUsers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              承認待ちのユーザーはいません
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {pendingUsers.map((user) => (
                <div key={user.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-yellow-500 mr-2" />
                        <span className="font-medium text-gray-800">{user.email}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        登録日: {user.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => approveUser(user.id, user.email)}
                        className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                        title="承認"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => rejectUser(user.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                        title="拒否"
                      >
                        <RejectIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserApproval; 