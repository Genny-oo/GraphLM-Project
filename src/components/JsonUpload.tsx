import React, { useState, useRef } from 'react';
import { UploadCloud, Code, AlertCircle } from 'react-feather';

interface JsonUploadProps {
  onJsonParsed: (data: any) => void;
}

/**
 * Enhanced JSON upload component with drag & drop functionality
 */
const JsonUpload: React.FC<JsonUploadProps> = ({ onJsonParsed }) => {
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handles drag over event
   */
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  /**
   * Handles drag leave event
   */
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  /**
   * Handles file drop event
   */
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      processFile(file);
    }
  };

  /**
   * Triggers file input click
   */
  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Handles file selection
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setError(null);
    
    if (!files || files.length === 0) {
      setFileName(null);
      return;
    }
    
    const file = files[0];
    processFile(file);
  };

  /**
   * Processes the selected file
   */
  const processFile = (file: File) => {
    setFileName(file.name);
    
    // Validate file type
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setError('Please select a JSON file');
      return;
    }
    
    // Read the file content
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        // Parse the JSON content
        const jsonData = JSON.parse(e.target?.result as string);
        onJsonParsed(jsonData);
        setError(null);
      } catch (err) {
        setError('Failed to parse JSON file. Please check the file format.');
        console.error('JSON parse error:', err);
      }
    };
    
    reader.onerror = () => {
      setError('Error reading file');
    };
    
    reader.readAsText(file);
  };

  /**
   * Provides sample JSON data
   */
  const provideSampleData = (type: string) => {
    let sampleData;
    
    switch (type) {
      case 'simple':
        sampleData = [1, 2, 3, 4, 5];
        break;
      case 'nested':
        sampleData = {
          name: "Product",
          details: {
            price: 99.99,
            description: "A sample product",
            features: ["Fast", "Reliable", "Affordable"]
          },
          inStock: true
        };
        break;
      case 'complex':
        sampleData = {
          id: "root",
          name: "Project",
          children: [
            {
              id: "1",
              name: "Backend",
              children: [
                { id: "1-1", name: "API", size: 3500 },
                { id: "1-2", name: "Database", size: 2400 }
              ]
            },
            {
              id: "2",
              name: "Frontend",
              children: [
                { id: "2-1", name: "Components", size: 1800 },
                { id: "2-2", name: "Assets", size: 5200 }
              ]
            }
          ]
        };
        break;
      default:
        sampleData = {};
    }
    
    onJsonParsed(sampleData);
  };
  
  return (
    <div className="json-upload">
      <div className="upload-header">
        <h2>Upload JSON</h2>
        <button className="btn-secondary">
          <Code size={14} />
          <span>Paste JSON</span>
        </button>
      </div>
      
      <div 
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleAreaClick}
      >
        <input
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="file-input"
        />
        
        <UploadCloud size={48} className="upload-icon" />
        <p className="upload-text">
          {fileName ? fileName : 'Drag & drop a JSON file here, or click to select a file'}
        </p>
      </div>
      
      {error && (
        <div className="error-message">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      
      <div className="sample-section">
        <p className="sample-label">Try a sample:</p>
        <div className="sample-buttons">
          <button 
            className="btn-sample"
            onClick={() => provideSampleData('simple')}
          >
            Simple Array
          </button>
          <button 
            className="btn-sample"
            onClick={() => provideSampleData('nested')}
          >
            Nested Object
          </button>
          <button 
            className="btn-sample"
            onClick={() => provideSampleData('complex')}
          >
            Complex Structure
          </button>
        </div>
      </div>
    </div>
  );
};

export default JsonUpload;