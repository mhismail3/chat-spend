'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const AuthCallbackPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      // Supabase should handle session automatically, but we check and give feedback
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        setStatus('success');
        setTimeout(() => router.replace('/dashboard'), 1000);
      } else if (error) {
        setStatus('error');
        setErrorMsg(error.message);
        setTimeout(() => router.replace('/'), 2000);
      } else {
        setStatus('error');
        setErrorMsg('No session found. Please try logging in again.');
        setTimeout(() => router.replace('/'), 2000);
      }
    };
    checkSession();
  }, [router]);

  return (
    <div style={{ textAlign: 'center', marginTop: 64 }}>
      {status === 'checking' && 'Signing you in...'}
      {status === 'success' && 'Login successful! Redirecting to dashboard...'}
      {status === 'error' && (
        <>
          <div style={{ color: 'red' }}>Authentication failed: {errorMsg}</div>
          <div>Redirecting to login...</div>
        </>
      )}
    </div>
  );
};

export default AuthCallbackPage; 