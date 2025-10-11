import React from 'react';
import styles from './BottomNavigationBar.module.css';

const BottomNavigationBar = ({ activeScreen }) => {
  const navItems = [
    { name: 'Home', icon: '🏠', screen: 'Dashboard' },
    { name: 'Parcels', icon: '📦', screen: 'Parcels' },
    { name: 'Map', icon: '🗺️', screen: 'Map' },
    { name: 'Profile', icon: '👤', screen: 'Profile' },
  ];

  return (
    <nav className={styles.container}>
      {navItems.map((item) => {
        const isActive = activeScreen === item.name;
        return (
          <button key={item.name} className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.name}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavigationBar;