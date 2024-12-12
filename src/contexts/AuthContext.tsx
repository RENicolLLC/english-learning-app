import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User, EnglishLevel, SubscriptionTier } from '../types/user';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  register: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as User);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (email: string, password: string, newUserData: Partial<User>) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    const userData: User = {
      id: user.uid,
      email: user.email!,
      firstName: newUserData.firstName || '',
      lastName: newUserData.lastName || '',
      nativeLanguage: newUserData.nativeLanguage || 'en',
      englishLevel: newUserData.englishLevel || EnglishLevel.BEGINNER,
      subscriptionTier: SubscriptionTier.FREE,
      createdAt: new Date(),
      lastLogin: new Date(),
      dailyLessonsCompleted: 0,
      dailyLessonsLimit: 5,
      streak: 0,
      totalLessonsCompleted: 0,
    };

    await setDoc(doc(db, 'users', user.uid), userData);
    setUserData(userData);
  };

  const login = async (email: string, password: string) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      await setDoc(doc(db, 'users', user.uid), {
        ...userData,
        lastLogin: new Date()
      }, { merge: true });
      setUserData(userData);
    }
  };

  const logout = () => signOut(auth);

  const updateUserData = async (data: Partial<User>) => {
    if (!currentUser) throw new Error('No user logged in');
    
    const updatedData = { ...userData, ...data };
    await setDoc(doc(db, 'users', currentUser.uid), updatedData, { merge: true });
    setUserData(updatedData as User);
  };

  const value = {
    currentUser,
    userData,
    loading,
    register,
    login,
    logout,
    updateUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 