#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase Setup Script for Tsunami Alert System');
console.log('================================================\n');

// Your Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD-G6NYyfIsjw7ZnC-fifokhJtO32Cw7UQ',
  authDomain: 'tsunamimvp-99bf1.firebaseapp.com',
  projectId: 'tsunamimvp-99bf1',
  storageBucket: 'tsunamimvp-99bf1.firebasestorage.app',
  messagingSenderId: '169910827087',
  appId: '1:169910827087:web:e8fa8f5a341a91ed52923a',
  measurementId: 'G-J402EYY6XJ',
};

// Create .env.local content
const envContent = `# Firebase Configuration (Your Actual Config)
NEXT_PUBLIC_FIREBASE_API_KEY=${firebaseConfig.apiKey}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${firebaseConfig.authDomain}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${firebaseConfig.projectId}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${firebaseConfig.storageBucket}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${firebaseConfig.messagingSenderId}
NEXT_PUBLIC_FIREBASE_APP_ID=${firebaseConfig.appId}
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${firebaseConfig.measurementId}

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# GraphQL API (Backend)
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
NEXT_PUBLIC_GRAPHQL_WS_ENDPOINT=ws://localhost:4000/graphql

# Environment
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_APP_VERSION=2.0.0

# Feature Flags
NEXT_PUBLIC_ENABLE_SUBSCRIPTIONS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
`;

// Write .env.local file
const envPath = path.join(__dirname, '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file successfully!');
  console.log(`📁 Location: ${envPath}\n`);

  console.log('🔥 Firebase Configuration Applied:');
  console.log(`   Project ID: ${firebaseConfig.projectId}`);
  console.log(`   Auth Domain: ${firebaseConfig.authDomain}`);
  console.log(`   Storage Bucket: ${firebaseConfig.storageBucket}`);
  console.log(`   Analytics: ${firebaseConfig.measurementId}\n`);

  console.log('🚀 Next Steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Visit: http://localhost:3000');
  console.log('3. Test Firebase authentication');
  console.log('4. Check console for Firebase Analytics initialization\n');

  console.log('🌐 For Production (Vercel):');
  console.log('Add these environment variables to your Vercel dashboard:');
  Object.entries(firebaseConfig).forEach(([key, value]) => {
    const envKey = `NEXT_PUBLIC_FIREBASE_${key
      .replace(/([A-Z])/g, '_$1')
      .toUpperCase()}`;
    console.log(`   ${envKey}=${value}`);
  });

  console.log('\n🎉 Firebase setup complete! Your Tsunami Alert System is ready.');
} catch (error) {
  console.error('❌ Error creating .env.local file:', error.message);
  console.log('\n📝 Manual Setup Required:');
  console.log('Create .env.local file manually with this content:');
  console.log('=====================================');
  console.log(envContent);
}
