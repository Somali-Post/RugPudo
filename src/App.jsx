import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import PudoListScreen from './screens/PudoListScreen';
import MapScreen from './screens/MapScreen';
import ProfileScreen from './screens/ProfileScreen';
import PhoneRegistrationScreen from './screens/PhoneRegistrationScreen';
import VerifyPhoneNumberScreen from './screens/VerifyPhoneNumberScreen';
import ParcelDetailsScreen from './screens/ParcelDetailsScreen';
import MyPackagesScreen from './screens/MyPackagesScreen'; // <-- NEW IMPORT
import HelpAndSupportScreen from './screens/HelpAndSupportScreen'; // <-- NEW IMPORT
import PrivacyAndSecurityScreen from './screens/PrivacyAndSecurityScreen'; // <-- NEW IMPORT
import AboutSpsScreen from './screens/AboutSpsScreen'; // <-- NEW IMPORT

// Mock hook for checking if user has a PUDO
const useUserPudo = () => {
  // To test the protected routes, change this to: return { pudo: { name: 'Juba Hypermarket' } };
  // To test the onboarding flow, keep this as: return { pudo: null };
  return { pudo: null }; 
};

function App() {
  const navigate = useNavigate();
  const { pudo } = useUserPudo();

  return (
    <Routes>
      {/* Public Onboarding Routes */}
      <Route path="/" element={<PhoneRegistrationScreen />} />
      <Route path="/verify" element={<VerifyPhoneNumberScreen />} />
      <Route path="/select-pudo" element={<AppShell showBottomNav={true} />}>
        <Route index element={<Navigate to="list" replace />} />
        <Route path="list" element={<PudoListScreen mode="onboarding" onSelect={() => navigate("/app/list")} />} />
        <Route path="map" element={<MapScreen mode="onboarding" onSelect={() => navigate("/app/list")} />} />
      </Route>

      {/* Protected Main App Routes */}
      <Route path="/app" element={pudo ? <AppShell showBottomNav={true} /> : <Navigate to="/select-pudo/list" replace />}>
        <Route index element={<Navigate to="list" replace />} />
        <Route path="list" element={<PudoListScreen mode="browse" />} />
        <Route path="map" element={<MapScreen mode="browse" />} />
        <Route path="profile" element={<ProfileScreen />} />
        <Route path="packages" element={<MyPackagesScreen />} /> {/* <-- NEW ROUTE */}
        <Route path="parcel/:id" element={<ParcelDetailsScreen />} />
        <Route path="help" element={<HelpAndSupportScreen />} /> {/* <-- NEW ROUTE */}
        <Route path="privacy" element={<PrivacyAndSecurityScreen />} /> {/* <-- NEW ROUTE */}
        <Route path="about" element={<AboutSpsScreen />} /> {/* <-- NEW ROUTE */}
      </Route>
    </Routes>
  );
}

// Wrap App in Router
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
