import React, { useState } from 'react';
import TreeView from './TreeView';
import D3Visualization from './D3Visualization';
import { AlertTriangle } from 'react-feather';

interface JsonViewerProps {
  onRemove?: () => void;
  jsonData?: any;
}

/**
 * JsonViewer component that displays tree view and D3 visualization
 * of provided JSON data
 */
const JsonViewer: React.FC<JsonViewerProps> = ({ onRemove, jsonData }) => {
  const [localData] = useState<any>(jsonData || null);

  return (
    <div className="json-viewer">
      <div className="json-viewer-header">
        <h2>JSON Visualizer</h2>
        {onRemove && (
          <button className="btn-secondary" onClick={onRemove}>
            Remove
          </button>
        )}
      </div>
      
      {/* Show visualizations only if JSON data is available */}
      {localData ? (
        <div className="json-visualization-container">
          {/* MUI TreeView visualization */}
          <TreeView data={localData} />
          
          {/* D3.js visualization */}
          <D3Visualization data={localData} />
        </div>
      ) : (
        <div className="no-data-message">
          <p>No JSON data available. Please upload or paste a file.</p>
        </div>
      )}
      
      {/* Tip Section */}
      <div className="tip-container">
        <div className="tip">
          <AlertTriangle size={18} className="tip-icon" />
          <p>JSON with unique ID fields are often easier to visualize as hierarchical trees.</p>
        </div>
      </div>
    </div>
  );
};

export default JsonViewer;