import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Database, Home, GitBranch, Settings, RotateCcw, Moon, Sun, Eye, EyeOff, Layers } from 'react-feather';

/**
 * Enhanced navigation bar with functional settings dropdown
 */
const Navbar: React.FC = () => {
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showNodeValues, setShowNodeValues] = useState(true);
  const [autoCollapse, setAutoCollapse] = useState(true);
  const settingsRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close settings
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    applyTheme(!isDarkMode);
  };
  
  // Apply theme changes
  const applyTheme = (dark: boolean) => {
    const root = document.documentElement;
    
    if (dark) {
      // Dark theme colors
      root.style.setProperty('--dark-bg', '#0a0a0a');
      root.style.setProperty('--darker-bg', '#000000');
      root.style.setProperty('--card-bg', '#121212');
      root.style.setProperty('--card-bg-hover', '#1a1a1a');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#cccccc');
      root.style.setProperty('--text-muted', '#888888');
      root.style.setProperty('--border-color', '#333333');
    } else {
      // Light theme colors
      root.style.setProperty('--dark-bg', '#f5f5f5');
      root.style.setProperty('--darker-bg', '#ffffff');
      root.style.setProperty('--card-bg', '#ffffff');
      root.style.setProperty('--card-bg-hover', '#f0f0f0');
      root.style.setProperty('--text-primary', '#121212');
      root.style.setProperty('--text-secondary', '#444444');
      root.style.setProperty('--text-muted', '#666666');
      root.style.setProperty('--border-color', '#dddddd');
    }
  };
  
  // Apply settings
  const applySettings = () => {
    // Here you would integrate with your visualization settings
    // For now, we'll just update the theme
    
    // Send settings to local storage
    localStorage.setItem('graphLmSettings', JSON.stringify({
      darkMode: isDarkMode,
      showNodeValues,
      autoCollapse
    }));
    
    // Close settings dropdown
    setShowSettings(false);
  };
  
  // Restore settings from local storage
  useEffect(() => {
    const savedSettings = localStorage.getItem('graphLmSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setIsDarkMode(settings.darkMode);
      setShowNodeValues(settings.showNodeValues);
      setAutoCollapse(settings.autoCollapse);
      applyTheme(settings.darkMode);
    }
  }, []);
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };
  
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <Database className="navbar-icon" size={20} />
          <span>Graph LM</span>
        </Link>
      </div>
      
      <div className="navbar-center">
        <Link to="/" className={isActive('/')}>
          <Home size={16} />
          <span>Dashboard</span>
        </Link>
        <Link to="/json-data" className={isActive('/json-data')}>
          <Database size={16} />
          <span>Data Editor</span>
        </Link>
        <Link to="/tree-visualization" className={isActive('/tree-visualization')}>
          <GitBranch size={16} />
          <span>Graph View</span>
        </Link>
      </div>
      
      <div className="navbar-right">
        <div className="settings-container" ref={settingsRef}>
          <button className="icon-button" onClick={toggleSettings}>
            <Settings size={18} />
          </button>
          
          {showSettings && (
            <div className="settings-dropdown">
              <div className="settings-header">
                <h3>Display Settings</h3>
              </div>
              
              <div className="settings-option">
                <label>
                  <input 
                    type="checkbox" 
                    checked={isDarkMode}
                    onChange={toggleTheme}
                  />
                  <span>Dark Mode</span>
                  {isDarkMode ? <Moon size={14} /> : <Sun size={14} />}
                </label>
              </div>
              
              <div className="settings-option">
                <label>
                  <input 
                    type="checkbox" 
                    checked={showNodeValues}
                    onChange={() => setShowNodeValues(!showNodeValues)}
                  />
                  <span>Show Node Values</span>
                  {showNodeValues ? <Eye size={14} /> : <EyeOff size={14} />}
                </label>
              </div>
              
              <div className="settings-option">
                <label>
                  <input 
                    type="checkbox" 
                    checked={autoCollapse}
                    onChange={() => setAutoCollapse(!autoCollapse)}
                  />
                  <span>Auto-collapse Large Nodes</span>
                  <Layers size={14} />
                </label>
              </div>
              
              <div className="settings-footer">
                <button className="btn-settings-apply" onClick={applySettings}>
                  Apply Changes
                </button>
              </div>
            </div>
          )}
        </div>
        
        <button className="icon-button">
          <RotateCcw size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;