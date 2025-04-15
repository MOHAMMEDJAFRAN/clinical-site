'use client';

import React, { useState } from 'react';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div style={styles.header}>
      <div style={styles.leftSection}>
        <button style={styles.menuButton}>☰</button> {/* Hamburger Menu */}
        <h1 style={styles.title}>MYO CLINIC</h1> {/* Logo or Title */}
      </div>
      <div style={styles.rightSection}>
        <h2 style={styles.headerTitle}>MYO CLINIC CENDER</h2> {/* Header Subtitle */}
        <div style={styles.profile} onClick={toggleDropdown}>
          <span style={styles.profileName}>Admin</span> {/* Profile Name */}
          <div style={styles.profileIcon}>👤</div> {/* Profile Icon */}
        </div>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div style={styles.dropdownMenu}>
            <a href="/change-password" style={styles.dropdownItem}>Change Password</a>
            <a href="/logout" style={styles.dropdownItem}>Log Out</a>
          </div>
        )}
      </div>
    </div>
  );
};

// Styles for Header and Dropdown
const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    width: '100%', // Full width of the screen
    height: '70px', // Fixed header height
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
  },
  menuButton: {
    fontSize: '30px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#333',
    marginRight: '20px',
  },
  title: {
    fontSize: '30px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 'auto',
    position: 'relative', // To position dropdown correctly
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: 'lighter',
    color: '#666',
    marginRight: '30px',
  },
  profile: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'relative', // To position the dropdown under the profile
  },
  profileName: {
    fontSize: '16px',
    color: '#333',
    marginRight: '10px',
  },
  profileIcon: {
    fontSize: '25px',
    backgroundColor: '#f1f1f1',
    borderRadius: '50%',
    padding: '10px',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%', // Position the dropdown below the profile icon
    right: 0,
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '160px',
    zIndex: 1000,
  },
  dropdownItem: {
    padding: '10px 15px',
    textDecoration: 'none',
    color: '#333',
    display: 'block',
    fontSize: '14px',
    borderBottom: '1px solid #ddd',
    transition: 'background-color 0.2s',
  },
  dropdownItemLast: {
    borderBottom: 'none',
  },
  dropdownItemHover: {
    backgroundColor: '#f4f4f4',
  },
};

export default Header;
