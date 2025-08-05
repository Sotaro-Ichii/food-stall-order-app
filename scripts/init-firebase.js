import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCLzu240IH5nnUPRfLufHKxsz6EvaVLzsM",
  authDomain: "food-stall-order-app.firebaseapp.com",
  projectId: "food-stall-order-app",
  storageBucket: "food-stall-order-app.firebasestorage.app",
  messagingSenderId: "477188771681",
  appId: "1:477188771681:web:14e374bbd4df63444b7f20"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function initializeFirebase() {
  try {
    console.log('Firebase初期データを設定中...');

    // 管理者ユーザーを承認済みリストに追加
    await setDoc(doc(db, 'approvedUsers', 'admin-demo'), {
      email: 'demo@foodstall.com',
      approvedAt: new Date(),
      approvedBy: 'admin'
    });
    console.log('✅ 管理者ユーザーを承認済みリストに追加しました');

    // サンプルメニューアイテムを追加
    await setDoc(doc(db, 'menuItems', 'sample-1'), {
      name: 'ハンバーガー',
      price: 800
    });

    await setDoc(doc(db, 'menuItems', 'sample-2'), {
      name: 'フライドポテト',
      price: 400
    });

    await setDoc(doc(db, 'menuItems', 'sample-3'), {
      name: 'コーラ',
      price: 200
    });

    console.log('✅ サンプルメニューアイテムを追加しました');
    console.log('🎉 Firebase初期データの設定が完了しました！');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
  }
}

initializeFirebase(); 