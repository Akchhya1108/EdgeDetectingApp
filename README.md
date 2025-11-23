🔬 FlamappAI EdgeViewer
Real-Time Edge Detection with Android + OpenCV C++ + OpenGL ES 2.0
R&D Intern Assessment 2025 - A complete Android edge detection application with real-time camera processing, native C++ integration, and a TypeScript web viewer.

✨ Features
🤖 Android Application

✅ Real-time camera capture using Camera2 API
✅ Native C++ processing via JNI/NDK for optimal performance
✅ OpenCV edge detection using Canny algorithm
✅ OpenGL ES 2.0 rendering for GPU-accelerated display
✅ 3 processing modes:

Raw: Original camera feed
Grayscale: Black and white conversion
Edge Detection: Canny edge detection with white edges on black background


✅ Live performance metrics - FPS counter and processing time display
✅ Automatic camera rotation handling for proper orientation
✅ Smooth 20-30 FPS performance on modern devices

🌐 Web Viewer (TypeScript)

✅ Upload Android frames via three methods:

Click upload button
Drag & drop onto canvas
File picker dialog


✅ Dynamic stats calculation:

For uploaded images: Resolution, Megapixels, Type, Estimated Size
For simulated frames: Resolution, FPS, Mode, Processing Time


✅ Sample generation with realistic edge detection patterns
✅ Animation mode for continuous frame updates (10 FPS)
✅ Frame export as PNG files
✅ Beautiful gradient UI with smooth animations
✅ Responsive design for mobile and desktop

🏗️ Architecture
System Flow Diagram

┌─────────────────────────────────────────────────────────────────┐
│                        ANDROID DEVICE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐                                            │
│  │  Android Camera │                                            │
│  │   (Camera2 API) │                                            │
│  └────────┬────────┘                                            │
│           │ YUV_420_888 frames (640x480)                        │
│           ▼                                                     │
│  ┌─────────────────┐                                            │
│  │  CameraController│                                           │
│  │  • Frame capture │                                           │
│  │  • YUV→RGBA conv │                                           │
│  │  • Rotation fix  │                                           │
│  └────────┬────────┘                                            │
│           │ RGBA ByteArray                                      │
│           ▼                                                     │
│  ┌─────────────────┐                                            │
│  │   JNI Bridge    │                                            │
│  │  NativeProcessor│                                            │
│  └────────┬────────┘                                            │
│           │                                                     │
├───────────┼─────────────────────────────────────────────────────┤
│   JAVA    │    NATIVE C++                                       │
├───────────┼─────────────────────────────────────────────────────┤
│           ▼                                                     │
│  ┌─────────────────────────────────────────┐                    │
│  │     OpenCV C++ Processing Pipeline      │                    │
│  │  ┌────────────────────────────────────┐ │                    │
│  │  │  1. Copy RGBA → cv::Mat (CV_8UC4)  │ │                    │
│  │  └──────────────┬─────────────────────┘ │                    │
│  │                 ▼                       │                    │
│  │  ┌────────────────────────────────────┐ │                    │
│  │  │  2. Convert to Grayscale           │ │                    │
│  │  │     cvtColor(RGBA2GRAY)            │ │                    │
│  │  └──────────────┬─────────────────────┘ │                    │
│  │                 ▼                       │                    │
│  │  ┌────────────────────────────────────┐ │                    │
│  │  │  3. Mode Selection:                │ │                    │
│  │  │     Mode 0: Return original        │ │                    │
│  │  │     Mode 1: Gray → RGBA            │ │                    │
│  │  │     Mode 2: Canny(100,200) → RGBA  │ │                    │
│  │  └──────────────┬─────────────────────┘ │                    │
│  │                 ▼                       │                    │
│  │  ┌────────────────────────────────────┐ │                    │
│  │  │  4. Copy output to buffer          │ │                    │
│  │  └────────────────────────────────────┘ │                    │
│  └─────────────────────────────────────────┘                    │
│           │ Processed RGBA ByteArray                            │
│           ▼                                                     │
│  ┌───────────────── ┐                                           │
│  │  GLTextureView   │                                           │
│  │  OpenGL ES 2.0   │                                           │
│  │  • Upload texture│                                           │
│  │  • Render quad   │                                           │
│  └────────┬────────┘                                            │
│           │                                                     │
│           ▼                                                     │
│  ┌─────────────────┐                                            │
│  │  Screen Display │                                            │
│  │  20-30 FPS      │                                            │
│  └─────────────────┘                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

Data Flow

Camera Capture → Camera2 API captures YUV_420_888 frames
Format Conversion → Convert YUV to NV21, compress to JPEG, decode to Bitmap, extract RGBA
Rotation Fix → Apply sensor orientation matrix to correct image rotation
JNI Call → Send RGBA byte array to native C++ via nativeProcessFrameRgba()
OpenCV Processing → Apply grayscale conversion and/or Canny edge detection
In-place Modification → Processed data written back to same byte array
OpenGL Upload → Upload RGBA texture to GPU via glTexImage2D()
Render → Draw textured quad using vertex/fragment shaders
Display → Present frame to screen at 20-30 FPS

📂 Project Structure

FlamappAI-EdgeViewer/
│
├── app/                                    # Android application module
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/flamappai/
│   │   │   │   ├── MainActivity.kt              # Main activity with UI controls
│   │   │   │   ├── camera/
│   │   │   │   │   └── CameraController.kt      # Camera2 API implementation
│   │   │   │   ├── gl/
│   │   │   │   │   ├── GLTextureView.kt         # OpenGL ES 2.0 renderer
│   │   │   │   │   └── shaders/
│   │   │   │   │       ├── textured_quad.vert   # Vertex shader (GLSL)
│   │   │   │   │       └── textured_quad.frag   # Fragment shader (GLSL)
│   │   │   │   └── nativebridge/
│   │   │   │       └── NativeProcessor.kt       # JNI bridge interface
│   │   │   ├── cpp/
│   │   │   │   └── CMakeLists.txt               # CMake build configuration
│   │   │   ├── res/
│   │   │   │   └── layout/
│   │   │   │       └── activity_main.xml        # UI layout
│   │   │   └── AndroidManifest.xml              # App manifest
│   │   ├── androidTest/                         # Instrumented tests
│   │   └── test/                                # Unit tests
│   ├── build.gradle.kts                         # Module Gradle config
│   └── proguard-rules.pro                       # ProGuard rules
│
├── jni/                                    # Native C++ source code
│   ├── native_processor.cpp                     # JNI entry points
│   ├── opencv_processor.cpp                     # OpenCV processing logic
│   ├── opencv_processor.hpp                     # Processing header file
│   └── jni_utils.hpp                            # Logging and utility macros
│
├── web/                                    # TypeScript web viewer
│   ├── src/
│   │   └── main.ts                              # Main TypeScript application
│   ├── dist/
│   │   └── main.js                              # Compiled JavaScript (generated)
│   ├── assets/
│   │   └── sample_frame.png                     # Sample edge detection image
│   ├── index.html                               # Main HTML page
│   ├── styles.css                               # CSS styling with gradients
│   ├── package.json                             # npm dependencies
│   ├── tsconfig.json                            # TypeScript compiler config
│   └── README.md                                # Web viewer documentation
│
├── docs/                                   # Documentation assets
│   └── screenshots/
│       ├── app_raw_mode.jpg                     # Android app raw mode
│       ├── app_gray_mode.jpg                    # Android app grayscale
│       ├── app_edge_mode.jpg                    # Android app edge detection
│       ├── web_viewer_main.png                  # Web dashboard
│       └── web_viewer_uploaded.png              # Web with uploaded frame
│
├── gradle/                                 # Gradle wrapper files
├── .gitignore                              # Git ignore rules
├── build.gradle.kts                        # Root Gradle configuration
├── settings.gradle.kts                     # Gradle settings
├── README.md                               # This file
└── SUBMISSION.md                           # Evaluation summary

🚀 Setup Instructions
Prerequisites
For Android Development:

Android Studio: Hedgehog (2023.1.1) or later
Android SDK: API Level 24+ (Android 7.0)
Android NDK: r21 or later
CMake: Version 3.22.1 or higher
OpenCV Android SDK: Version 4.12.0 (Download here)
Physical Android device (recommended) - Emulator may have camera/performance issues
USB debugging enabled on device

For Web Viewer:

Node.js: v14.0.0 or higher (Download)
npm: v6.0.0 or higher (comes with Node.js)
Modern web browser: Chrome 90+, Firefox 88+, Edge 90+

📱 Android App Setup
Step 1: Clone the Repository
bashgit clone https://github.com/Akchhya1108/EdgeDetectingApp.git
cd EdgeDetectingApp
Step 2: Install OpenCV Android SDK

Download OpenCV:

Visit: https://opencv.org/releases/
Download: opencv-4.12.0-android-sdk.zip

Extract to specific location:

C:\Android\OpenCV\opencv-4.12.0-android-sdk\OpenCV-android-sdk\
Note: Path must match exactly!

Update CMakeLists.txt (if different path):

Open: app/src/main/cpp/CMakeLists.txt
Line 17: Update OPENCV_ANDROID_SDK_ROOT to your path

cmake   set(OPENCV_ANDROID_SDK_ROOT "C:/Android/OpenCV/opencv-4.12.0-android-sdk/OpenCV-android-sdk")
Step 3: Open Project in Android Studio

Launch Android Studio
File → Open → Select FlamappAI-EdgeViewer folder
Wait for Gradle Sync to complete (may take 2-5 minutes)
If prompted, update Gradle plugin

Step 4: Install Required SDK Components

Tools → SDK Manager
SDK Platforms tab:

✅ Android 7.0 (API 24)
✅ Android 14.0 (API 34) - recommended

SDK Tools tab:

✅ NDK (Side by side)
✅ CMake
✅ Android SDK Build-Tools 34.0.0

Step 5: Configure Device

Enable Developer Options on Android device:

Settings → About Phone → Tap "Build Number" 7 times
Enable USB Debugging:
Settings → Developer Options → USB Debugging → ON
Connect device via USB cable
Allow USB debugging when prompted on device

Step 6: Build and Run

In Android Studio, click Build → Rebuild Project
Wait for build to complete (~2-3 minutes first time)
Click Run ▶️ (green play button)
Select your connected device
Grant camera permission when app launches
App should start with live camera feed!

Web Viewer Features:

📤 Upload Android Frame (3 methods):

Click "Upload Android Frame" button
Drag & drop image onto canvas
Will show: Resolution, Megapixels, Type, Est. Size

🔄 Generate New Sample:

Creates simulated edge detection patterns
Shows: Resolution, FPS, Mode, Processing Time

▶ Animate:

Auto-generates frames at 10 FPS
Click again to stop

💾 Export Frame:

Downloads current canvas as PNG
Filename: edge_frame_[timestamp].png

📄 License
This project is for educational and demonstration purposes.

👨‍💻 Author
This project demonstrates practical real-time computer vision on Android with native code integration and web-based validation.

🤝 Contributing
Contributions are welcome! Please follow these guidelines:

✅ Checklist
Android app with Camera2 integration
Native C++ OpenCV processing
OpenGL ES rendering
Mode switching (Raw/Gray/Edges)
FPS counter and performance metrics
TypeScript web viewer
Complete documentation
Screenshots and demos
Clean architecture with separation of concerns
Error handling and graceful degradation

Built with ❤️ using Android NDK, OpenCV, OpenGL ES, and TypeScript
~Akchhya



