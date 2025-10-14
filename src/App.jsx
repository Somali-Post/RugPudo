import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
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

function AppRoutes() {
  const navigate = useNavigate();
  const { pudo, selectPudo } = useAppContext();

  const handlePudoSelected = (selectedPudo) => {
    selectPudo(selectedPudo);
    navigate("/app/profile");
  };

  return (
    <Routes>
      {/* Public Onboarding Routes */}
      <Route path="/" element={<PhoneRegistrationScreen />} />
      <Route path="/verify" element={<VerifyPhoneNumberScreen />} />

      {/* Onboarding PUDO Selection (These screens have the bottom nav) */}
      <Route path="/select-pudo" element={<AppShell />}>
        <Route index element={<Navigate to="list" replace />} />
        <Route path="list" element={<PudoListScreen mode="onboarding" onSelect={handlePudoSelected} />} />
        <Route path="map" element={<MapScreen mode="onboarding" onSelect={handlePudoSelected} />} />
      </Route>

      {/* Protected Main App Routes */}
      {pudo ? (
        <>
          {/* Routes WITH Bottom Nav */}
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Navigate to="list" replace />} />
            <Route path="list" element={<PudoListScreen mode="browse" />} />
            <Route path="map" element={<MapScreen mode="browse" />} />
          </Route>
          
          {/* Routes WITHOUT Bottom Nav */}
          <Route path="/app/profile" element={<ProfileScreen />} />
          <Route path="/app/packages" element={<MyPackagesScreen />} />
          <Route path="/app/parcel/:id" element={<ParcelDetailsScreen />} />
          <Route path="/app/help" element={<HelpAndSupportScreen />} />
          <Route path="/app/privacy" element={<PrivacyAndSecurityScreen />} />
          <Route path="/app/about" element={<AboutSpsScreen />} />
        </>
      ) : (
        // If not logged in, redirect any deep links to the selection screen
        <Route path="/app/*" element={<Navigate to="/select-pudo/list" replace />} />
      )}
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
