import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import schemesConfig from './schemesConfig';
import { ic_done } from 'react-icons-kit/md/ic_done';
import Icon from 'react-icons-kit';

const AppNavbar = ({ onSchemeChange, onIntensityChange, scheme, intensity, days }) => {
  const [schemeDropdownOpen, setSchemeDropdownOpen] = useState(false);
  const [intensityDropdownOpen, setIntensityDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Verifica si la clase 'EditRoutinePage_dark' está presente en el cuerpo o en un contenedor padre
    const isDark = document.querySelector('.EditRoutinePage_dark') !== null;
    setIsDarkMode(isDark);
  }, []);

  const schemes = Object.keys(schemesConfig).map((key) => ({
    name: key,
    ...schemesConfig[key]
  }));

  const intensities = [
    { level: '1/5', icon: require('./1.png') },
    { level: '2/5', icon: require('./2.png') },
    { level: '3/5', icon: require('./3.png') },
    { level: '4/5', icon: require('./4.png') },
    { level: '5/5', icon: require('./5.png') }
  ];

  const currentScheme = schemes.find(s => s.name === scheme) || { color: '#ffffff' };
  const currentIntensity = intensities.find(i => i.level === intensity) || intensities[0];

  const handleSchemeToggle = () => {
    setSchemeDropdownOpen(!schemeDropdownOpen);
    setIntensityDropdownOpen(false);
  };

  const handleIntensityToggle = () => {
    setIntensityDropdownOpen(!intensityDropdownOpen);
    setSchemeDropdownOpen(false);
  };

  const handleSchemeChange = (schemeName) => {
    onSchemeChange(schemeName);
    setSchemeDropdownOpen(false);
  };

  const handleIntensityChange = (intensityLevel) => {
    onIntensityChange(intensityLevel);
    setIntensityDropdownOpen(false);
  };

  return (
    <nav className={`${styles.navbar} ${isDarkMode ? styles.dark : ''}`}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <div
            className={`${styles.dropdownToggle} ${styles.schemeToggle} ${schemeDropdownOpen ? styles.open : ''}`}
            onClick={handleSchemeToggle}
          >
            <span className={`${styles.label} ${isDarkMode ? styles.dark : ''}`}>Esquema</span>
            <div className={styles.colorBox} style={{ backgroundColor: currentScheme.color }}></div>
          </div>
          {schemeDropdownOpen && (
            <ul className={`${styles.dropdownMenu} ${styles.schemeDropdownMenu} ${isDarkMode ? styles.dark : ''}`}>
              <li className={styles.dropdownHeader}>
                <span className={styles.schemeHeader}>SCHEME</span>
                <span className={styles.loadingHeader}>LOADING</span>
                <span className={styles.repsHeader}>REPS</span>
              </li>
              {schemes.map((schemeItem, index) => (
                <li key={index} className={styles.dropdownItem} onClick={() => handleSchemeChange(schemeItem.name)}>
                  <div className={`${styles.schemeItem} ${scheme === schemeItem.name ? styles.schemeItemSelected : ''}`}>
                    {scheme === schemeItem.name && <Icon icon={ic_done} size={20} />}
                    <span className={styles.schemeName}>{schemeItem.name}</span>
                    <div className={styles.colorBars}>
                      <div className={styles.loadingBar}>
                        <div className={styles.loadingFill} style={{ backgroundColor: schemeItem.loading, width: `${schemeItem.loadingPercent}%` }}></div>
                      </div>
                      <div className={styles.repsBar}>
                        <div className={styles.repsFill} style={{ backgroundColor: schemeItem.reps, width: `${schemeItem.repsPercent}%` }}></div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </li>
        <li className={styles.navItem}>
          <div
            className={`${styles.dropdownToggle} ${styles.intensityToggle} ${intensityDropdownOpen ? styles.open : ''}`}
            onClick={handleIntensityToggle}
          >
            <span className={`${styles.label} ${isDarkMode ? styles.dark : ''}`}>Intensidad</span>
            <img src={currentIntensity.icon} alt={intensity} className={styles.intensityIcon} />
          </div>
          {intensityDropdownOpen && (
            <ul className={`${styles.dropdownMenu} ${styles.intensityDropdownMenu} ${isDarkMode ? styles.dark : ''}`}>
              {intensities.map((intensityItem, index) => (
                <li key={index} className={styles.dropdownItem} onClick={() => handleIntensityChange(intensityItem.level)}>
                  <div className={`${styles.intensityItem} ${intensity === intensityItem.level ? styles.intensityItemSelected : ''}`}>
                    <img src={intensityItem.icon} alt={intensityItem.level} className={styles.intensityIcon} />
                    {intensity === intensityItem.level && <Icon icon={ic_done} size={20} />}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default AppNavbar;
