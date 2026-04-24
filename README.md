# Graph LM

Graph LM is a React + TypeScript app for exploring JSON as an interactive graph. It is built with Create React App, D3, and React Router.

## What it does

- Upload JSON files or paste raw JSON directly into the app
- Persist the current dataset across refreshes
- Explore JSON as a network graph with adjustable depth
- Search nodes inside the graph
- View quick structure and content metrics
- Download the current visualization as SVG
- Toggle display settings such as theme, node values, and auto-collapse

## Tech stack

- React 19
- TypeScript
- D3.js
- React Router
- Create React App (`react-scripts`)

## Getting started

### Prerequisites

- Node.js 18+ recommended
- npm

### Install

```bash
npm install
```

### Start the app

```bash
npm start
```

The development server runs at [http://localhost:3000](http://localhost:3000).

### Run tests

```bash
npm test
```

For a one-shot CI-style run:

```bash
CI=true npm test -- --watchAll=false
```

### Build for production

```bash
npm run build
```

## App flow

1. Open the `Data Editor`
2. Upload a `.json` file or paste JSON manually
3. Review the parsed data preview
4. Click `Generate Graph View`
5. Adjust graph depth, search nodes, or export the SVG

## Project structure

```text
src/
├── components/
│   ├── D3Visualization.tsx
│   ├── DataInsights.tsx
│   └── Navbar.tsx
├── pages/
│   ├── Home.tsx
│   ├── JsonDataPage.tsx
│   └── TreeVisualizationPage.tsx
└── utils/
    └── storage.ts
```

## Notes

- The graph view is optimized for hierarchical JSON rather than arbitrary graph input.
- Very large JSON payloads can still feel heavy because the visualization is browser-side.
- Saved graph data and display settings are stored in local browser storage.
