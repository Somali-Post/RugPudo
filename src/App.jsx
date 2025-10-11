import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PhoneRegistrationScreen from './screens/PhoneRegistrationScreen';
import VerifyPhoneNumberScreen from './screens/VerifyPhoneNumberScreen';
import PudoSelectionScreen from './screens/PudoSelectionScreen';
import DashboardScreen from './screens/DashboardScreen';
import ParcelsScreen from './screens/ParcelsScreen';
import MapScreen from './screens/MapScreen';
import ProfileScreen from './screens/ProfileScreen';
import MainLayout from './components/MainLayout';
import ParcelDetailsScreen from './screens/ParcelDetailsScreen';

function App() {
  return (
    <Router>
      <Routes>
        {/* Onboarding Flow */}
        <Route path="/" element={<PhoneRegistrationScreen />} />
        <Route path="/verify" element={<VerifyPhoneNumberScreen />} />
        <Route path="/select-pudo" element={<PudoSelectionScreen />} />

        {/* Main App Flow with Bottom Navigation */}
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<DashboardScreen />} />
          <Route path="parcels" element={<ParcelsScreen />} />
          <Route path="map" element={<MapScreen />} />
          <Route path="profile" element={<ProfileScreen />} />
          <Route path="parcel/:parcelId" element={<ParcelDetailsScreen />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;