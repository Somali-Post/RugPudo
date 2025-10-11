import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import PudoListScreen from './screens/PudoListScreen';
import MapScreen from './screens/MapScreen';
import ProfileScreen from './screens/ProfileScreen';
import PhoneRegistrationScreen from './screens/PhoneRegistrationScreen';
import VerifyPhoneNumberScreen from './screens/VerifyPhoneNumberScreen';
import ParcelDetailsScreen from './screens/ParcelDetailsScreen';
import ParcelsScreen from './screens/ParcelsScreen';

// Mock hook for checking if user has a PUDO
const useUserPudo = () => {
  // To test the protected routes, change this to: return { pudo: { name: 'Juba Hypermarket' } };
  return { pudo: null }; 
};

function OnboardingRoutes() {
  const navigate = useNavigate();
  return (
    <AppShell mode="onboarding">
      <Routes>
        <Route path="/list" element={<PudoListScreen onSelect={() => navigate("/app")} />} />
        <Route path="/map" element={<MapScreen onSelect={() => navigate("/app")} />} />
        {/* Redirect root of onboarding to the list view */}
        <Route index element={<Navigate to="/list" replace />} />
      </Routes>
    </AppShell>
  );
}

function ProtectedRoutes() {
  return (
    <AppShell mode="browse">
      <Routes>
        <Route path="/list" element={<PudoListScreen />} />
        <Route path="/map" element={<MapScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/parcels" element={<ParcelsScreen />} />
        <Route path="/parcel/:id" element={<ParcelDetailsScreen />} />
        {/* Redirect root of main app to the list view */}
        <Route index element={<Navigate to="/list" replace />} />
      </Routes>
    </AppShell>
  );
}

function App() {
  const { pudo } = useUserPudo();

  return (
    <Routes>
      <Route path="/" element={<PhoneRegistrationScreen />} />
      <Route path="/verify" element={<VerifyPhoneNumberScreen />} />
      
      {/* If user has a PUDO, all /app/* routes go to ProtectedRoutes. Otherwise, to OnboardingRoutes. */}
      <Route path="/*" element={pudo ? <ProtectedRoutes /> : <OnboardingRoutes />} />
    </Routes>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}