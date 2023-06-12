import type { FC } from "react";
import { LogoutButton } from "src/component/Button";
import { useAuth } from "src/lib/user";

/** @package */
export const Header: FC = () => {
  const { session: isLogin } = useAuth();

  return (
    <div>
      <div className="flex justify-between p-4">
        <h1>ChatApp</h1>
        {isLogin && <LogoutButton />}
      </div>
    </div>
  );
};
