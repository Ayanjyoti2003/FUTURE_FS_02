import { auth } from "@/lib/firebaseClient";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

async function callSyncAPI() {
    const token = await auth.currentUser?.getIdToken();
    if (!token) return;
    await fetch("/api/auth/sync", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    await callSyncAPI();
}

export async function signInWithEmail(email: string, password: string) {
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    await signInWithEmailAndPassword(auth, email, password);
    await callSyncAPI();
}

export async function signUpWithEmail(email: string, password: string, name?: string) {
    const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    if (name) await updateProfile(user, { displayName: name });
    await callSyncAPI();
}
