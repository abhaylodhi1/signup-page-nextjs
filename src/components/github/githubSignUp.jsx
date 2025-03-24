'use client';

import useAuthStore from '../../app/store/store';

export default function GithubSignIn() {
  const { loginWithGithub } = useAuthStore();

  return (
    <div className="flex flex-col items-center mt-4">
      <button
        onClick={loginWithGithub}
        className="flex items-center gap-2 bg-gray-900 text-white px-7 py-2 rounded-lg shadow-md hover:bg-gray-800 transition-all duration-300"
      >
        <svg
          className="w-5 h-5"
          fill="white"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48 0-.23-.01-.83-.01-1.63-2.78.6-3.37-1.34-3.37-1.34-.45-1.14-1.1-1.44-1.1-1.44-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.12-4.56-5 0-1.1.39-2 1.03-2.71-.1-.26-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.03a9.64 9.64 0 012.5-.34c.85 0 1.7.11 2.5.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.37.2 2.38.1 2.64.64.71 1.03 1.61 1.03 2.71 0 3.89-2.34 4.75-4.57 5.01.36.31.69.91.69 1.83 0 1.32-.01 2.38-.01 2.71 0 .27.18.59.69.48A10.001 10.001 0 0022 12c0-5.52-4.48-10-10-10z"
          />
        </svg>
        GitHub
      </button>
    </div>
  );
}
