'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';  // Note: changed from 'next/router'
import { supabase } from '../../lib/supabaseClient';

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
      <form onSubmit={handleLogin} className="bg-stone-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-emerald-300 text-center">Admin Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 bg-stone-700 text-white rounded border border-stone-600 focus:border-emerald-500 focus:outline-none"
        />
        <button type="submit" className="w-full p-3 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition duration-150">
          Log In
        </button>
      </form>
    </div>
  );
}
