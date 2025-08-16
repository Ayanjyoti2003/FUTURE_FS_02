"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUpWithEmail, signInWithGoogle } from "@/lib/authActions";

export default function SignupPage() {
    const router = useRouter();

    async function handleSignup(formData: FormData) {
        const name = String(formData.get("name") || "");
        const email = String(formData.get("email"));
        const password = String(formData.get("password"));
        await signUpWithEmail(email, password, name);
        router.push("/");
    }

    async function handleGoogleSignup() {
        await signInWithGoogle();
        router.push("/");
    }

    return (
        <div className="max-w-sm mx-auto mt-10 bg-white shadow-md rounded-lg p-6 border border-purple-100">
            <h1 className="text-2xl font-bold mb-6 text-purple-700 text-center">Sign Up</h1>

            <form action={handleSignup} className="space-y-4">
                <input
                    className="w-full border border-purple-300 focus:border-purple-500 px-3 py-2 rounded outline-none"
                    name="name"
                    placeholder="Full name (optional)"
                />
                <input
                    className="w-full border border-purple-300 focus:border-purple-500 px-3 py-2 rounded outline-none"
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                />
                <input
                    className="w-full border border-purple-300 focus:border-purple-500 px-3 py-2 rounded outline-none"
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                />
                <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition-colors">
                    Create account
                </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="px-2 text-sm text-gray-500">OR</span>
                <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Google Signup */}
            <button
                onClick={handleGoogleSignup}
                className="flex items-center justify-center gap-2 w-full border border-purple-300 text-purple-700 px-3 py-2 rounded hover:bg-purple-50 transition-colors"
            >
                <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
                Continue with Google
            </button>

            {/* Login link */}
            <p className="text-sm mt-4 text-center">
                Already have an account?{" "}
                <Link className="text-purple-600 hover:underline" href="/login">
                    Login
                </Link>
            </p>
        </div>
    );
}
