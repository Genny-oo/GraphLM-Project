export interface GraphSettings {
  darkMode: boolean;
  showNodeValues: boolean;
  autoCollapse: boolean;
}

export interface StoredGraphData {
  jsonData: Record<string, any>;
  fileName: string | null;
  lastModified: string | null;
}

export const GRAPH_SETTINGS_KEY = 'graphLmSettings';
export const GRAPH_DATA_KEY = 'graphLmData';
export const GRAPH_SETTINGS_EVENT = 'graphlm:settings-changed';

export const DEFAULT_GRAPH_SETTINGS: GraphSettings = {
  darkMode: true,
  showNodeValues: true,
  autoCollapse: true
};

export const loadGraphSettings = (): GraphSettings => {
  try {
    const rawSettings = localStorage.getItem(GRAPH_SETTINGS_KEY);
    if (!rawSettings) {
      return DEFAULT_GRAPH_SETTINGS;
    }

    return {
      ...DEFAULT_GRAPH_SETTINGS,
      ...JSON.parse(rawSettings)
    };
  } catch (error) {
    console.error('Failed to read graph settings:', error);
    return DEFAULT_GRAPH_SETTINGS;
  }
};

export const saveGraphSettings = (settings: GraphSettings) => {
  localStorage.setItem(GRAPH_SETTINGS_KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent(GRAPH_SETTINGS_EVENT, { detail: settings }));
};

export const loadGraphData = (): StoredGraphData | null => {
  try {
    const rawData = localStorage.getItem(GRAPH_DATA_KEY);
    if (!rawData) {
      return null;
    }

    return JSON.parse(rawData) as StoredGraphData;
  } catch (error) {
    console.error('Failed to read saved graph data:', error);
    return null;
  }
};

export const saveGraphData = (payload: StoredGraphData) => {
  localStorage.setItem(GRAPH_DATA_KEY, JSON.stringify(payload));
};

export const clearGraphData = () => {
  localStorage.removeItem(GRAPH_DATA_KEY);
};
