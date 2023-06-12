import type { FC } from "react";
import { Chat } from "src/component/Chat";
import { useAuth } from "src/lib/user";
import { SignInGithub } from "src/pages-component/index/SignInGithub";

export const Index: FC = () => {
  const { session: isLogin } = useAuth();

  // ログインしている場合のみチャットページを表示
  return isLogin ? <Chat /> : <SignInGithub />;
};
