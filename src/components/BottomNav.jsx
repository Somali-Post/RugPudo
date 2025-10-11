import { NavLink } from "react-router-dom";
import { IconMap, IconList, IconUser } from "./icons";

export default function BottomNav({ mode = "browse", onProfileClick }) {
  const items = [
    { to: "/select-pudo/list", label: "List", Icon: IconList },
    { to: "/select-pudo/map", label: "Map", Icon: IconMap },
    { to: "/app/profile", label: "Profile", Icon: IconUser },
  ];

  const handleProfileClick = (e) => {
    if (mode === "onboarding") {
      e.preventDefault(); // Stop the NavLink from navigating
      onProfileClick();   // Trigger the toast from the AppShell
    }
  };

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Primary">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          onClick={item.label === "Profile" ? handleProfileClick : undefined}
          className={({ isActive }) => "nav-item" + (isActive ? " is-active" : "")}
        >
          <item.Icon aria-hidden="true" />
          <span className="nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
