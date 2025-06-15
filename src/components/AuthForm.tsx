import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMessage('Check your email for a magic link!');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: '0 auto' }}>
      <h2>Sign in with Email</h2>
      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        disabled={loading}
        style={{ width: '100%', padding: 8, marginBottom: 8 }}
      />
      <button type="submit" disabled={loading || !email} style={{ width: '100%', padding: 8 }}>
        {loading ? 'Sending...' : 'Send Magic Link'}
      </button>
      {message && <div style={{ color: 'green', marginTop: 8 }}>{message}</div>}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </form>
  );
};

export default AuthForm; 