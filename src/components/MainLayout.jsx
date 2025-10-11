import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigationBar from './BottomNavigationBar';

const MainLayout = () => {
  // In a real app, we'd determine the active screen from the route
  // For now, we'll default to 'Home' for the dashboard view
  return (
    <div>
      <Outlet /> {/* This will render the active screen (e.g., Dashboard) */}
      <BottomNavigationBar activeScreen={'Home'} />
    </div>
  );
};

export default MainLayout;