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
  Trash2,
  Download,
  Activity
} from 'react-feather';
import { clearGraphData, loadGraphData, saveGraphData } from '../utils/storage';
import {
  analyzeQuality,
  buildMarkdownReport,
  calculateJsonMetrics,
  generateSchema,
  generateTypeScriptInterface
} from '../utils/jsonIntelligence';
import AIInsights from '../components/AIInsights';

const JsonDataPage: React.FC = () => {
  const [jsonData, setJsonData] = useState<Record<string, any> | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [lastModified, setLastModified] = useState<string | null>(null);
  const [showPasteEditor, setShowPasteEditor] = useState(false);
  const [pastedJson, setPastedJson] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
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

  const handleFetchApi = async () => {
    if (!apiUrl.trim()) {
      alert('Please enter an API endpoint.');
      return;
    }

    try {
      setApiLoading(true);
      const response = await fetch(apiUrl.trim());
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      handleJsonParsed(data, apiUrl.trim());
    } catch (error) {
      console.error('Failed to fetch API data:', error);
      alert('Unable to fetch JSON from this endpoint. Check the URL or CORS settings.');
    } finally {
      setApiLoading(false);
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
  
  const navigateToVisualization = () => {
    if (!jsonData) {
      alert('Please upload, paste, or fetch JSON data first');
      return;
    }
    
    navigate('/tree-visualization', { 
      state: { 
        jsonData,
        fileName: currentFile
      } 
    });
  };

  const downloadReport = () => {
    if (!jsonData) return;
    const report = buildMarkdownReport(currentFile ?? 'Graph LM Pro Dataset', jsonData);
    const blob = new Blob([report], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'graph-lm-pro-report.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  const metrics = jsonData ? calculateJsonMetrics(jsonData) : null;
  const qualityIssues = jsonData ? analyzeQuality(jsonData) : [];
  const schema = jsonData ? generateSchema(jsonData) : null;
  const tsInterface = jsonData ? generateTypeScriptInterface(jsonData) : '';
  
  return (
    <div className="json-data-page">
      <h1 className="page-title">Data Editor</h1>
      
      <div className="progress-tracker">
        <div className="progress-step active"><div className="progress-icon"><FileText size={16} /></div><span>Import</span></div>
        <div className="progress-connector"></div>
        <div className="progress-step active"><div className="progress-icon"><Activity size={16} /></div><span>Analyze</span></div>
        <div className="progress-connector"></div>
        <div className="progress-step"><div className="progress-icon"><Share2 size={16} /></div><span>Visualize</span></div>
      </div>
      
      {currentFile && (
        <div className="source-info-card">
          <div className="source-info-header"><h3>Current Source</h3></div>
          <div className="source-details">
            <div className="source-item"><FileText size={14} /><span><strong>Source:</strong> {currentFile}</span></div>
            <div className="source-item"><Clock size={14} /><span><strong>Last Modified:</strong> {lastModified}</span></div>
          </div>
        </div>
      )}

      <div className="content-card">
        <div className="card-header"><h2>Fetch JSON from API</h2></div>
        <div className="paste-editor">
          <label className="paste-editor-label">Paste a public JSON API endpoint</label>
          <div className="paste-editor-actions">
            <input
              value={apiUrl}
              onChange={(event) => setApiUrl(event.target.value)}
              className="search-input"
              placeholder="https://api.example.com/users"
            />
            <button className="btn-primary" onClick={handleFetchApi} disabled={apiLoading}>
              <RefreshCw size={16} />
              <span>{apiLoading ? 'Fetching...' : 'Fetch API'}</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="content-card">
        <div className="card-header">
          <h2>Upload or Paste Data</h2>
          <button className="btn-secondary" onClick={() => setShowPasteEditor((current) => !current)}>
            <Code size={16} />
            <span>{showPasteEditor ? 'Hide Editor' : 'Paste Data'}</span>
          </button>
        </div>
        
        <div className={`upload-area ${isDragging ? 'dragging' : ''}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={handleFileClick}>
          <input type="file" ref={fileInputRef} className="hidden-input" accept=".json" onChange={handleFileChange} />
          <UploadCloud size={48} className="upload-icon" />
          <p className="upload-text">Drag & drop a JSON file here, or click to select a file</p>
        </div>

        {showPasteEditor && (
          <div className="paste-editor">
            <label htmlFor="json-paste-area" className="paste-editor-label">Paste valid JSON below</label>
            <textarea id="json-paste-area" className="paste-editor-input" value={pastedJson} onChange={(event) => setPastedJson(event.target.value)} placeholder='{"users":[{"id":1,"name":"Ada"}]}' />
            <div className="paste-editor-actions">
              <button className="btn-secondary" onClick={() => setPastedJson('')}>Clear</button>
              <button className="btn-primary" onClick={handlePasteSubmit}>Use Pasted JSON</button>
            </div>
          </div>
        )}
      </div>

      {jsonData && metrics && (
        <div className="content-card">
          <div className="card-header"><h2>Engineering Insights</h2></div>
          <div className="insights-content" style={{ padding: '1rem' }}>
            <div className="insights-section">
              <h3>Metrics</h3>
              <div className="insights-metrics">
                <div className="metric-row"><span>Total Nodes:</span><strong>{metrics.totalNodes}</strong></div>
                <div className="metric-row"><span>Objects:</span><strong>{metrics.objects}</strong></div>
                <div className="metric-row"><span>Arrays:</span><strong>{metrics.arrays}</strong></div>
                <div className="metric-row"><span>Max Depth:</span><strong>{metrics.maxDepth}</strong></div>
              </div>
            </div>
            <div className="insights-section">
              <h3>Quality Warnings</h3>
              {qualityIssues.length === 0 ? <p>No major issues detected.</p> : qualityIssues.slice(0, 6).map((issue, index) => <p key={index}><strong>{issue.severity.toUpperCase()}</strong> {issue.path}: {issue.message}</p>)}
            </div>
            <div className="insights-section">
              <h3>Generated Schema</h3>
              <pre>{JSON.stringify(schema, null, 2)}</pre>
            </div>
            <div className="insights-section">
              <h3>TypeScript Interface</h3>
              <pre>{tsInterface}</pre>
            </div>
          </div>
        </div>
      )}

      {jsonData && <AIInsights data={jsonData} source={currentFile ?? undefined} />}
      
      <div className="content-card">
        {jsonData ? (
          <div className="json-preview">
            <pre>{JSON.stringify(jsonData, null, 2)}</pre>
            <div className="json-preview-actions">
              <button onClick={navigateToVisualization} className="btn-primary"><Share2 size={16} /><span>Generate Graph View</span></button>
              <button onClick={downloadReport} className="btn-secondary"><Download size={16} /><span>Download Report</span></button>
              <button onClick={handleClearData} className="btn-secondary"><Trash2 size={16} /><span>Clear Data</span></button>
            </div>
          </div>
        ) : (
          <div className="no-data-message"><p>No data to display. Please upload, paste, or fetch JSON.</p></div>
        )}
      </div>
      
      <div className="tip-container">
        <div className="tip">
          <AlertTriangle size={18} className="tip-icon" />
          <p>Engineering mode focuses on schemas, contracts, warnings, and reports that help teams debug API payloads.</p>
          <button className="btn-refresh" onClick={() => setShowPasteEditor(true)}><RefreshCw size={14} /></button>
        </div>
      </div>
      
      <div className="footer"><p>Graph LM Pro Developer Tool</p></div>
    </div>
  );
};

export default JsonDataPage;
