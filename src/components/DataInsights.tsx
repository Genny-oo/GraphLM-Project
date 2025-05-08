import React from 'react';
import { Info, BarChart2, List } from 'react-feather';

interface DataInsightsProps {
  data: any;
}

/**
 * Component to display data structure insights
 * Shows metrics about complexity, depth, etc.
 */
const DataInsights: React.FC<DataInsightsProps> = ({ data }) => {
  // Calculate structure metrics
  const calculateStructureMetrics = (json: any) => {
    // Default empty values
    if (!json) {
      return {
        complexity: 0,
        maxDepth: 0,
        uniqueKeys: 0,
        avgKeysPerObject: 0
      };
    }
    
    let uniqueKeys = new Set();
    let objectCount = 0;
    let totalKeys = 0;
    let maxDepth = 0;
    
    // Recursive function to analyze objects
    const analyzeObject = (obj: any, depth: number) => {
      if (depth > maxDepth) maxDepth = depth;
      
      if (obj && typeof obj === 'object') {
        if (!Array.isArray(obj)) {
          objectCount++;
          totalKeys += Object.keys(obj).length;
          
          Object.keys(obj).forEach(key => {
            uniqueKeys.add(key);
            if (obj[key] && typeof obj[key] === 'object') {
              analyzeObject(obj[key], depth + 1);
            }
          });
        } else {
          obj.forEach(item => {
            if (item && typeof item === 'object') {
              analyzeObject(item, depth + 1);
            }
          });
        }
      }
    };
    
    analyzeObject(json, 1);
    
    // Calculate complexity on a scale of 1-10
    const complexity = Math.min(10, Math.ceil((maxDepth * uniqueKeys.size) / 15));
    
    // Calculate average keys per object
    const avgKeysPerObject = objectCount > 0 ? (totalKeys / objectCount).toFixed(1) : 0;
    
    return {
      complexity,
      maxDepth,
      uniqueKeys: uniqueKeys.size,
      avgKeysPerObject
    };
  };
  
  // Calculate content metrics
  const calculateContentMetrics = (json: any) => {
    // Default empty values
    if (!json) {
      return {
        totalItems: 0,
        objects: 0,
        arrays: 0,
        primitiveValues: 0
      };
    }
    
    let objects = 0;
    let arrays = 0;
    let primitiveValues = 0;
    
    // Recursive function to count types
    const countTypes = (value: any) => {
      if (value === null || value === undefined) {
        primitiveValues++;
      } else if (Array.isArray(value)) {
        arrays++;
        value.forEach(item => countTypes(item));
      } else if (typeof value === 'object') {
        objects++;
        Object.values(value).forEach(item => countTypes(item));
      } else {
        primitiveValues++;
      }
    };
    
    countTypes(json);
    
    return {
      totalItems: objects + arrays + primitiveValues,
      objects,
      arrays,
      primitiveValues
    };
  };
  
  const structureMetrics = calculateStructureMetrics(data);
  const contentMetrics = calculateContentMetrics(data);
  
  return (
    <div className="data-insights-card">
      <div className="insights-header">
        <Info size={20} className="insights-icon" />
        <h2>Data Insights</h2>
      </div>
      
      <div className="insights-content">
        <div className="insights-section">
          <div className="insights-section-header">
            <BarChart2 size={16} />
            <h3>Structure Analysis</h3>
          </div>
          
          <div className="insights-metrics">
            <div className="metric-row">
              <span className="metric-label">Complexity:</span>
              <span className="metric-value">{structureMetrics.complexity}/10</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Max Depth:</span>
              <span className="metric-value">{structureMetrics.maxDepth} levels</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Unique Keys:</span>
              <span className="metric-value">{structureMetrics.uniqueKeys}</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Avg Keys/Object:</span>
              <span className="metric-value">{structureMetrics.avgKeysPerObject}</span>
            </div>
          </div>
        </div>
        
        <div className="insights-section">
          <div className="insights-section-header">
            <List size={16} />
            <h3>Content Analysis</h3>
          </div>
          
          <div className="insights-metrics">
            <div className="metric-row">
              <span className="metric-label">Total Items:</span>
              <span className="metric-value">{contentMetrics.totalItems}</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Objects:</span>
              <span className="metric-value">{contentMetrics.objects}</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Arrays:</span>
              <span className="metric-value">{contentMetrics.arrays}</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Primitive Values:</span>
              <span className="metric-value">{contentMetrics.primitiveValues}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataInsights;