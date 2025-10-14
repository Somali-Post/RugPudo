import { NavLink } from "react-router-dom";
import { IconMap, IconList, IconUser } from "./icons";

export default function BottomNav() {
  const items = [
    { to: "/app/list", label: "List", Icon: IconList },
    { to: "/app/map", label: "Map", Icon: IconMap },
    { to: "/app/profile", label: "Profile", Icon: IconUser },
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
