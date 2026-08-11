import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type User,
  type Unsubscribe,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

import { auth } from "../config/firebase";

function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return "No fue posible iniciar sesión. Inténtalo nuevamente.";
  }

  switch (error.code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "El correo o la contraseña no son correctos.";
    case "auth/invalid-email":
      return "Ingresa un correo electrónico válido.";
    case "auth/user-disabled":
      return "Esta cuenta se encuentra deshabilitada.";
    case "auth/too-many-requests":
      return "Se realizaron demasiados intentos. Espera unos minutos e inténtalo nuevamente.";
    case "auth/network-request-failed":
      return "No fue posible conectarse con Firebase. Revisa tu conexión a internet.";
    default:
      return "No fue posible iniciar sesión. Inténtalo nuevamente.";
  }
}

async function login(email: string, password: string): Promise<User> {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    return credential.user;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

async function logout(): Promise<void> {
  await signOut(auth);
}

function observeAuth(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

export const authService = {
  auth,
  login,
  logout,
  observeAuth,
};