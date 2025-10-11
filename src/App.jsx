import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Keep all imports...
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
  // For now, we render ParcelsScreen directly to see our work.
  // We will restore the router later.
  return <ParcelsScreen />;
}

export default App;