// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCr2w1q-fgqcN921YD_zarfq2CkjhBrz4M",
  authDomain: "englishlearningapp-86c7a.firebaseapp.com",
  projectId: "englishlearningapp-86c7a",
  storageBucket: "englishlearningapp-86c7a.firebasestorage.app",
  messagingSenderId: "654860796672",
  appId: "1:654860796672:web:6bb8fc737067eacc76e9e5",
  measurementId: "G-FT3MNQ8653"
};

// Initialize Firebase
let app;

try {
  app = initializeApp(firebaseConfig);
  
  // Only initialize analytics if window is available (client-side)
  if (typeof window !== 'undefined') {
    try {
      const analytics = getAnalytics(app);
    } catch (error) {
      console.error('Analytics initialization error:', error);
    }
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

export default app; 