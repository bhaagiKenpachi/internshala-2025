import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);

      // Get the user from context to determine redirect
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (user.role === 'fan') {
        router.push('/fan/dashboard');
      } else if (user.role === 'celebrity') {
        router.push('/dashboard/celebrity');
      } else {
        setError('Invalid user role');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Login</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <input
        className="border p-2 w-full mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <input
        className="border p-2 w-full mb-4"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      <button
        onClick={handleLogin}
        className={`w-full px-4 py-2 text-white ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Test Accounts:</strong></p>
        <p>Fan: email: fan, password: 1234</p>
        <p>Celebrity: email: celebrity, password: 1234</p>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">Register here</a>
        </p>
      </div>
    </div>
  );
}
