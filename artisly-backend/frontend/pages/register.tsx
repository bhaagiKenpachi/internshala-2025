import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('fan');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async () => {
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:3001/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const user = await res.json();
            console.log('Registration successful:', user);

            // Redirect to login page after successful registration
            router.push('/login');
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Register</h1>

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

            <select
                className="border p-2 w-full mb-4"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
            >
                <option value="fan">Fan</option>
                <option value="celebrity">Celebrity</option>
            </select>

            <button
                onClick={handleRegister}
                className={`w-full px-4 py-2 text-white ${loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
                disabled={loading}
            >
                {loading ? 'Creating account...' : 'Register'}
            </button>

            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-600 hover:underline">Login here</a>
                </p>
            </div>
        </div>
    );
} 