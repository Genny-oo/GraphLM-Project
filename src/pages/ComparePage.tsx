import React, { useMemo, useState } from 'react';
import { diffJson, DiffEntry } from '../utils/jsonIntelligence';

const renderSeverity = (severity: DiffEntry['severity']) => {
  if (severity === 'high') return '🔥';
  if (severity === 'medium') return '⚠️';
  return 'ℹ️';
};

const ComparePage: React.FC = () => {
  const [beforeJson, setBeforeJson] = useState<string>('');
  const [afterJson, setAfterJson] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const results = useMemo(() => {
    try {
      if (!beforeJson || !afterJson) return [] as DiffEntry[];
      const before = JSON.parse(beforeJson);
      const after = JSON.parse(afterJson);
      setError(null);
      return diffJson(before, after);
    } catch (err) {
      setError('Invalid JSON provided.');
      return [] as DiffEntry[];
    }
  }, [beforeJson, afterJson]);

  return (
    <div>
      <h1 className="page-title">Compare JSON</h1>

      <div className="content-card">
        <div className="card-header">
          <h2>API Version Comparison</h2>
        </div>
        <div style={{ padding: '1rem', display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <h3>Version A (Current)</h3>
            <textarea
              value={beforeJson}
              onChange={(e) => setBeforeJson(e.target.value)}
              className="paste-editor-input"
              placeholder="Paste original JSON here"
            />
          </div>
          <div>
            <h3>Version B (New)</h3>
            <textarea
              value={afterJson}
              onChange={(e) => setAfterJson(e.target.value)}
              className="paste-editor-input"
              placeholder="Paste updated JSON here"
            />
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="card-header">
          <h2>Detected Changes</h2>
        </div>
        <div style={{ padding: '1rem' }}>
          {error && <p className="error-message">{error}</p>}
          {!error && results.length === 0 && <p>No differences detected.</p>}
          {!error && results.length > 0 && (
            <ul>
              {results.map((entry, index) => (
                <li key={`${entry.path}-${index}`}>
                  {renderSeverity(entry.severity)} <strong>{entry.type}</strong> at <code>{entry.path}</code>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparePage;
