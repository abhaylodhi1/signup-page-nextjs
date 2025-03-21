'use client';

import useAuthStore from '../../app/store/store';

export default function FacebookSignIn() {
  const { loginWithFacebook } = useAuthStore();

  return (
    <div className="flex flex-col items-center mt-4">
      <button
        onClick={loginWithFacebook}
        className="bg-blue-600 text-white border border-blue-700 p-2 rounded-md hover:bg-blue-700"
      >
        Sign in with Facebook
      </button>
    </div>
  );
}
