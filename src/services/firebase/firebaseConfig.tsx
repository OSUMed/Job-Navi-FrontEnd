import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";

// Type assertion for environment variables can be helpful
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Use environment variables for sensitive data
const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env
    .VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

// Initialize Firebase
console.log("Initializing Firebase");
const app = initializeApp(firebaseConfig);
console.log("Firebase Initialized");
const auth = getAuth(app);

// Function to create a user
const authCreateAccountWithEmail = async (
  email: string,
  password: string
): Promise<void> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User created: ", userCredential.user);
  } catch (error: any) {
    // use 'any' or create a custom error type based on your error structure
    console.error("Error signing up: ", error);
  }
};

const authSignInWithEmail = async (
  email: string,
  password: string
): Promise<void> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User signed in: ", userCredential.user);
  } catch (error: any) {
    // use 'any' or create a custom error type based on your error structure
    console.error("Error signing in: ", error);
    throw error; // re-throw the error so it can be caught and handled in the component
  }
};

export { auth, authCreateAccountWithEmail, authSignInWithEmail };
