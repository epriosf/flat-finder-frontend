import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from '../config/firebase';

const TOKEN_KEY = 'authToken';

// Set persistence to 'local' to use localStorage
export const initializeAuthPersistence = async (): Promise<void> => {
  await setPersistence(auth, browserLocalPersistence);
};

// Sign in function
export const loginUser = async (
  email: string,
  password: string,
): Promise<User> => {
  console.log(email, password);
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  console.log('User logged in:', userCredential);
  return userCredential.user;
};

// Sign out function
export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

// Listen for authentication state changes
export const onAuthStateChange = (
  callback: (user: User | null) => void,
): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
