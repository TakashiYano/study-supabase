import { useAuth } from "src/lib/user";

/** @package */
export const LogoutButton = () => {
  const { signOut } = useAuth();
  return <button onClick={signOut}>ログアウト</button>;
};
