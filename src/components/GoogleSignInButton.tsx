import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const GoogleSignInButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) setError(error.message);
    // On success, user will be redirected
  };

  return (
    <div style={{ maxWidth: 320, margin: '16px auto' }}>
      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        style={{ width: '100%', padding: 8, background: '#4285F4', color: 'white', border: 'none', borderRadius: 4 }}
      >
        {loading ? 'Redirecting...' : 'Sign in with Google'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default GoogleSignInButton; 