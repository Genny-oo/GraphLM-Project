import React, { useEffect, useRef, useCallback, useState } from 'react';
import * as d3 from 'd3';
import DataInsights from './DataInsights';
import {
  DEFAULT_GRAPH_SETTINGS,
  GRAPH_SETTINGS_EVENT,
  GraphSettings,
  loadGraphSettings
} from '../utils/storage';

interface D3VisualizationProps {
  data: any;
}

// Define node type for D3
interface NodeDatum extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  value: any;
  type: string;
  group: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

// Define link type for D3
interface LinkDatum {
  source: string | NodeDatum;
  target: string | NodeDatum;
  value: number;
}

/**
 * Enhanced D3 Visualization component that creates a network graph
 * With more robust error handling for data structures
 */
const D3Visualization: React.FC<D3VisualizationProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandLevel, setExpandLevel] = useState<number>(3);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<GraphSettings>(DEFAULT_GRAPH_SETTINGS);

  useEffect(() => {
    const nextSettings = loadGraphSettings();
    setSettings(nextSettings);
    setExpandLevel(nextSettings.autoCollapse ? 3 : 5);

    const syncSettings = (event: Event) => {
      const customEvent = event as CustomEvent<GraphSettings>;
      const updatedSettings = customEvent.detail ?? loadGraphSettings();
      setSettings(updatedSettings);
      setExpandLevel((currentLevel) => {
        if (!updatedSettings.autoCollapse) {
          return Math.max(currentLevel, 4);
        }

        return Math.min(currentLevel, 3);
      });
    };

    window.addEventListener(GRAPH_SETTINGS_EVENT, syncSettings as EventListener);
    return () => {
      window.removeEventListener(GRAPH_SETTINGS_EVENT, syncSettings as EventListener);
    };
  }, []);

  // Clone the input safely so D3 can work with a detached structure.
  const safeCloneData = useCallback((inputData: any) => {
    try {
      if (typeof structuredClone === 'function') {
        return structuredClone(inputData);
      }

      return JSON.parse(JSON.stringify(inputData));
    } catch (err) {
      console.error("Error in safeCloneData:", err);
      return inputData;
    }
  }, []);

  // Function to convert JSON to graph structure (nodes & links)
  const convertToGraphData = useCallback((obj: any) => {
    // Apply safe processing first
    const safeData = safeCloneData(obj);
    
    const nodes: NodeDatum[] = [];
    const links: LinkDatum[] = [];
    
    try {
      // Process objects recursively
      const processObject = (value: any, path: string, depth: number = 0) => {
        // Don't process beyond expand level
        if (depth > expandLevel) return;
        
        // Add current node
        const nodeType = value === null
          ? 'null'
          : Array.isArray(value)
            ? 'array'
            : typeof value;
        
        // Get display name (last part of the path)
        const name = path.split('.').pop() || 'root';
        
        // Skip if this node already exists
        if (!nodes.some(n => n.id === path)) {
          nodes.push({
            id: path,
            name,
            value: typeof value === 'object' && value !== null ? null : value,
            type: nodeType,
            group: depth + 1
          });
        }
        
        // Stop before creating links to children that won't be added as nodes.
        if (depth >= expandLevel) {
          return;
        }

        // If value is an object, process its properties
        if (value && typeof value === 'object') {
          const rawEntries = Array.isArray(value)
            ? value.map((item, index) => [index.toString(), item])
            : Object.entries(value);

          const entryLimit = settings.autoCollapse ? 12 : rawEntries.length;
          const entries = rawEntries.slice(0, entryLimit);
          
          entries.forEach(([key, childValue]) => {
            const childPath = `${path}.${key}`;
            
            // Skip if this link already exists
            if (!links.some(l => l.source === path && l.target === childPath)) {
              // Add link between parent and child
              links.push({
                source: path,
                target: childPath,
                value: 1
              });
              
              // Process child recursively
              processObject(childValue, childPath, depth + 1);
            }
          });

          if (settings.autoCollapse && rawEntries.length > entryLimit) {
            const summaryPath = `${path}.__collapsed__`;
            const hiddenCount = rawEntries.length - entryLimit;

            if (!nodes.some((node) => node.id === summaryPath)) {
              nodes.push({
                id: summaryPath,
                name: `+${hiddenCount} more`,
                value: `${hiddenCount} hidden items`,
                type: 'string',
                group: depth + 2
              });
            }

            links.push({
              source: path,
              target: summaryPath,
              value: 1
            });
          }
        }
      };
      
      // Start processing from root
      processObject(safeData, 'root');
    } catch (err) {
      console.error("Error in convertToGraphData:", err);
      setError("Failed to process data for visualization");
    }
    
    return { nodes, links };
  }, [expandLevel, safeCloneData, settings.autoCollapse]);

  // Effect to create/update the D3 visualization
  useEffect(() => {
    if (!svgRef.current || !data) return;
    
    try {
      // Convert data to graph format within try-catch
      const graphData = convertToGraphData(data);
      
      if (graphData.nodes.length === 0) {
        setError("No nodes generated from data");
        return;
      }
      
      // Clear previous visualization
      d3.select(svgRef.current).selectAll('*').remove();
      
      // Set up SVG dimensions
      const width = containerRef.current?.clientWidth || svgRef.current.clientWidth || 800;
      const height = 600;
      
      // Create SVG
      const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])
        .attr('style', 'max-width: 100%; height: auto;');
      
      // Filter nodes by search query if present
      let filteredNodes = graphData.nodes;
      let filteredLinks = graphData.links;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredNodes = graphData.nodes.filter(node =>
          node.name.toLowerCase().includes(query) ||
          (node.value !== null && String(node.value).toLowerCase().includes(query))
        );
        
        // Only keep links between filtered nodes
        const nodeIds = new Set(filteredNodes.map(n => n.id));
        filteredLinks = graphData.links.filter(link => {
          const sourceId = typeof link.source === 'object' 
            ? (link.source as NodeDatum).id 
            : link.source as string;
            
          const targetId = typeof link.target === 'object' 
            ? (link.target as NodeDatum).id 
            : link.target as string;
            
          return nodeIds.has(sourceId) && nodeIds.has(targetId);
        });
      }
      
      // Create a force simulation with error handling
      let simulation: d3.Simulation<NodeDatum, LinkDatum>;
      try {
        simulation = d3.forceSimulation<NodeDatum>(filteredNodes)
          .force('link', d3.forceLink<NodeDatum, LinkDatum>(filteredLinks)
            .id(d => d.id)
            .distance(70))
          .force('charge', d3.forceManyBody().strength(-150))
          .force('center', d3.forceCenter(width / 2, height / 2))
          .force('collide', d3.forceCollide().radius(30))
          .alpha(1);
      } catch (e) {
        console.error("Error creating simulation:", e);
        setError("Error creating visualization. Please try a different data structure.");
        return;
      }
      
      // Add zoom behavior
      const zoom = d3.zoom()
        .scaleExtent([0.2, 8])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });
      
      svg.call(zoom as any);
      
      // Add graph container
      const g = svg.append('g');
      
      // Create links
      const link = g.append('g')
        .attr('class', 'links')
        .selectAll('path')
        .data(filteredLinks)
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('stroke', '#888')
        .attr('stroke-opacity', 0.6)
        .attr('fill', 'none')
        .attr('stroke-width', 1.5);
      
      // Create node groups
      const node = g.append('g')
        .attr('class', 'nodes')
        .selectAll('.node')
        .data(filteredNodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .call(d3.drag<SVGGElement, NodeDatum>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }));
      
      // Color scale for different data types
      const typeColorScale = d3.scaleOrdinal()
        .domain(['object', 'array', 'string', 'number', 'boolean', 'null'])
        .range(['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#8F00FF', '#888888']);
      
      // Add circles to nodes
      node.append('circle')
        .attr('r', (d: NodeDatum) => {
          // Size based on node type
          if (d.name === 'root') return 16;
          return d.type === 'object' || d.type === 'array' ? 10 : 6;
        })
        .attr('fill', (d: NodeDatum) => {
          if (d.name === 'root') return '#e53e3e';
          return typeColorScale(d.type) as string;
        })
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .attr('cursor', 'pointer')
        .on('click', function(event, d: NodeDatum) {
          // Handle node click - expand/collapse functionality could be added here
          console.log('Node clicked:', d);
        })
        .append('title')
        .text((d: NodeDatum) => {
          // Node tooltip
          if (d.value !== null && d.value !== undefined) {
            return `${d.name}: ${d.value}`;
          }
          return d.name;
        });
      
      if (settings.showNodeValues) {
        node.append('text')
          .attr('dx', 12)
          .attr('dy', 4)
          .attr('fill', 'var(--text-secondary)')
          .attr('font-size', '10px')
          .text((d: NodeDatum) => {
            if (d.type !== 'object' && d.type !== 'array' && d.value !== null && d.value !== undefined) {
              const valueStr = String(d.value);
              return `${d.name}: ${valueStr.substring(0, 15)}${valueStr.length > 15 ? '...' : ''}`;
            }

            return d.name;
          });
      } else {
        node.append('text')
          .attr('dx', 12)
          .attr('dy', 4)
          .attr('fill', 'var(--text-secondary)')
          .attr('font-size', '10px')
          .text((d: NodeDatum) => d.name);
      }
      
      // Update positions on each simulation tick
      simulation.on('tick', () => {
        // Update links with curved paths
        link.attr('d', (d: any) => {
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const dr = Math.sqrt(dx * dx + dy * dy) * 2;
          return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
        });
        
        // Update node positions
        node.attr('transform', (d: NodeDatum) => `translate(${d.x},${d.y})`);
      });
      
      // Add auto centering - run simulation for a bit to get a good layout
      for (let i = 0; i < 100; ++i) simulation.tick();
      
      // Clear error if visualization succeeds
      setError(null);
      
      // Return a cleanup function
      return () => {
        simulation.stop();
      };
    } catch (error) {
      console.error("Error in D3Visualization effect:", error);
      setError("Error rendering visualization. Please try a different data structure.");
    }
  }, [data, convertToGraphData, searchQuery, settings.showNodeValues]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle expand level change
  const handleExpandLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setExpandLevel(parseInt(e.target.value));
  };

  const handleDownloadSvg = () => {
    if (!svgRef.current) return;

    const serializer = new XMLSerializer();
    const svgMarkup = serializer.serializeToString(svgRef.current);
    const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const blobUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');

    downloadLink.href = blobUrl;
    downloadLink.download = 'graph-lm-visualization.svg';
    downloadLink.click();
    URL.revokeObjectURL(blobUrl);
  };

  const handleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }

      await containerRef.current.requestFullscreen();
    } catch (fullscreenError) {
      console.error('Unable to toggle fullscreen:', fullscreenError);
    }
  };

  return (
    <div className="d3-visualization-container">
      {/* Data Insights */}
      {data && <DataInsights data={data} />}
      
      {/* Interactive JSON Tree */}
      <div className="content-card">
        <div className="card-header">
          <h2>Interactive JSON Tree</h2>
        </div>
        <div className="visualization-controls">
          <div className="control-group">
            <label>Auto-expand:</label>
            <select
              value={expandLevel}
              onChange={handleExpandLevelChange}
              className="select-control"
            >
              <option value={1}>1 level</option>
              <option value={2}>2 levels</option>
              <option value={3}>3 levels</option>
              <option value={4}>4 levels</option>
              <option value={5}>5 levels</option>
            </select>
          </div>
          <div className="control-group search-control">
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          <div className="control-buttons">
            <button className="btn-secondary" onClick={handleDownloadSvg}>
              <span>Download SVG</span>
            </button>
            <button className="btn-secondary" onClick={handleFullscreen}>
              <span>Fullscreen</span>
            </button>
          </div>
        </div>
        {error ? (
          <div className="error-message" style={{ margin: '20px' }}>
            <p>{error}</p>
            <p>Try using a different data structure or a sample data option.</p>
          </div>
        ) : (
          <div ref={containerRef} className="visualization-svg-container">
            <svg ref={svgRef} className="d3-svg"></svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default D3Visualization;
