import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './BottomNavigationBar.module.css';

const BottomNavigationBar = () => {
  const navItems = [
    { name: 'Home', icon: '🏠', path: '/app' },
    { name: 'Parcels', icon: '📦', path: '/app/parcels' },
    { name: 'Map', icon: '🗺️', path: '/app/map' },
    { name: 'Profile', icon: '👤', path: '/app/profile' },
  ];

  return (
    <nav className={styles.container}>
      {navItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          end // 'end' prop ensures 'Home' is only active on the exact path
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNavigationBar;