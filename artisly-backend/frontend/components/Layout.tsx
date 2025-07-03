import Link from 'next/link';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-4 gap-3">
        <h2 className="text-2xl font-bold mb-6">CelebNetwork</h2>
        <nav className="space-y-3">
          <Link href="/" className="block hover:text-blue-300">🏠 Home</Link>
          <Link href="/celebrity/signup" className="block hover:text-blue-300">📝 Onboard Celebrity</Link>
          <Link href="/fan/dashboard" className="block hover:text-blue-300">🙋 Fan Dashboard</Link>
          <Link href="/dashboard/celebrity" className="block hover:text-blue-300">🌟 Celebrity Dashboard</Link>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
}
