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

// This component contains the logic and can use router hooks
function AppRoutes() {
  const navigate = useNavigate();
  const { pudo, selectPudo } = useAppContext();

  const handlePudoSelected = (selectedPudo) => {
    selectPudo(selectedPudo);
    navigate("/app/profile");
  };

  // For development, we can temporarily override the PUDO status
  const hasPudo = true; // CHANGE THIS to false to test the onboarding flow

  return (
    <Routes>
      <Route path="/" element={<PhoneRegistrationScreen />} />
      <Route path="/verify" element={<VerifyPhoneNumberScreen />} />
      
      <Route path="/select-pudo" element={<AppShell showBottomNav={true} />}>
        <Route index element={<Navigate to="list" replace />} />
        <Route path="list" element={<PudoListScreen mode="onboarding" onSelect={handlePudoSelected} />} />
        <Route path="map" element={<MapScreen mode="onboarding" onSelect={handlePudoSelected} />} />
      </Route>

      <Route path="/app" element={hasPudo ? <AppShell showBottomNav={true} /> : <Navigate to="/select-pudo/list" replace />}>
        <Route index element={<Navigate to="list" replace />} />
        <Route path="list" element={<PudoListScreen mode="browse" />} />
        <Route path="map" element={<MapScreen mode="browse" />} />
        <Route path="profile" element={<ProfileScreen />} />
        <Route path="packages" element={<MyPackagesScreen />} />
        <Route path="parcel/:id" element={<ParcelDetailsScreen />} />
        <Route path="help" element={<HelpAndSupportScreen />} />
        <Route path="privacy" element={<PrivacyAndSecurityScreen />} />
        <Route path="about" element={<AboutSpsScreen />} />
      </Route>
    </Routes>
  );
}

// This component sets up the Router
export default function AppWrapper() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
