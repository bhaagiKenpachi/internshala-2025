import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: 'fan' | 'celebrity';
    fallback?: ReactNode;
}

export default function ProtectedRoute({
    children,
    requiredRole,
    fallback
}: ProtectedRouteProps) {
    const { user, loading } = useAuth();

    // Show loading while auth is being determined
    if (loading || user === undefined) {
        return <Layout><div className="p-6">Loading...</div></Layout>;
    }

    // Show fallback if provided, otherwise show default access denied
    if (fallback) {
        return <Layout>{fallback}</Layout>;
    }

    // Not logged in
    if (!user) {
        return (
            <Layout>
                <div className="p-6 max-w-md mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-4">🔐 Login Required</h2>
                    <p className="text-gray-600 mb-4">You need to be logged in to access this page.</p>
                    <a
                        href="/login"
                        className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                    >
                        Go to Login
                    </a>
                </div>
            </Layout>
        );
    }

    // Role check
    if (requiredRole && user.role !== requiredRole) {
        const correctPath = requiredRole === 'fan' ? '/fan/dashboard' : '/dashboard/celebrity';
        const correctName = requiredRole === 'fan' ? 'Fan Dashboard' : 'Celebrity Dashboard';

        return (
            <Layout>
                <div className="p-6 max-w-md mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-4">🚫 Access Denied</h2>
                    <p className="text-gray-600 mb-4">
                        This page is only for {requiredRole}s. You are logged in as a {user.role}.
                    </p>
                    <a
                        href={correctPath}
                        className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                    >
                        Go to {correctName}
                    </a>
                </div>
            </Layout>
        );
    }

    // User is authorized, show the content
    return <>{children}</>;
} 