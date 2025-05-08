import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  UploadCloud, 
  FileText,
  ZoomIn,
  Code,
  Share2,
  AlertTriangle,
  RefreshCw
} from 'react-feather';
import D3Visualization from '../components/D3Visualization';

/**
 * Enhanced Graph Visualization page with updated terminology
 */
const TreeVisualizationPage: React.FC = () => {
  const [jsonData, setJsonData] = useState<Record<string, any> | null>(null);
  const [currentSource, setCurrentSource] = useState<string | null>(null);
  const location = useLocation();
  
  // Check for data passed through location state
  useEffect(() => {
    if (location.state && location.state.jsonData) {
      setJsonData(location.state.jsonData);
      if (location.state.fileName) {
        setCurrentSource(location.state.fileName);
      }
    }
  }, [location]);
  
  // Sample data for testing when no data is provided
  const loadSampleData = () => {
    const sampleData = {
      "api": {
        "text": "example",
        "identifier": "12345",
        "name": {
          "active": true,
          "id": 1
        },
        "telecom": [
          { "system": "email", "value": "test@example.com" },
          { "system": "phone", "value": "123-456-7890" }
        ],
        "attribute": {
          "extension": "something"
        },
        "address": {},
        "contact": {},
        "managingOrganization": {
          "reference": "Organization/1"
        }
      }
    };
    
    setJsonData(sampleData);
    setCurrentSource("sample_data.json");
  };
  
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const data = JSON.parse(result);
        setJsonData(data);
        setCurrentSource(file.name);
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        alert("Failed to parse JSON file. Please check the file format.");
      }
    };
    
    reader.readAsText(file);
  };
  
  return (
    <div className="tree-visualization-page">
      <h1 className="page-title">Graph Visualization</h1>
      
      {/* Visualization Mode Selector */}
      <div className="visualization-modes">
        <div className="mode-selector">
          <button className="mode-button">
            <Code size={16} />
            <span>Structure</span>
          </button>
          <button className="mode-button active">
            <Share2 size={16} />
            <span>Network</span>
          </button>
          <button className="mode-button">
            <ZoomIn size={16} />
            <span>Detail</span>
          </button>
        </div>
      </div>
      
      {/* Source Information */}
      {currentSource && (
        <div className="source-info-card">
          <div className="source-info-header">
            <h3>Visualization Source</h3>
          </div>
          <div className="source-details">
            <div className="source-item">
              <FileText size={14} />
              <span><strong>Source:</strong> {currentSource}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Controls Section */}
      <div className="content-card">
        <div className="card-header">
          <div className="card-header-left">
            <Link to="/json-data" className="btn-link">
              <ChevronLeft size={16} />
              <span>Back to Editor</span>
            </Link>
          </div>
          
          <div className="card-header-right">
            <input
              type="file"
              id="upload-json"
              accept=".json"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <label htmlFor="upload-json" className="btn-primary" style={{ margin: 0 }}>
              <UploadCloud size={16} />
              <span>Upload New Data</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Visualization Section */}
      {jsonData ? (
        <D3Visualization data={jsonData} />
      ) : (
        <div className="content-card">
          <div className="no-data-message">
            <p>No graph data available. Please upload structured data or use the sample data.</p>
            <button className="btn-primary" onClick={loadSampleData}>
              <span>Load Sample Data</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Tip Section */}
      <div className="tip-container">
        <div className="tip">
          <AlertTriangle size={18} className="tip-icon" />
          <p>Adjust the depth level to control how many layers of relationships are displayed in the graph.</p>
          <button className="btn-refresh">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
      
      <div className="footer">
        <p>Graph LM Visualization Tool</p>
      </div>
    </div>
  );
};

export default TreeVisualizationPage;