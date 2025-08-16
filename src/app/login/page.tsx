"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithGoogle, signInWithEmail } from "@/lib/authActions";

export default function LoginPage() {
    const router = useRouter();

    async function handleLogin(formData: FormData) {
        const email = String(formData.get("email"));
        const password = String(formData.get("password"));
        await signInWithEmail(email, password);
        router.push("/");
    }

    async function handleGoogleLogin() {
        await signInWithGoogle();
        router.push("/");
    }

    return (
        <div className="max-w-sm mx-auto mt-10 bg-white shadow-md rounded-lg p-6 border border-purple-100">
            <h1 className="text-2xl font-bold mb-6 text-purple-700 text-center">Login</h1>

            {/* Email/Password Login */}
            <form action={handleLogin} className="space-y-4">
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
                    Login
                </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="px-2 text-sm text-gray-500">OR</span>
                <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Google Login Button (rectangular) */}
            <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center gap-3 w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                aria-label="Login with Google"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                    <path
                        fill="#EA4335"
                        d="M24 9.5c3.9 0 6.6 1.7 8.1 3.2l6-6C34.2 2.6 29.5 0 24 0 14.7 0 7 5.8 3.2 14.1l7 5.4C11.8 13.7 17.3 9.5 24 9.5z"
                    />
                    <path
                        fill="#4285F4"
                        d="M46.1 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.4c-.5 2.8-2.1 5.2-4.6 6.8l7.1 5.5c4.1-3.7 6.5-9.2 6.5-15.6z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M10.2 28.5c-.5-1.4-.8-2.9-.8-4.5s.3-3.1.8-4.5l-7-5.4C2.4 17 2 20.4 2 24s.4 7 1.2 9.9l7-5.4z"
                    />
                    <path
                        fill="#34A853"
                        d="M24 48c6.5 0 12-2.1 16-5.7l-7.1-5.5c-2 1.4-4.6 2.2-8.9 2.2-6.7 0-12.3-4.2-14.4-10l-7 5.4C7 42.2 14.7 48 24 48z"
                    />
                    <path fill="none" d="M0 0h48v48H0z" />
                </svg>
                Sign in with Google
            </button>

            {/* Signup link */}
            <p className="text-sm mt-4 text-center">
                New here?{" "}
                <Link className="text-purple-600 hover:underline" href="/signup">
                    Create an account
                </Link>
            </p>
        </div>
    );
}
