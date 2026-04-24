import React from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, Database, Code, Share2, AlertTriangle, Zap, GitPullRequest, FileText } from 'react-feather';

const Home: React.FC = () => {
  return (
    <div className="home-container startup-home">
      <section className="hero-section startup-hero">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />

        <div className="hero-content startup-hero-content">
          <div className="hero-pill">
            <Zap size={14} />
            <span>AI-ready JSON intelligence for developers</span>
          </div>

          <h1>Understand complex APIs in seconds.</h1>
          <p className="hero-description">
            Graph LM Pro turns messy JSON and API responses into interactive graphs, schemas,
            TypeScript interfaces, quality warnings, and breaking-change reports.
          </p>

          <div className="hero-actions">
            <Link to="/json-data" className="cta-button">
              <UploadCloud size={18} />
              <span>Analyze JSON</span>
            </Link>
            <Link to="/compare" className="btn-secondary hero-secondary-action">
              <GitPullRequest size={18} />
              <span>Compare API Versions</span>
            </Link>
          </div>
        </div>

        <div className="hero-preview-card content-card">
          <div className="preview-toolbar">
            <span></span><span></span><span></span>
            <strong>Graph LM Pro</strong>
          </div>
          <div className="preview-grid">
            <div className="preview-node root-node">API</div>
            <div className="preview-node">users[]</div>
            <div className="preview-node warning-node">type change</div>
            <div className="preview-node">schema.ts</div>
            <div className="preview-node success-node">report.md</div>
          </div>
        </div>
      </section>

      <section className="section stats-strip content-card">
        <div><strong>4</strong><span>Import modes</span></div>
        <div><strong>7+</strong><span>Analysis checks</span></div>
        <div><strong>D3</strong><span>Graph engine</span></div>
        <div><strong>TS</strong><span>Interface output</span></div>
      </section>

      <section className="section">
        <h2 className="section-title">Built like a real developer platform</h2>
        <div className="feature-grid three-columns">
          <div className="feature-card startup-card">
            <div className="feature-icon"><Database size={24} /></div>
            <h3>API Intelligence</h3>
            <p>Import JSON, inspect structure, generate schema summaries, and understand deeply nested responses.</p>
          </div>
          <div className="feature-card startup-card">
            <div className="feature-icon"><GitPullRequest size={24} /></div>
            <h3>Breaking Change Detection</h3>
            <p>Compare API versions and surface risky removed fields, type changes, and nested value updates.</p>
          </div>
          <div className="feature-card startup-card">
            <div className="feature-icon"><Code size={24} /></div>
            <h3>TypeScript Generation</h3>
            <p>Turn payloads into starter TypeScript interfaces that help frontend teams work faster and safer.</p>
          </div>
          <div className="feature-card startup-card">
            <div className="feature-icon"><Share2 size={24} /></div>
            <h3>Interactive Graph View</h3>
            <p>Explore JSON relationships visually with searchable D3 nodes, adjustable depth, and SVG export.</p>
          </div>
          <div className="feature-card startup-card">
            <div className="feature-icon"><AlertTriangle size={24} /></div>
            <h3>Quality Warnings</h3>
            <p>Flag nulls, empty structures, deep nesting, and inconsistent array object shapes before they cause bugs.</p>
          </div>
          <div className="feature-card startup-card">
            <div className="feature-icon"><FileText size={24} /></div>
            <h3>Exportable Reports</h3>
            <p>Create developer-friendly Markdown reports for pull requests, documentation, and debugging notes.</p>
          </div>
        </div>
      </section>

      <section className="cta-section startup-cta">
        <h2>Ready to debug your API like a pro?</h2>
        <p>Start with a JSON file, pasted payload, or API response, then move from raw data to insight.</p>
        <Link to="/json-data" className="cta-button">
          <UploadCloud size={18} />
          <span>Launch Analyzer</span>
        </Link>
      </section>
    </div>
  );
};

export default Home;
