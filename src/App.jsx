import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AppShell from './components/AppShell';
import PudoListScreen from './screens/PudoListScreen';
import MapScreen from './screens/MapScreen';
import ProfileScreen from './screens/ProfileScreen';
import PhoneRegistrationScreen from './screens/PhoneRegistrationScreen';
import VerifyPhoneNumberScreen from './screens/VerifyPhoneNumberScreen'; // RESTORED
import ParcelDetailsScreen from './screens/ParcelDetailsScreen'; // RESTORED
import ParcelsScreen from './screens/ParcelsScreen'; // RESTORED

// Mock hook for checking if user has a PUDO
const useUserPudo = () => {
  // For now, we simulate a user who has NOT selected a PUDO
  return { pudo: null }; 
};

function RequirePudo({ children }) {
  const { pudo } = useUserPudo();
  if (!pudo) {
    return <Navigate to="/select-pudo" replace />;
  }
  return children;
}

function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Public Onboarding Routes */}
      <Route path="/" element={<PhoneRegistrationScreen />} />
      <Route path="/verify" element={<VerifyPhoneNumberScreen />} />
      <Route path="/select-pudo" element={
        <div className="app-shell">
          <PudoListScreen mode="onboarding" onSelect={() => navigate("/app")} />
        </div>
      } />

      {/* Protected Main App Routes */}
      <Route path="/app" element={<RequirePudo><AppShell /></RequirePudo>}>
        <Route index element={<PudoListScreen mode="browse" />} />
        <Route path="map" element={<MapScreen />} />
        <Route path="parcels" element={<ParcelsScreen />} />
        <Route path="parcel/:parcelId" element={<ParcelDetailsScreen />} />
        <Route path="profile" element={<ProfileScreen />} />
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