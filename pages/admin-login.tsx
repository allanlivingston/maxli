import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      router.push('/admin');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-900">
      <form onSubmit={handleLogin} className="bg-stone-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-emerald-300">Admin Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 bg-stone-700 text-white rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 bg-stone-700 text-white rounded"
        />
        <button type="submit" className="w-full p-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">
          Log In
        </button>
      </form>
    </div>
  );
}
