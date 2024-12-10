import { db } from './firebaseConfig';
import { collection, doc, setDoc } from 'firebase/firestore';

// Collection names
export const COLLECTIONS = {
  USER_PROFILES: 'user_profiles',
  USER_PROGRESS: 'user_progress',
  USER_ACHIEVEMENTS: 'user_achievements'
};

// Initialize database schema
export const initializeSchema = async () => {
  // Create collections with a dummy doc (Firestore requires this)
  const collections = Object.values(COLLECTIONS);
  
  for (const collectionName of collections) {
    const dummyDoc = doc(collection(db, collectionName), 'schema');
    await setDoc(dummyDoc, {
      schemaVersion: 1,
      created: new Date().toISOString()
    }, { merge: true });
  }
};

// Schema validation rules (for reference - actual rules are in Firebase Console)
export const schemaRules = {
  user_profiles: {
    fields: {
      email: 'string',
      username: 'string',
      learning_level: 'number',
      native_language: 'string',
      target_language: 'string',
      xp_points: 'number',
      streak_count: 'number',
      last_login: 'timestamp',
      created_at: 'timestamp',
      updated_at: 'timestamp'
    }
  },
  user_progress: {
    fields: {
      user_id: 'string',
      content_type: 'string', // 'vocabulary', 'grammar', 'scenario'
      content_id: 'string',
      progress_data: 'map',
      last_reviewed: 'timestamp',
      next_review: 'timestamp',
      created_at: 'timestamp',
      updated_at: 'timestamp'
    }
  },
  user_achievements: {
    fields: {
      user_id: 'string',
      achievement_type: 'string',
      achievement_data: 'map',
      unlocked_at: 'timestamp'
    }
  }
};

// Security rules (to be copied to Firebase Console)
export const securityRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // User profiles
    match /user_profiles/{userId} {
      allow read: if isSignedIn() && isOwner(userId);
      allow create: if isSignedIn() && isOwner(userId);
      allow update: if isSignedIn() && isOwner(userId);
      allow delete: if false; // Don't allow deletion
    }

    // User progress
    match /user_progress/{progressId} {
      allow read: if isSignedIn() && isOwner(resource.data.user_id);
      allow create: if isSignedIn() && isOwner(request.resource.data.user_id);
      allow update: if isSignedIn() && isOwner(resource.data.user_id);
      allow delete: if false;
    }

    // User achievements
    match /user_achievements/{achievementId} {
      allow read: if isSignedIn() && isOwner(resource.data.user_id);
      allow create: if isSignedIn() && isOwner(request.resource.data.user_id);
      allow update: if false; // Achievements shouldn't be updated
      allow delete: if false;
    }
  }
}
`; 