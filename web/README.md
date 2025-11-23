\# 🌐 FlamappAI Web Viewer



TypeScript-based web viewer for displaying edge-detected frames from the FlamappAI Android application.



\## 🚀 Quick Start



\### Prerequisites

\- Node.js (v14 or higher)

\- npm



\### Installation

```bash

cd web

npm install

```



\### Build

```bash

npm run build

```



This compiles TypeScript files from `src/` to `dist/`.



\### Run

```bash

npm run serve

```



Then open: \*\*http://localhost:3000\*\*



\## 📂 Project Structure

```

web/

├── src/

│   └── main.ts          # Main TypeScript application

├── dist/

│   └── main.js          # Compiled JavaScript

├── assets/              # Sample images

├── index.html           # Main HTML page

├── styles.css           # Styling

├── package.json         # npm configuration

├── tsconfig.json        # TypeScript configuration

└── README.md            # This file

```



\## ✨ Features



\### Display Capabilities

\- 📸 Canvas-based frame rendering

\- 📊 Real-time statistics display (Resolution, FPS, Mode, Processing Time)

\- 🎨 Beautiful gradient UI design



\### Interactive Controls

\- \*\*🔄 Generate New Sample\*\* - Creates random edge detection patterns

\- \*\*▶ Animate\*\* - Auto-generates samples at 10 FPS

\- \*\*💾 Export Frame\*\* - Downloads current frame as PNG



\### Integration Methods



\#### Method 1: Base64 String

```javascript

edgeViewer.updateFromBase64("YOUR\_BASE64\_STRING", {

&nbsp;   width: 640,

&nbsp;   height: 480,

&nbsp;   fps: 25.0,

&nbsp;   mode: "Edge Detection",

&nbsp;   processingTime: 15

});

```



\#### Method 2: Image URL

```javascript

edgeViewer.updateFrame("path/to/image.png", {

&nbsp;   width: 640,

&nbsp;   height: 480,

&nbsp;   fps: 25.0,

&nbsp;   mode: "Grayscale",

&nbsp;   processingTime: 12

});

```



\## 🛠️ Tech Stack



\- TypeScript 5.3+

\- HTML5 Canvas API

\- CSS3 with gradients

\- Vanilla JavaScript (no frameworks)

\- Node.js built-in HTTP server



\## 📄 License



Part of FlamappAI EdgeViewer R\&D Assessment Project

