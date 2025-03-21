'use client';

import useAuthStore from '../../app/store/store';

export default function GithubSignIn() {
  const { loginWithGithub } = useAuthStore();

  return (
    <div className="flex flex-col items-center mt-4">
      <button
        onClick={loginWithGithub}
        className="bg-white text-black border border-gray-300 p-2 rounded-md hover:bg-gray-100"
      >
        Sign in with GitHub
      </button>
    </div>
  );
}
