const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Load environment variables
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample data
const sampleData = {
  lessons: [
    {
      title: "Basic Greetings",
      level: "beginner",
      content: "Hello, Hi, Good morning, Good afternoon",
      translations: {
        chinese: "你好，嗨，早上好，下午好",
        japanese: "こんにちは、やあ、おはようございます、こんにちは",
        korean: "안녕하세요, 안녕, 좋은 아침이에요, 좋은 오후예요"
      }
    },
    {
      title: "Numbers 1-10",
      level: "beginner",
      content: "One, Two, Three, Four, Five...",
      translations: {
        chinese: "一，二，三，四，五...",
        japanese: "一つ、二つ、三つ、四つ、五つ...",
        korean: "하나, 둘, 셋, 넷, 다섯..."
      }
    }
  ],
  users: [
    {
      email: "test@example.com",
      nativeLanguage: "chinese",
      level: "beginner",
      subscription: "free"
    }
  ]
};

async function populateFirestore() {
  try {
    console.log('Starting database population...');
    
    // Add lessons
    for (const lesson of sampleData.lessons) {
      await addDoc(collection(db, "lessons"), lesson);
      console.log("Added lesson:", lesson.title);
    }

    // Add users
    for (const user of sampleData.users) {
      await addDoc(collection(db, "users"), user);
      console.log("Added user:", user.email);
    }

    console.log("Database populated successfully!");
  } catch (error) {
    console.error("Error populating database:", error);
  }
}

// Check if Firebase config is set
if (!firebaseConfig.apiKey || !firebaseConfig.appId) {
  console.error("Firebase configuration is missing. Please check your .env file");
  process.exit(1);
}

populateFirestore(); 