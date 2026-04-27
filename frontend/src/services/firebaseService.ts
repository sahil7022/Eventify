import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc,
  query,
  where,
  deleteDoc
} from "firebase/firestore";
import { auth, db } from "../config/firebase";

export const firebaseService = {
  // Auth
  register: async (data: any) => {
    const { email, password, name, ...profileData } = data;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

    // Store additional profile info in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      ...profileData,
      role: profileData.role || 'participant',
      created_at: new Date().toISOString()
    });

    return { user };
  },

  login: async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Fetch profile
    const profileSnap = await getDoc(doc(db, "users", user.uid));
    const profile = profileSnap.exists() ? profileSnap.data() : {};

    return { 
      user: {
        id: user.uid,
        email: user.email,
        name: user.displayName,
        role: profile.role || 'participant'
      },
      token: await user.getIdToken()
    };
  },

  logout: async () => {
    await signOut(auth);
  },

  // Events
  getEvents: async () => {
    const querySnapshot = await getDocs(collection(db, "events"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  createEvent: async (eventData: any) => {
    const docRef = await addDoc(collection(db, "events"), {
      ...eventData,
      created_at: new Date().toISOString()
    });
    return { id: docRef.id, ...eventData };
  },

  // Registrations (Bookings)
  registerForEvent: async (registrationData: any) => {
    const docRef = await addDoc(collection(db, "registrations"), {
      ...registrationData,
      registration_date: new Date().toISOString()
    });
    return { id: docRef.id };
  },

  getUserRegistrations: async (userId: string) => {
    const q = query(collection(db, "registrations"), where("user_id", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Profiles
  getProfile: async (userId: string) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  },

  updateProfile: async (userId: string, data: any) => {
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, data);
    return { success: true };
  }
};
