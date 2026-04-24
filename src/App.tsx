import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import Home from './pages/Home';
import JsonDataPage from './pages/JsonDataPage';
import TreeVisualizationPage from './pages/TreeVisualizationPage';
import ComparePage from './pages/ComparePage';

// Import components
import Navbar from './components/Navbar';

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
            <Route path="/compare" element={<ComparePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
