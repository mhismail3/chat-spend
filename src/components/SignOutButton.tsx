import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const SignOutButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signOut();
    setLoading(false);
    if (error) setError(error.message);
    // Optionally, redirect or update UI
  };

  return (
    <div style={{ maxWidth: 320, margin: '16px auto' }}>
      <button
        onClick={handleSignOut}
        disabled={loading}
        style={{ width: '100%', padding: 8, background: '#eee', color: '#333', border: '1px solid #ccc', borderRadius: 4 }}
      >
        {loading ? 'Signing out...' : 'Sign Out'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default SignOutButton; 