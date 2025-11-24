# FlamappAI-EdgeViewer

A real-time Android edge detection application using OpenCV C++, OpenGL ES 2.0, and TypeScript web viewer.

## 📱 Features

### 🎯 Core Functionality

- **🔍 Real-time Edge Detection** - Canny edge detection at 20-30 FPS
- **⚡ Native C++ Processing** - OpenCV via JNI for optimal performance
- **🎨 OpenGL ES 2.0 Rendering** - Hardware-accelerated texture display
- **⚫ Three Processing Modes** - Raw, Grayscale, and Edge Detection
- **🌐 Web Viewer** - TypeScript viewer with real OpenCV.js processing

### 🎨 User Experience

- **🖼️ Real-time Preview** - Live camera feed with instant processing
- **📊 Performance Metrics** - FPS counter and processing time display
- **🔄 Mode Switching** - Seamless toggling between processing modes
- **📤 Web Integration** - View and process images in browser

### 🛠️ Technical Capabilities

- **📷 Camera2 API** - Modern Android camera integration
- **🔧 JNI Bridge** - Efficient Java ↔ C++ communication
- **⚡ Optimized Pipeline** - Zero-copy frame processing where possible
- **🌐 Cross-platform** - Android native + Web viewer

## 🎥 Demo

![Demo GIF](docs/Demo_gif/Demo_gif2.gif)

## 📸 Android App Screenshots

### Real-time Edge Detection Modes

<table>
  <tr>
    <td><img src="docs/screenshots/App_SS/app_edge_mode_1.jpeg" width="250"/></td>
    <td><img src="docs/screenshots/App_SS/app_edge_mode_2.jpeg" width="250"/></td>
    <td><img src="docs/screenshots/App_SS/app_edge_mode_3.jpeg" width="250"/></td>
  </tr>
  <tr>
    <td align="center"><strong>Edge Mode - Low Threshold</strong><br/>Detects more edges with lower sensitivity</td>
    <td align="center"><strong>Edge Mode - Medium Threshold</strong><br/>Balanced edge detection (default)</td>
    <td align="center"><strong>Edge Mode - High Threshold</strong><br/>Only strong edges detected</td>
  </tr>
</table>

### Processing Mode Comparison

<table>
  <tr>
    <td><img src="docs/screenshots/App_SS/app_edges_mode.jpeg" width="250"/></td>
    <td><img src="docs/screenshots/App_SS/app_grey_mode.jpeg" width="250"/></td>
    <td><img src="docs/screenshots/App_SS/app_raw_mode.jpeg" width="250"/></td>
  </tr>
  <tr>
    <td align="center"><strong>Canny Edge Detection</strong><br/>White edges on black background</td>
    <td align="center"><strong>Grayscale Mode</strong><br/>Color to grayscale conversion</td>
    <td align="center"><strong>Raw Camera Feed</strong><br/>Unprocessed original frames</td>
  </tr>
</table>

**Performance:** Achieves 20-30 FPS on mid-range devices with 10-20ms processing time per frame.

---

## 🌐 Web Viewer

TypeScript-based web viewer with **real OpenCV.js** implementation for client-side edge detection.

### Web Viewer Interface

<div align="center">
  <img src="docs/screenshots/WebViewer/web_viewer_main_1.png" width="700"/>
  <p><em>Main interface with real-time OpenCV.js processing and statistics</em></p>
</div>

<div align="center">
  <img src="docs/screenshots/WebViewer/web_viewer_main_2.png" width="700"/>
  <p><em>Uploaded image with edge detection applied - showing actual processing time</em></p>
</div>

### Web Viewer - Processing Examples

<table>
  <tr>
    <td><img src="docs/screenshots/WebViewer/ex_edge.png" width="280"/></td>
    <td><img src="docs/screenshots/WebViewer/ex_grey.png" width="280"/></td>
    <td><img src="docs/screenshots/WebViewer/ex_raw.png" width="280"/></td>
  </tr>
  <tr>
    <td align="center"><strong>Canny Edge Detection</strong><br/>Real OpenCV.js processing with Gaussian blur</td>
    <td align="center"><strong>Grayscale Conversion</strong><br/>RGBA to grayscale transformation</td>
    <td align="center"><strong>Original Image</strong><br/>No processing applied</td>
  </tr>
</table>

### Web Viewer - Upload Workflow

<table>
  <tr>
    <td><img src="docs/screenshots/WebViewer/uploaded_edge_mode.png" width="350"/></td>
    <td><img src="docs/screenshots/WebViewer/uploaded_grey_mode.png" width="350"/></td>
  </tr>
  <tr>
    <td align="center"><strong>User Upload - Edge Detection</strong></td>
    <td align="center"><strong>User Upload - Grayscale</strong></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/WebViewer/uploaded_raw.png" width="350"/></td>
    <td></td>
  </tr>
  <tr>
    <td align="center"><strong>User Upload - Raw Mode</strong></td>
    <td></td>
  </tr>
</table>

### 🔬 Web Viewer Features

- ✅ **Real OpenCV.js** - Actual Canny edge detection (not simulated)
- 📤 **Drag & Drop** - Easy image upload with visual feedback
- 🎯 **Three Modes** - Raw, Grayscale, Edge Detection
- ⚡ **Performance Stats** - Real processing time metrics
- 💾 **Export** - Download processed images as PNG

---

🛠️ Tech Stack

Language: Kotlin
Build System: Gradle
Platform: Android

🚀 Getting Started
📋 Prerequisites

Android Studio Arctic Fox or later
Android SDK (API level 21+)
Kotlin plugin
JDK 11 or higher
Gradle 7.0+

⚙️ Requirements

Minimum SDK: API 21 (Android 5.0 Lollipop)
Target SDK: API 34 (Android 14)
Compile SDK: API 34
Minimum RAM: 2GB
Recommended RAM: 4GB or higher
Storage: 50MB for app installation
Permissions Required:

Camera access (for real-time processing)
Storage access (for saving processed images)
Internet access (for WebViewer features)



🔧 Installation

Clone the repository

bashgit clone https://github.com/Akchhya1108/EdgeDetectingApp.git

Open the project in Android Studio
Build the project

bash./gradlew build

Run on your device or emulator

📂 Project Structure

```text
EdgeDetectingApp/
├── .github/
│   └── workflows/
│       └── ci.yml
├── android-app/                 # Kotlin Android application
│   ├── app/
│   │   ├── src/
│   │   │   └── main/
│   │   │       ├── java/com/akchhya/edgedetect/
│   │   │       │   ├── MainActivity.kt
│   │   │       │   ├── CameraProcessor.kt
│   │   │       │   └── EdgeViewModel.kt
│   │   │       ├── res/
│   │   │       │   ├── layout/
│   │   │       │   │   └── activity_main.xml
│   │   │       │   └── values/
│   │   │       │       └── strings.xml
│   │   │       └── AndroidManifest.xml
│   │   └── build.gradle.kts
│   └── settings.gradle.kts
├── web/                         # TypeScript + HTML/CSS front-end
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── index.tsx
│   │   ├── App.tsx
│   │   ├── styles/
│   │   │   └── main.css
│   │   └── components/
│   │       ├── ImageUploader.tsx
│   │       └── EdgePreview.tsx
│   ├── package.json
│   └── tsconfig.json
├── native/                      # C++ native library (built with CMake)
│   ├── CMakeLists.txt
│   ├── include/
│   │   └── edge_detector.h
│   └── src/
│       ├── edge_detector.cpp
│       ├── image_utils.cpp
│       └── bindings.cpp         # JNI / interop bindings (if any)
├── shaders/                     # GLSL shaders used by native or GPU pipeline
│   └── edge_shader.glsl
├── cmake/                       # CMake helper scripts (optional)
│   └── toolchain.cmake
├── scripts/
│   ├── build_native.sh
│   └── run_web.sh
├── docs/
│   └── architecture.md
├── examples/
│   └── sample_images/
│       └── test1.jpg
├── .gitignore
├── LICENSE
└── README.md
```

🤝 Contributing
Contributions welcome! Please:

Fork the repository
Create feature branch (git checkout -b feature/YourFeature)
Commit changes (git commit -m 'Add YourFeature')
Push to branch (git push origin feature/YourFeature)
Open Pull Request

👨‍💻 Author
Akchhya

GitHub: @Akchhya1108
Repository: FlamappAI-EdgeViewer


🙏 Acknowledgments

OpenCV - Computer vision library (opencv.org)
Android CameraX - Modern camera integration
OpenCV.js - WebAssembly-compiled OpenCV for browsers
OpenGL ES - Hardware-accelerated graphics rendering

⭐ Star this repo if you find it useful!

FlamappAI EdgeViewer - Real-time Edge Detection | R&D Intern Assessment 2025