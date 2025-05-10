# Graph LM 🚀

Transform your JSON data into beautiful, interactive visualizations! 

Graph LM is a React-based tool that helps you understand complex data structures through network graphs and tree views. Whether you're debugging API responses, exploring database schemas, or just trying to make sense of nested data - we've got you covered!

## ✨ Features

- 📁 **Drag & Drop Upload** - Just drop your JSON file and watch the magic happen
- 🌳 **Multiple Visualization Modes** - Network graphs, tree views, and more
- 🔍 **Smart Search** - Find any node in your data instantly
- 🎨 **Dark/Light Themes** - Easy on the eyes, day or night
- 📊 **Data Insights** - Get instant metrics about your data structure
- 🚀 **Lightning Fast** - Built with performance in mind

## 🛠️ Tech Stack

- **React 18** - Because we love hooks
- **TypeScript** - For that sweet, sweet type safety
- **D3.js** - The visualization powerhouse
- **MUI** - Material UI components for a polished look
- **Vite** - Blazing fast build tool
- **React Router** - Smooth navigation between views

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js (v16+) installed on your machine.

### Installation

1. Clone this bad boy:
```bash
git clone https://github.com/Genny-oo/Graph_UI-Project.git
cd Graph_UI-Project
```

2. Install dependencies:
```bash
npm install
```

3. Fire it up:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) and start visualizing!

## 🎯 How to Use

1. **Upload Your Data**
   - Hit the "Data Editor" tab
   - Drag & drop your JSON file (or use our sample data)
   
2. **Visualize**
   - Click "Generate Graph View"
   - Use the controls to explore your data
   - Search for specific nodes
   - Adjust the visualization depth

3. **Customize**
   - Toggle dark/light mode
   - Show/hide node values
   - Auto-collapse large structures

## 📦 What's Inside?

```
src/
├── components/          # All the React magic
│   ├── D3Visualization.tsx    # The star of the show
│   ├── DataInsights.tsx       # Smart data analysis
│   └── JsonUpload.tsx         # Drag & drop goodness
├── pages/              # Main app pages
└── App.tsx            # Where it all comes together
```

## 🤔 Why These Libraries?

- **D3.js** - When you need full control over your visualizations, D3 is the way to go. Chart.js is cool, but D3 lets us create those custom network graphs that make data exploration actually fun.

- **MUI TreeView** - Why reinvent the wheel? MUI's tree component is battle-tested and accessible out of the box.

- **React Feather** - Beautiful icons that don't bloat your bundle. FontAwesome is great, but Feather keeps things light and clean.

- **Vite** - Create React App is so 2020. Vite gives us instant hot reload and faster builds.

## 🔧 Building for Production

```bash
npm run build
```

Your production-ready app will be in the `dist` folder, ready to deploy!

## 🐛 Known Issues

- Large JSON files (>10MB) might cause performance hiccups
- Some complex circular references might not render correctly
- The search feature is case-sensitive (feature or bug? you decide!)

## 🤝 Contributing

Found a bug? Want to add a cool feature? PRs are welcome!

1. Fork it
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT - Use it, modify it, share it. Just don't blame me if something breaks! 😄



Made with ☕ and 💻 by Genny
