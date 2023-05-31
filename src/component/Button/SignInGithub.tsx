import { useAuth } from "src/lib/hooks";

/** @package */
export const SignInGithub = () => {
  const { error, signInWithGithub } = useAuth();

  return (
    <div>
      <button onClick={signInWithGithub}>Githubでサインインする</button>
      {error && <p>{error}</p>}
    </div>
  );
};
