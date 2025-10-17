import { NavLink, useLocation } from "react-router-dom";
import { IconMap, IconList, IconUser } from "./icons";

export default function BottomNav() {
  const { pathname } = useLocation();
  const base = pathname.startsWith("/select-pudo") ? "/select-pudo" : "/app";
  const items = base === "/select-pudo"
    ? [
        { to: `${base}/list`, label: "List", Icon: IconList },
        { to: `${base}/map`, label: "Map", Icon: IconMap },
      ]
    : [
        { to: `${base}/list`, label: "List", Icon: IconList },
        { to: `${base}/map`, label: "Map", Icon: IconMap },
        { to: `${base}/profile`, label: "Profile", Icon: IconUser },
      ];

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Primary">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          className={({ isActive }) => "nav-item" + (isActive ? " is-active" : "")}
        >
          <item.Icon aria-hidden="true" />
          <span className="nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}