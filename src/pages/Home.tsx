import React from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, Database, Code, Share2, Grid, AlertTriangle } from 'react-feather';

/**
 * Enhanced Home page with new content and naming
 */
const Home: React.FC = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Graph LM</h1>
          <p className="hero-description">
            Transform your JSON data into interactive graph visualizations. 
            Upload your data or use an example to get started.
          </p>
          <Link to="/json-data" className="cta-button">
            <UploadCloud size={18} />
            <span>Upload Data</span>
          </Link>
        </div>
      </div>

      {/* Process Flow */}
      <div className="section">
        <h2 className="section-title">Interactive Data Flow</h2>
        <div className="process-flow">
          <div className="process-node">
            <div className="process-icon">
              <UploadCloud size={24} />
            </div>
            <span className="process-label">Import</span>
          </div>
          <div className="process-arrow">→</div>
          <div className="process-node">
            <div className="process-icon">
              <Database size={24} />
            </div>
            <span className="process-label">Process</span>
          </div>
          <div className="process-arrow">→</div>
          <div className="process-node">
            <div className="process-icon">
              <Share2 size={24} />
            </div>
            <span className="process-label">Visualize</span>
          </div>
          <div className="process-arrow">→</div>
          <div className="process-node">
            <div className="process-icon">
              <Code size={24} />
            </div>
            <span className="process-label">Analyze</span>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="section">
        <h2 className="section-title">Visualization Applications</h2>
        <div className="feature-grid two-columns">
          <div className="feature-card">
            <div className="feature-icon">
              <Database size={24} />
            </div>
            <h3>Knowledge Graph Mapping</h3>
            <p>Map complex relationships between entities and understand connections in your data models.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <Code size={24} />
            </div>
            <h3>Network Analysis</h3>
            <p>Examine connections and patterns in complex networks with interactive visualization tools.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <Share2 size={24} />
            </div>
            <h3>Hierarchical Exploration</h3>
            <p>Navigate through nested structures and discover hidden patterns in your hierarchical data.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <Grid size={24} />
            </div>
            <h3>Research Visualization</h3>
            <p>Create visual representations of research data to communicate complex relationships clearly.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <h2>Start Exploring Your Data</h2>
        <p>Upload your JSON data and transform it into an interactive visualization Graph.</p>
        <Link to="/json-data" className="cta-button">
          <UploadCloud size={18} />
          <span>Begin Visualization</span>
        </Link>
      </div>

      {/* Info Section */}
      <div className="tip-container">
        <div className="tip">
          <AlertTriangle size={18} className="tip-icon" />
          <p>Graph LM works best with structured hierarchical data that includes relationship indicators.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;