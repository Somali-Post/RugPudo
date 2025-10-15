import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppContext } from './context/shared';
import AppShell from './components/AppShell';
import PudoListScreen from './screens/PudoListScreen';
import MapScreen from './screens/MapScreen';
import ProfileScreen from './screens/ProfileScreen';
import PhoneRegistrationScreen from './screens/PhoneRegistrationScreen';
import VerifyPhoneNumberScreen from './screens/VerifyPhoneNumberScreen';
import ParcelDetailsScreen from './screens/ParcelDetailsScreen';
import MyPackagesScreen from './screens/MyPackagesScreen';
import HelpAndSupportScreen from './screens/HelpAndSupportScreen';
import PrivacyAndSecurityScreen from './screens/PrivacyAndSecurityScreen';
import AboutSpsScreen from './screens/AboutSpsScreen';

// A layout for authenticated routes
function ProtectedLayout() {
  return (
    <Routes>
      {/* Routes WITH Bottom Nav */}
      <Route path="/" element={<AppShell />} >
        <Route index element={<Navigate to="list" replace />} />
        <Route path="list" element={<PudoListScreen mode="browse" />} />
        <Route path="map" element={<MapScreen mode="browse" />} />
      </Route>
      {/* Routes WITHOUT Bottom Nav */}
      <Route path="profile" element={<ProfileScreen />} />
      <Route path="packages" element={<MyPackagesScreen />} />
      <Route path="parcel/:id" element={<ParcelDetailsScreen />} />
      <Route path="help" element={<HelpAndSupportScreen />} />
      <Route path="privacy" element={<PrivacyAndSecurityScreen />} />
      <Route path="about" element={<AboutSpsScreen />} />
    </Routes>
  );
}

function SelectPudoGuard({ children }) {
  const { pudo, canChangePudo, showToast } = useAppContext();
  const blocked = pudo && !canChangePudo();
  useEffect(() => {
    if (blocked) {
      showToast('Limit Reached', 'You can only change your PUDO point once every 24 hours.');
    }
  }, [blocked]);
  if (blocked) {
    return <Navigate to="/app/profile" replace />;
  }
  return children;
}

function AppRoutes() {
  const navigate = useNavigate();
  const { pudo, user, selectPudo } = useAppContext();

  const handlePudoSelected = (selectedPudo) => {
    selectPudo(selectedPudo);
    navigate("/app/profile", { replace: true });
  };

  // To test the protected routes, change this to: true
  // To test the onboarding flow, change this to: false
  const hasPudo = pudo ? true : false; 

  return (
    <Routes>
      {/* Public Onboarding Routes */}
      <Route path="/" element={hasPudo ? <Navigate to="/app/profile" replace /> : <PhoneRegistrationScreen />} />
      <Route path="/verify" element={hasPudo ? <Navigate to="/app/profile" replace /> : <VerifyPhoneNumberScreen />} />

      {/* Onboarding PUDO Selection (These screens have the bottom nav) */}
      <Route path="/select-pudo" element={<SelectPudoGuard><AppShell /></SelectPudoGuard>}>
        <Route index element={<Navigate to="list" replace />} />
        <Route path="list" element={<PudoListScreen mode="onboarding" onSelect={handlePudoSelected} />} />
        <Route path="map" element={<MapScreen mode="onboarding" onSelect={handlePudoSelected} />} />
      </Route>

      {/* All /app/* routes are protected */}
      <Route
        path="/app/*"
        element={
          hasPudo
            ? <ProtectedLayout />
            : (user ? <Navigate to="/select-pudo/list" replace /> : <Navigate to="/" replace />)
        }
      />
    </Routes>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
