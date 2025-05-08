import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  Code, 
  AlertTriangle, 
  RefreshCw,
  FileText,
  Clock,
  Share2
} from 'react-feather';

/**
 * Enhanced Data Editor page that passes data to visualization
 */
const JsonDataPage: React.FC = () => {
  const [jsonData, setJsonData] = useState<Record<string, any> | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [lastModified, setLastModified] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const handleJsonParsed = (data: Record<string, any>, fileName?: string) => {
    setJsonData(data);
    if (fileName) {
      setCurrentFile(fileName);
      setLastModified(new Date().toLocaleString());
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const jsonData = JSON.parse(event.target?.result as string);
            handleJsonParsed(jsonData, file.name);
          } catch (err) {
            console.error('Error parsing JSON file', err);
            alert('Failed to parse JSON file. Please check the format.');
          }
        };
        reader.readAsText(file);
      } else {
        alert('Please upload a JSON file');
      }
    }
  };
  
  const handleFileClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target?.result as string);
          handleJsonParsed(jsonData, file.name);
        } catch (err) {
          console.error('Error parsing JSON file', err);
          alert('Failed to parse JSON file. Please check the format.');
        }
      };
      reader.readAsText(file);
    }
  };
  
  // Navigate to the tree visualization with the current data
  const navigateToVisualization = () => {
    if (!jsonData) {
      alert('Please upload or paste JSON data first');
      return;
    }
    
    navigate('/tree-visualization', { 
      state: { 
        jsonData,
        fileName: currentFile
      } 
    });
  };
  
  return (
    <div className="json-data-page">
      <h1 className="page-title">Data Editor</h1>
      
      {/* Progress Indicators */}
      <div className="progress-tracker">
        <div className="progress-step active">
          <div className="progress-icon">
            <FileText size={16} />
          </div>
          <span>Import</span>
        </div>
        <div className="progress-connector"></div>
        <div className="progress-step">
          <div className="progress-icon">
            <Code size={16} />
          </div>
          <span>Edit</span>
        </div>
        <div className="progress-connector"></div>
        <div className="progress-step">
          <div className="progress-icon">
            <Share2 size={16} />
          </div>
          <span>Visualize</span>
        </div>
      </div>
      
      {/* Source Information */}
      {currentFile && (
        <div className="source-info-card">
          <div className="source-info-header">
            <h3>Current Source</h3>
          </div>
          <div className="source-details">
            <div className="source-item">
              <FileText size={14} />
              <span><strong>File:</strong> {currentFile}</span>
            </div>
            <div className="source-item">
              <Clock size={14} />
              <span><strong>Last Modified:</strong> {lastModified}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Upload Section */}
      <div className="content-card">
        <div className="card-header">
          <h2>Upload or Enter Data</h2>
          <button className="btn-secondary">
            <Code size={16} />
            <span>Paste Data</span>
          </button>
        </div>
        
        <div 
          className={`upload-area ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleFileClick}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden-input"
            accept=".json"
            onChange={handleFileChange}
          />
          <UploadCloud size={48} className="upload-icon" />
          <p className="upload-text">Drag & drop a data file here, or click to select a file</p>
        </div>
      </div>
      
      {/* Display Section */}
      <div className="content-card">
        {jsonData ? (
          <div className="json-preview">
            <pre>{JSON.stringify(jsonData, null, 2)}</pre>
            <button onClick={navigateToVisualization} className="btn-primary">
              <Share2 size={16} />
              <span>Generate Graph View</span>
            </button>
          </div>
        ) : (
          <div className="no-data-message">
            <p>No data to display. Please upload or paste a file.</p>
          </div>
        )}
      </div>
      
      {/* Tip Section */}
      <div className="tip-container">
        <div className="tip">
          <AlertTriangle size={18} className="tip-icon" />
          <p>Structured data with clear entity relationships will generate the most effective graph visualizations.</p>
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

export default JsonDataPage;