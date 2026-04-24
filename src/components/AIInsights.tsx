import React, { useState } from 'react';

interface Props {
  data: any;
  source?: string;
}

const AIInsights: React.FC<Props> = ({ data, source }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analyze-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ json: data, source })
      });

      const json = await res.json();
      setResult(json.summary || JSON.stringify(json, null, 2));
    } catch (err) {
      setResult('Failed to run AI analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-card">
      <div className="card-header">
        <h2>AI Engineering Analysis</h2>
      </div>
      <div style={{ padding: '1rem' }}>
        <button className="btn-primary" onClick={runAnalysis} disabled={loading}>
          {loading ? 'Analyzing...' : 'Run AI Analysis'}
        </button>

        {result && (
          <pre style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>{result}</pre>
        )}
      </div>
    </div>
  );
};

export default AIInsights;
