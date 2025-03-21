'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import useAuthStore from '../../app/store/store';

export default function GoogleSignIn() {
  const router = useRouter();
  const { googleLogin } = useAuthStore();
  const [error, setError] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    window.handleGoogleLogin = async (response) => {
      const { credential } = response;
      try {
        await googleLogin(credential);
        router.push('/dashboard');
      } catch {
        setError('Google Login failed');
      }
    };
  }, [googleLogin, router]);

  return (
    <div className="flex flex-col items-center mt-4">
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <div
        id="g_id_onload"
        data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        data-callback="handleGoogleLogin"
        data-auto_prompt="false"
      ></div>

      <div
        className="g_id_signin"
        data-type="standard"
        data-size="large"
        data-theme="outline"
        data-text="signin_with"
        data-shape="rectangular"
        data-logo_alignment="left"
      ></div>
    </div>
  );
}
