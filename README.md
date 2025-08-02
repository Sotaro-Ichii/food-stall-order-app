<<<<<<< HEAD
# Food Stall Order Management System

A mobile-first web application designed to digitize paper-based order workflows for food stalls and small restaurants.

## Features

- **Firebase Authentication**: Secure email/password login
- **Real-time Order Management**: Create, track, and complete orders instantly
- **Mobile-Optimized Interface**: Large buttons and touch-friendly design
- **Analytics Dashboard**: Daily sales reports with CSV export
- **Performance Optimized**: Handles up to 10,000 orders per day

## Setup Instructions

### 1. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Email/Password provider
3. Create a Firestore database in production mode
4. Copy your Firebase config and replace the placeholder in `src/config/firebase.ts`

### 2. Firestore Security Rules
=======
# 屋台注文管理アプリ

屋台の注文をデジタルで管理するWebアプリケーションです。紙ベースのワークフローをデジタル化し、効率的な注文管理を実現します。

## 機能

- **認証機能**: Firebase Authenticationを使用したログイン
- **注文入力**: 大きなボタンで簡単な注文入力
- **注文管理**: 保留中・完了済み注文の管理
- **売上分析**: 日次売上統計とCSVエクスポート
- **リアルタイム更新**: Firestoreを使用したリアルタイムデータ同期
- **モバイル対応**: レスポンシブデザインでモバイルフレンドリー

## 技術スタック

- **フロントエンド**: Next.js 14, React 18, TypeScript
- **スタイリング**: Tailwind CSS
- **バックエンド**: Firebase (Firestore, Authentication)
- **デプロイ**: Vercel

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd food-stall-order-app
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. Firebaseプロジェクトの設定

1. [Firebase Console](https://console.firebase.google.com/)で新しいプロジェクトを作成
2. Authenticationを有効化し、メール/パスワード認証を設定
3. Firestore Databaseを作成
4. プロジェクト設定からWebアプリを追加し、設定情報を取得

### 4. 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. Firestoreセキュリティルールの設定

Firestoreのセキュリティルールを以下のように設定：
>>>>>>> 9b74d41 (change responsible design)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{document} {
      allow read, write: if request.auth != null;
    }
<<<<<<< HEAD
    match /menuItems/{document} {
      allow read, write: if request.auth != null;
    }
=======
>>>>>>> 9b74d41 (change responsible design)
  }
}
```

<<<<<<< HEAD
### 3. Firestore Indexes

Create the following indexes:

#### For Analytics Queries (Composite Index #1)
1. Go to Firebase Console → Firestore Database → Indexes tab
2. Click "Create Index"
3. Collection ID: `orders`
4. Add fields:
   - Field: `status`, Order: Ascending
   - Field: `completedAt`, Order: Ascending
5. Click "Create"

#### For Reset Daily Count (Composite Index #2)
1. Go to Firebase Console → Firestore Database → Indexes tab
2. Click "Create Index"
3. Collection ID: `orders`
4. Add fields:
   - Field: `status`, Order: Ascending
   - Field: `completedAt`, Order: Ascending
5. Click "Create"

**Note**: If you encounter an error with a direct link to create the index, click that link to automatically create the required index.

#### For Menu Items Ordering (Single-field Index)
1. Go to Firebase Console → Firestore Database → Indexes tab
2. Click "Create Index"
3. Collection ID: `menuItems`
4. Add field:
   - Field: `createdAt`, Order: Ascending
5. Click "Create"

**Note**: Index creation may take several minutes to complete.

### 4. Authentication Setup

Create a user account in Firebase Authentication console for accessing the app.

### 5. Development

```bash
npm install
npm run dev
```

### 6. Deployment on Vercel

1. Connect your GitHub repository to Vercel
2. Deploy with default settings
3. The app will be available at your Vercel domain

## Usage

1. **Login**: Use your Firebase credentials to access the app
2. **Order Entry**: Tap menu item buttons to create new orders
3. **Order Management**: View pending orders and mark them as complete
4. **Analytics**: Review daily sales and export data

## Performance Notes

- Displays latest 100 pending orders for optimal performance
- Real-time updates using Firestore listeners
- Optimized for mobile devices and touch interfaces
- Handles high-volume order processing efficiently

## Tech Stack

- React + TypeScript
- Firebase (Auth + Firestore)
- Tailwind CSS
- Vite
- Date-fns for date formatting

## Deployment

This project is ready for deployment on Vercel. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Deploy with default Vite settings

The app will automatically build and deploy. No additional configuration needed!
=======
### 6. 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは `http://localhost:3000` で起動します。

### 7. Vercelへのデプロイ

1. [Vercel](https://vercel.com/)にアカウントを作成
2. GitHubリポジトリを接続
3. 環境変数をVercelプロジェクト設定で設定
4. デプロイを実行

## 使用方法

### ログイン
- 初回アクセス時にログイン画面が表示されます
- Firebase Authenticationで設定したメールアドレスとパスワードでログイン

### 注文入力
- 各メニューアイテムの大きなボタンをタップして注文を作成
- 保留中の注文数が上部に表示されます

### 注文管理
- 保留中の注文一覧を確認
- 「完了」ボタンで注文を完了としてマーク
- 完了済み注文は折りたたみ可能なセクションに移動

### 売上分析
- 今日の売上統計を確認
- CSVファイルとしてエクスポート可能
- 日次リセット機能

## パフォーマンス最適化

- 保留中注文は最新100件まで表示（レンダリング負荷軽減）
- リアルタイム更新でスムーズな操作感
- 1日10,000件の注文に対応

## ライセンス

MIT License
>>>>>>> 9b74d41 (change responsible design)
