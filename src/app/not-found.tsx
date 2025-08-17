import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
                <div className="mb-6">
                    <h1 className="text-6xl font-bold text-purple-600 mb-2">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Sorry, the page you are looking for doesn&apos;t exist or has been moved.
                    </p>
                </div>

                <div className="space-y-4">
                    <Link
                        href="/"
                        className="inline-block w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200"
                    >
                        Go Back Home
                    </Link>

                    <Link
                        href="/product"
                        className="inline-block w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                    >
                        Browse Products
                    </Link>
                </div>

                <div className="mt-6 text-sm text-gray-500">
                    <p>Need help? Contact our support team</p>
                </div>
            </div>
        </div>
    );
}