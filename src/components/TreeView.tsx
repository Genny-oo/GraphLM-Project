import React, { useState } from 'react';
import TreeItem from '@mui/lab/TreeItem';
import { TreeView as MuiTreeView } from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface TreeViewProps {
  data: any;
}

/**
 * Recursive function to generate tree items from a JSON structure
 * @param obj - The JSON object or array to convert
 * @param keyPath - The current path in the tree (for unique IDs)
 * @returns React elements representing the tree structure
 */
const generateTreeItems = (obj: any, keyPath: string = 'root'): React.ReactNode[] => {
  if (!obj || typeof obj !== 'object') {
    return [];
  }

  return Object.entries(obj).map(([key, value], index) => {
    const currentPath = `${keyPath}-${key}-${index}`;
    
    // Handle different value types
    if (value && typeof value === 'object') {
      // For objects and arrays, create a branch with children
      const isArray = Array.isArray(value);
      const childCount = isArray ? value.length : Object.keys(value).length;
      const labelText = isArray 
        ? `${key} [Array: ${childCount} items]` 
        : `${key} {Object: ${childCount} properties}`;
      
      return (
        <TreeItem key={currentPath} nodeId={currentPath} label={labelText}>
          {generateTreeItems(value, currentPath)}
        </TreeItem>
      );
    } else {
      // For primitive values, create a leaf node
      const valueType = value === null ? 'null' : typeof value;
      const valueDisplay = value === null ? 'null' : String(value);
      const labelText = `${key}: ${valueDisplay} (${valueType})`;
      
      return (
        <TreeItem 
          key={currentPath} 
          nodeId={currentPath} 
          label={labelText}
        />
      );
    }
  });
};

/**
 * TreeView component that renders a JSON structure as an expandable tree
 * Uses MUI's TreeView and TreeItem components
 */
const TreeView: React.FC<TreeViewProps> = ({ data }) => {
  const [expanded, setExpanded] = useState<string[]>(['root']);

  // Handle node expansion/collapse
  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds);
  };

  return (
    <div className="tree-view-container">
      <h2>JSON Tree Structure</h2>
      <div className="tree-view">
        <MuiTreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          expanded={expanded}
          onNodeToggle={handleToggle}
        >
          <TreeItem nodeId="root" label="Root">
            {generateTreeItems(data)}
          </TreeItem>
        </MuiTreeView>
      </div>
    </div>
  );
};

export default TreeView;