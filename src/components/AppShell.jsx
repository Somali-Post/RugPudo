import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      {children ? children : <Outlet />}
      <BottomNav />
    </div>
  );
}
