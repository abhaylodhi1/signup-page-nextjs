'use client';

import useAuthStore from '../../app/store/store';

export default function FacebookSignIn() {
  const { loginWithFacebook } = useAuthStore();

  return (
    <div className="flex flex-col items-center mt-4">
      <button
        onClick={loginWithFacebook}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
      >
        <svg
          className="w-5 h-5"
          fill="white"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M22 12.07C22 6.55 17.52 2 12 2S2 6.55 2 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.02H7.9v-2.9h2.54V9.8c0-2.51 1.5-3.9 3.8-3.9 1.1 0 2.27.2 2.27.2v2.46H15.6c-1.25 0-1.64.78-1.64 1.56v1.88h2.79l-.45 2.9h-2.34v7.02C18.34 21.25 22 17.09 22 12.07z" />
        </svg>
        Facebook
      </button>
    </div>
  );
}
