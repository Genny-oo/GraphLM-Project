import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import Home from './pages/Home';
import JsonDataPage from './pages/JsonDataPage';
import TreeVisualizationPage from './pages/TreeVisualizationPage';

// Import components
import Navbar from './components/Navbar';

/**
 * Main App component with enhanced routing
 */
const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/json-data" element={<JsonDataPage />} />
            <Route path="/tree-visualization" element={<TreeVisualizationPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;