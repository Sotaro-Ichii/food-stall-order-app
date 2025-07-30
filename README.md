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

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{document} {
      allow read, write: if request.auth != null;
    }
    match /menuItems/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

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