import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCLzu240IH5nnUPRfLufHKxsz6EvaVLzsM",
  authDomain: "food-stall-order-app.firebaseapp.com",
  projectId: "food-stall-order-app",
  storageBucket: "food-stall-order-app.firebasestorage.app",
  messagingSenderId: "477188771681",
  appId: "1:477188771681:web:14e374bbd4df63444b7f20"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);