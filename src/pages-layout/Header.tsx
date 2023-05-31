import type { FC } from "react";
import { pagesPath } from "src/lib/const";
import { NavLink } from "src/lib/next";

const items = [
  { href: pagesPath.$url().pathname, label: "Root" },
  { href: pagesPath.about.$url().pathname, label: "About" },
];

/**
 * @package
 */
export const Header: FC = () => {
  return (
    <div>
      <h1>Title</h1>
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
