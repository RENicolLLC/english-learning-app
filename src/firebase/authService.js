import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import app from './firebaseConfig';

const auth = getAuth(app);
const db = getFirestore(app);

const executeRecaptcha = async () => {
  try {
    const token = await window.grecaptcha.execute('6LdLQZcqAAAAPoN-1lizbX5kMCvXwiVV4qFBHL7', { action: 'submit' });
    return token;
  } catch (error) {
    console.error('reCAPTCHA error:', error);
    throw new Error('Failed to verify reCAPTCHA');
  }
};

export const signUp = async (email, password, userData) => {
  try {
    // Verify reCAPTCHA first
    await executeRecaptcha();
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name if provided
    if (userData.display_name) {
      await updateProfile(user, {
        displayName: userData.display_name
      });
    }

    // Create user profile document in Firestore
    await setDoc(doc(db, 'user_profiles', user.uid), {
      email: userData.email,
      display_name: userData.display_name,
      native_language: userData.native_language,
      target_language: 'en',
      learning_level: 1,
      xp_points: 0,
      streak_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      is_premium: false
    });

    return user;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    // Verify reCAPTCHA first
    await executeRecaptcha();
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Update last login
    await setDoc(doc(db, 'user_profiles', userCredential.user.uid), {
      last_login: new Date().toISOString()
    }, { merge: true });
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export default {
  signUp,
  signIn,
  logOut,
  getCurrentUser,
  onAuthStateChange
}; 