# Graph LM Pro — API & JSON Intelligence Dashboard

Graph LM Pro is a React + TypeScript developer tool for visualizing, debugging, comparing, and analyzing complex JSON and API responses. It combines D3 graph rendering with schema inference, TypeScript interface generation, data quality checks, JSON diffing, exportable reports, and a workspace-style workflow.

## What it does

- Upload JSON files, paste raw JSON, or fetch JSON from an API endpoint
- Persist the current dataset across refreshes
- Explore JSON as an interactive D3 network graph with adjustable depth
- Search nodes inside the graph
- Generate JSON schema-style type summaries
- Generate starter TypeScript interfaces from JSON payloads
- Compare two JSON payloads to detect added, removed, changed, and type-changed fields
- Flag likely breaking API changes such as removed fields and type changes
- Detect data quality issues such as null values, empty arrays, empty objects, deep nesting, and inconsistent array object shapes
- Save multiple local workspaces and reload them later
- Export Markdown analysis reports
- Download the current visualization as SVG
- Toggle display settings such as theme, node values, and auto-collapse

## Why it matters

Modern engineering teams work with deeply nested API responses, configuration files, logs, and generated AI outputs. Graph LM Pro helps developers understand those structures visually, detect risky changes, and communicate data shape clearly.

## Tech stack

- React 19
- TypeScript
- D3.js
- React Router
- Create React App (`react-scripts`)
- Browser localStorage for saved workspaces

## Getting started

```bash
npm install
npm start
```

The development server runs at [http://localhost:3000](http://localhost:3000).

## Run tests

```bash
npm test
```

For a one-shot CI-style run:

```bash
CI=true npm test -- --watchAll=false
```

## Build for production

```bash
npm run build
```

## App flow

1. Open the Data Editor
2. Upload a `.json` file, paste JSON manually, or fetch an API endpoint
3. Review the parsed data preview and generated insights
4. Save the dataset as a workspace if needed
5. Click Generate Graph View
6. Adjust graph depth, search nodes, inspect warnings, or export the SVG/report
7. Use Compare JSON to detect breaking changes between two API versions

## Resume bullets

- Built Graph LM Pro, a React + TypeScript developer tool for visualizing and debugging complex JSON/API responses using D3.js interactive graph rendering.
- Implemented JSON upload, raw JSON parsing, API response import, local workspace persistence, node search, adjustable graph depth, SVG export, and Markdown report generation.
- Designed data analysis features including schema inference, TypeScript interface generation, JSON diffing, null-value detection, deep nesting warnings, inconsistent array-shape detection, and object complexity metrics.
- Developed an API version comparison workflow that highlights added fields, removed fields, value changes, type changes, and likely breaking changes in nested data structures.

## Notes

- The graph view is optimized for hierarchical JSON rather than arbitrary graph input.
- Very large JSON payloads can still feel heavy because the visualization is browser-side.
- Saved graph data, display settings, and workspaces are stored in local browser storage.
