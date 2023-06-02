import type { FC } from "react";
import { LogoutButton } from "src/component/Button";
import { pagesPath } from "src/lib/const";
import { NavLink } from "src/lib/next";
import { useAuth } from "src/lib/user";

const items = [
  { href: pagesPath.$url().pathname, label: "Root" },
  { href: pagesPath.about.$url().pathname, label: "About" },
];

/** @package */
export const Header: FC = () => {
  const { session: isLogin } = useAuth();

  return (
    <div>
      <div className="flex justify-between">
        <h1>Title</h1>
        {isLogin && <LogoutButton />}
      </div>
      <nav>
        {items.map(({ href, label }) => {
          return (
            <NavLink key={href} href={href} activeClassName="text-red-500">
              <a className="inline-block p-4">{label}</a>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
