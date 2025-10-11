import { NavLink } from "react-router-dom";
import { IconMap, IconList, IconUser } from "./icons";

export default function BottomNav({ mode = "browse", onProfileClick }) {
  const items = [
    { to: "/list", label: "List", Icon: IconList },
    { to: "/map", label: "Map", Icon: IconMap },
    { to: "/profile", label: "Profile", Icon: IconUser },
  ];

  const handleNavClick = (e, item) => {
    if (mode === "onboarding" && item.label === "Profile") {
      e.preventDefault(); // Stop navigation
      onProfileClick(); // Trigger the toast
    }
  };

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Primary">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          onClick={(e) => handleNavClick(e, item)}
          className={({ isActive }) => "nav-item" + (isActive ? " is-active" : "")}
        >
          <item.Icon aria-hidden="true" />
          <span className="nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}