import { useAuth } from "src/lib/hooks";

/** @package */
export const LogoutButton = () => {
  const { signOut } = useAuth();
  return <button onClick={signOut}>ログアウト</button>;
};
