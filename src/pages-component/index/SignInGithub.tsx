import Image from "next/image";
import { useAuth } from "src/lib/user";

/** @package */
export const SignInGithub = () => {
  const { error, signInWithGithub } = useAuth();

  return (
    <div className="mt-20 space-y-5">
      <div className="grid place-items-center">
        <button
          onClick={signInWithGithub}
          className="flex w-72 justify-center gap-4 rounded-full bg-gray-9 py-4 font-bold text-gray-1 transition duration-200 ease-in-out hover:bg-gray-10 focus:outline-none focus-visible:ring-2"
        >
          <Image src="/github.svg" alt="Github" width={20} height={20} />
          Githubでサインインする
        </button>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};
