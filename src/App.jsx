import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext'; // Import the real context hook
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
import ParcelsScreen from './screens/ParcelsScreen';

function App() {
  // Temporarily render ParcelsScreen to see our work
  return <ParcelsScreen />;
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}