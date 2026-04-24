import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  Code, 
  AlertTriangle, 
  RefreshCw,
  FileText,
  Clock,
  Share2,
  Trash2
} from 'react-feather';
import { clearGraphData, loadGraphData, saveGraphData } from '../utils/storage';

/**
 * Enhanced Data Editor page that passes data to visualization
 */
const JsonDataPage: React.FC = () => {
  const [jsonData, setJsonData] = useState<Record<string, any> | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [lastModified, setLastModified] = useState<string | null>(null);
  const [showPasteEditor, setShowPasteEditor] = useState(false);
  const [pastedJson, setPastedJson] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const savedGraphData = loadGraphData();
    if (!savedGraphData) return;

    setJsonData(savedGraphData.jsonData);
    setCurrentFile(savedGraphData.fileName);
    setLastModified(savedGraphData.lastModified);
    setPastedJson(JSON.stringify(savedGraphData.jsonData, null, 2));
  }, []);

  useEffect(() => {
    if (!jsonData) return;

    saveGraphData({
      jsonData,
      fileName: currentFile,
      lastModified
    });
  }, [jsonData, currentFile, lastModified]);

  const handleJsonParsed = (data: Record<string, any>, fileName?: string) => {
    const savedAt = new Date().toLocaleString();
    setJsonData(data);
    setCurrentFile(fileName ?? 'Pasted JSON');
    setLastModified(savedAt);
    setPastedJson(JSON.stringify(data, null, 2));
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

  const handlePasteSubmit = () => {
    try {
      const parsedJson = JSON.parse(pastedJson);
      handleJsonParsed(parsedJson);
      setShowPasteEditor(false);
    } catch (error) {
      console.error('Error parsing pasted JSON', error);
      alert('That JSON could not be parsed. Please check the format and try again.');
    }
  };

  const handleClearData = () => {
    setJsonData(null);
    setCurrentFile(null);
    setLastModified(null);
    setPastedJson('');
    clearGraphData();
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
          <button
            className="btn-secondary"
            onClick={() => setShowPasteEditor((current) => !current)}
          >
            <Code size={16} />
            <span>{showPasteEditor ? 'Hide Editor' : 'Paste Data'}</span>
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

        {showPasteEditor && (
          <div className="paste-editor">
            <label htmlFor="json-paste-area" className="paste-editor-label">
              Paste valid JSON below
            </label>
            <textarea
              id="json-paste-area"
              className="paste-editor-input"
              value={pastedJson}
              onChange={(event) => setPastedJson(event.target.value)}
              placeholder='{"nodes":[{"id":1}]}'
            />
            <div className="paste-editor-actions">
              <button className="btn-secondary" onClick={() => setPastedJson('')}>
                Clear
              </button>
              <button className="btn-primary" onClick={handlePasteSubmit}>
                Use Pasted JSON
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Display Section */}
      <div className="content-card">
        {jsonData ? (
          <div className="json-preview">
            <pre>{JSON.stringify(jsonData, null, 2)}</pre>
            <div className="json-preview-actions">
              <button onClick={navigateToVisualization} className="btn-primary">
                <Share2 size={16} />
                <span>Generate Graph View</span>
              </button>
              <button onClick={handleClearData} className="btn-secondary">
                <Trash2 size={16} />
                <span>Clear Data</span>
              </button>
            </div>
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
          <button className="btn-refresh" onClick={() => setShowPasteEditor(true)}>
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
