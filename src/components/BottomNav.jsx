import { NavLink } from "react-router-dom";
import { IconMap, IconList, IconUser } from "./icons";

export default function BottomNav() {
  const items = [
    { to: "/app/map", label: "Map", Icon: IconMap },
    { to: "/app", label: "List", Icon: IconList },
    { to: "/app/profile", label: "Profile", Icon: IconUser },
  ];
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Primary">
      {items.map(({ to, label, Icon }) => (
        <NavLink key={to} to={to} end className={({ isActive }) => "nav-item" + (isActive ? " is-active" : "")}>
          <Icon aria-hidden="true" />
          <span className="nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
