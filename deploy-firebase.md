# Firebase デプロイ手順

## 1. Firebase CLIのインストール
```bash
npm install -g firebase-tools
```

## 2. Firebaseにログイン
```bash
firebase login
```

## 3. プロジェクトの初期化（初回のみ）
```bash
firebase init
```

以下のオプションを選択：
- Firestore
- Hosting（必要に応じて）

## 4. Firestoreセキュリティルールのデプロイ
```bash
firebase deploy --only firestore:rules
```

## 5. 初期データの設定

Firebase Consoleで以下のコレクションを作成：

### approvedUsers コレクション
管理者ユーザーを追加：
```json
{
  "email": "demo@foodstall.com",
  "approvedAt": "2024-01-01T00:00:00.000Z",
  "approvedBy": "admin"
}
```

### pendingUsers コレクション
新規登録ユーザーが自動的に追加されます。

### menuItems コレクション
初期メニューアイテムを追加：
```json
{
  "name": "サンプルメニュー",
  "price": 1000
}
```

## 6. 認証設定

Firebase Console > Authentication > Sign-in method で以下を有効化：
- Email/Password

## 7. アプリケーションのデプロイ
```bash
npm run build
firebase deploy --only hosting
```

## 注意事項
- セキュリティルールは本番環境にデプロイする前にテストしてください
- 管理者メールアドレス（demo@foodstall.com）は実際の管理者のメールアドレスに変更してください 