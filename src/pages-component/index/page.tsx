import type { FC } from "react";
import { SignInGithub } from "src/component/Button";
import { Chat } from "src/component/Chat";
import { useAuth } from "src/lib/user";

export const Index: FC = () => {
  const { session: isLogin } = useAuth();

  return isLogin ? <Chat /> : <SignInGithub />;
};
