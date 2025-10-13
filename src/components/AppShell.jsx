import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import { useAppContext } from "../context/AppContext";

export default function AppShell({ showBottomNav = true }) {
  const { showToast } = useAppContext();

  const handleProfileClick = () => {
    showToast("Please select a PUDO point first.");
  };

  return (
    <div className="app-shell">
      <Outlet />
      {showBottomNav && <BottomNav onProfileClick={handleProfileClick} />}
    </div>
  );
}