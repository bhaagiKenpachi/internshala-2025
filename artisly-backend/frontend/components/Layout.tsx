import Link from 'next/link';
import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-4 gap-3">
        <h2 className="text-2xl font-bold mb-6">CelebNetwork</h2>

        {/* User info */}
        {user && (
          <div className="bg-gray-800 p-3 rounded mb-4">
            <p className="text-sm text-gray-300">Logged in as:</p>
            <p className="font-semibold">{user.email}</p>
            <p className="text-xs text-blue-300 capitalize">{user.role}</p>
          </div>
        )}

        <nav className="space-y-3">
          <Link href="/" className="block hover:text-blue-300">🏠 Home</Link>

          {/* Authentication links */}
          {!user ? (
            <>
              <Link href="/login" className="block hover:text-blue-300">🔐 Login</Link>
              <Link href="/register" className="block hover:text-blue-300">📝 Register</Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="block w-full text-left hover:text-red-300 text-red-400"
            >
              🚪 Logout
            </button>
          )}

          {/* Role-specific dashboard links */}
          {user?.role === 'fan' && (
            <Link href="/fan/dashboard" className="block hover:text-blue-300">🙋 My Fan Dashboard</Link>
          )}

          {user?.role === 'celebrity' && (
            <Link href="/dashboard/celebrity" className="block hover:text-blue-300">🌟 My Celebrity Dashboard</Link>
          )}

          {/* Admin/General links */}
          <Link href="/celebrity/signup" className="block hover:text-blue-300">📝 Onboard Celebrity</Link>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
}
