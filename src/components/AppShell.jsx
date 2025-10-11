import { Outlet } from "react-router-dom";
import { useState } from "react";
import BottomNav from "./BottomNav";
import Toast from "./Toast";

export default function AppShell({ mode = "browse" }) {
  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = (message) => {
    setToast({ show: true, message });
  };

  return (
    <div className="app-shell">
      <Outlet />
      <BottomNav mode={mode} onProfileClick={() => showToast("Please select a PUDO point.")} />
      <Toast
        show={toast.show}
        message={toast.message}
        onDismiss={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
}