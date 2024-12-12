import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  signUp as firebaseSignUp,
  signIn as firebaseSignIn,
  logOut as firebaseLogOut,
  onAuthStateChange
} from '../../firebase/authService';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../../firebase/firebaseConfig';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChange(async (firebaseUser) => {
        if (firebaseUser) {
          // Get additional user data from Firestore
          const db = getFirestore(app);
          try {
            const userDoc = await getDoc(doc(db, 'user_profiles', firebaseUser.uid));
            const userData = userDoc.data();
            setUser({
              ...firebaseUser,
              ...userData
            });
          } catch (error) {
            console.error('Error fetching user data:', error);
            setUser(firebaseUser);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Auth state change error:', error);
      setLoading(false);
      setError(error.message);
    }
  }, []);

  const signUp = async (email, password, userData) => {
    try {
      setError(null);
      const user = await firebaseSignUp(email, password, userData);
      return user;
    } catch (error) {
      console.error('Sign up error:', error);
      setError(error.message);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      setError(null);
      const user = await firebaseSignIn(email, password);
      return user;
    } catch (error) {
      console.error('Sign in error:', error);
      setError(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseLogOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      setError(error.message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 