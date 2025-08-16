// src/lib/firebaseAdmin.ts
import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

let app: App;

if (!getApps().length) {
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID!;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL!;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY!;

    app = initializeApp({
        credential: cert({
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
    });
} else {
    app = getApps()[0]!;
}

export const adminAuth = getAuth(app);

export async function verifyBearer(token?: string) {
    if (!token) return null;
    try {
        return await adminAuth.verifyIdToken(token);
    } catch (err) {
        console.error("Invalid Firebase token", err);
        return null;
    }
}

// 👇 Default export with `.auth()` for compatibility
export default {
    auth: () => adminAuth,
    verifyBearer,
};
