import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigationBar from './BottomNavigationBar';

const MainLayout = () => {
  return (
    <div>
      <Outlet /> {/* Renders the active screen (Dashboard, Parcels, etc.) */}
      <BottomNavigationBar />
    </div>
  );
};

export default MainLayout;