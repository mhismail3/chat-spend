import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const AuthCallbackPage = () => {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      // Supabase will handle session automatically, but we can check
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        router.replace('/');
      } else if (error) {
        // Optionally show error
        alert('Authentication failed: ' + error.message);
        router.replace('/');
      }
    };
    checkSession();
  }, [router]);

  return <div style={{ textAlign: 'center', marginTop: 64 }}>Signing you in...</div>;
};

export default AuthCallbackPage; 