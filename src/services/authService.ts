import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "../lib/firebase";

const upsertUserProfile = async (user: User) => {
  await setDoc(
    doc(db, "users", user.uid),
    {
      email: user.email,
      name: user.displayName ?? "Resume Builder User",
      avatarUrl: user.photoURL,
      locale: "en",
      country: "EG",
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    },
    { merge: true }
  );
};

export const registerWithEmail = async (email: string, password: string) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await upsertUserProfile(credential.user);
  return credential.user;
};

export const loginWithEmail = async (email: string, password: string) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await upsertUserProfile(credential.user);
  return credential.user;
};

export const loginWithGoogle = async () => {
  const credential = await signInWithPopup(auth, googleProvider);
  await upsertUserProfile(credential.user);
  return credential.user;
};

export const logout = () => signOut(auth);

export const listenForAuthUser = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
