import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

// This shell's only job is to provide the BottomNav
export default function AppShell() {
  return (
    <div className="app-shell">
      <Outlet />
      <BottomNav />
    </div>
  );
}