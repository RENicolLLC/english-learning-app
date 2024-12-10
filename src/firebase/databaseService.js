import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  query,
  where,
  collection,
  getDocs
} from 'firebase/firestore';
import app from './firebaseConfig';

const db = getFirestore(app);

// User Profile Operations
export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, 'user_profiles', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (userId, data) => {
  try {
    const docRef = doc(db, 'user_profiles', userId);
    await updateDoc(docRef, {
      ...data,
      updated_at: new Date().toISOString()
    });
    return true;
  } catch (error) {
    throw error;
  }
};

// User Progress Operations
export const saveProgress = async (userId, progressData) => {
  try {
    const docRef = doc(db, 'user_progress', `${userId}_${progressData.content_id}`);
    await setDoc(docRef, {
      user_id: userId,
      ...progressData,
      updated_at: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    throw error;
  }
};

export const getUserProgress = async (userId, contentType) => {
  try {
    const q = query(
      collection(db, 'user_progress'),
      where('user_id', '==', userId),
      where('content_type', '==', contentType)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    throw error;
  }
};

// Achievement Operations
export const saveAchievement = async (userId, achievementData) => {
  try {
    const docRef = doc(db, 'user_achievements', `${userId}_${achievementData.achievement_type}`);
    await setDoc(docRef, {
      user_id: userId,
      ...achievementData,
      unlocked_at: new Date().toISOString()
    });
    return true;
  } catch (error) {
    throw error;
  }
};

export const getUserAchievements = async (userId) => {
  try {
    const q = query(
      collection(db, 'user_achievements'),
      where('user_id', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    throw error;
  }
};

// XP and Streak Operations
export const updateUserXP = async (userId, xpToAdd) => {
  try {
    const userRef = doc(db, 'user_profiles', userId);
    const userDoc = await getDoc(userRef);
    const currentXP = userDoc.data().xp_points || 0;
    
    await updateDoc(userRef, {
      xp_points: currentXP + xpToAdd,
      updated_at: new Date().toISOString()
    });
    return true;
  } catch (error) {
    throw error;
  }
};

export const updateStreak = async (userId) => {
  try {
    const userRef = doc(db, 'user_profiles', userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    const lastLogin = new Date(userData.last_login);
    const now = new Date();
    const dayDiff = Math.floor((now - lastLogin) / (1000 * 60 * 60 * 24));
    
    let newStreak = userData.streak_count || 0;
    if (dayDiff === 1) {
      newStreak += 1;
    } else if (dayDiff > 1) {
      newStreak = 0;
    }
    
    await updateDoc(userRef, {
      streak_count: newStreak,
      last_login: now.toISOString(),
      updated_at: now.toISOString()
    });
    
    return newStreak;
  } catch (error) {
    throw error;
  }
};

export default {
  getUserProfile,
  updateUserProfile,
  saveProgress,
  getUserProgress,
  saveAchievement,
  getUserAchievements,
  updateUserXP,
  updateStreak
}; 