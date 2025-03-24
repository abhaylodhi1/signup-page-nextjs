'use client';

import useAuthStore from '../../app/store/store';

export default function GoogleSignIn() {
  const { loginWithGoogle } = useAuthStore();

  return (
    <div className="flex flex-col items-center mt-4">
      <button
        onClick={loginWithGoogle}
        className="flex items-center gap-2 bg-white text-black px-24 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
      >
        <svg className="w-5 h-5" viewBox="0 0 48 48">
          <path
            fill="#4285F4"
            d="M46.06 24.48c0-1.57-.14-3.08-.39-4.52H24v9.12h12.5c-.6 3.1-2.27 5.76-4.78 7.56v6.28h7.7c4.52-4.16 7.14-10.28 7.14-17.44z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.9-2.14 15.86-5.8l-7.7-6.28c-2.14 1.42-4.86 2.24-8.16 2.24-6.3 0-11.64-4.26-13.54-9.98H2.48v6.34C6.42 42.22 14.6 48 24 48z"
          />
          <path
            fill="#FBBC05"
            d="M10.46 28.18c-.5-1.42-.76-2.92-.76-4.46s.26-3.04.76-4.46V12.92H2.48A23.88 23.88 0 000 24c0 3.86.92 7.52 2.48 10.86l7.98-6.68z"
          />
          <path
            fill="#EA4335"
            d="M24 9.52c3.52 0 6.64 1.2 9.08 3.54l6.74-6.74C34.92 2.2 30.48 0 24 0 14.6 0 6.42 5.78 2.48 13.14l7.98 6.68c1.9-5.72 7.24-9.98 13.54-9.98z"
          />
        </svg>
        continue with Google
      </button>
    </div>
  );
}
