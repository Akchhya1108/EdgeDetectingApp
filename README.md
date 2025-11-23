# EdgeDetectingApp

Real-time edge detection demo application — Android app (Camera2 + native C++ OpenCV + OpenGL ES) plus a TypeScript web viewer for inspecting and exporting frames.

This repository contains:
- An Android application that captures camera frames, processes them with native C++ (OpenCV) using JNI/NDK, and renders with OpenGL ES 2.0.
- A small TypeScript web viewer (web/) to upload, preview, animate, and export processed frames from the Android app.

Why this project
- Demonstrates high-performance image processing on Android using native C++ + OpenCV.
- Shows an integration pattern (Camera2 → JNI → OpenCV → OpenGL) with performance metrics (FPS, processing time).
- Contains a lightweight web UI for visual debugging, export, and stats.

Table of contents
- Features
- Architecture (high level)
- Project layout
- Prerequisites
- Android: build & run
- Web viewer: build & run
- Configuration and common issues
- Contributing
- License & contact

Features
- Android
  - Real-time camera capture using Camera2 API
  - Native processing in C++ via JNI/NDK for performance
  - OpenCV Canny-based edge detection + grayscale + raw modes
  - OpenGL ES 2.0 texture upload and rendering
  - FPS counter and processing time measurement
  - Automatic device rotation handling
- Web viewer
  - Upload frames (button, drag & drop, file picker)
  - Simulate/generate edge-detected frames
  - Animate frames (e.g., 10 FPS)
  - Export canvas frames as PNG
  - Display dynamic stats: resolution, megapixels, mode, processing time

Architecture (summary)
- Camera2 produces YUV_420_888 frames on Android.
- Java/Kotlin code converts to RGBA byte buffer and passes it into native C++ via JNI.
- Native code (OpenCV) processes in-place:
  - Mode 0 — Raw (pass-through)
  - Mode 1 — Grayscale (displayed as RGBA)
  - Mode 2 — Canny edge detection (white edges on black background)
- Processed RGBA buffer is uploaded as a GL texture and rendered using OpenGL ES on a textured quad.

Project layout
- app/ — Android application module (Kotlin + native C++ under app/src/main/cpp or jni/)
- jni/ — Native C++ sources (JNI entry points and OpenCV-based processors)
- web/ — TypeScript web viewer (src/, dist/, index.html, styles.css)
- docs/ — screenshots and supporting documentation
- README.md — this file
- SUBMISSION.md — project submission / evaluation notes

Prerequisites

Android
- Android Studio 2023.1+ (Hedgehog) recommended
- Android SDK (API 24+)
- Android NDK (r21 or later recommended)
- CMake (3.22+ preferred)
- OpenCV Android SDK (tested with OpenCV 4.12.0)
- A physical Android device is recommended for performance and camera support

Web
- Node.js v14+ (or latest LTS)
- npm v6+ (or latest bundled with Node)

Android — Build & Run

1. Clone
   git clone https://github.com/Akchhya1108/EdgeDetectingApp.git
   cd EdgeDetectingApp

2. Install/OpenCV SDK
   - Download the OpenCV Android SDK (e.g., opencv-4.12.0-android-sdk.zip) from https://opencv.org/releases/
   - Extract somewhere convenient (e.g., /home/<user>/android/opencv-4.12.0-android-sdk)
   - Note: avoid hard-coding an absolute path in the repo; instead, update CMakeLists.txt to match your environment.

3. Configure native build (if needed)
   - Open app/src/main/cpp/CMakeLists.txt (or app/CMakeLists.txt) and set OPENCV_ANDROID_SDK_ROOT or the path expected by the CMake configuration to point to your extracted OpenCV SDK location.

   Example:
   set(OPENCV_ANDROID_SDK_ROOT "/home/<user>/android/opencv-4.12.0-android-sdk/OpenCV-android-sdk")

4. Open the project in Android Studio
   - File → Open → select repository root
   - Let Gradle/Android Studio sync (may download NDK/CMake if missing)
   - Install missing SDK components if prompted

5. Build & Run
   - Connect a physical device and enable USB debugging
   - In Android Studio: Run → Select device → Grant camera permissions at runtime when the app launches
   - The app should start and show live camera feed with selectable modes (Raw/Gray/Edges)

Notes & tips
- Emulator camera and performance are not reliable for native/NDK+OpenCV processing; use a real device.
- If native compilation fails, ensure NDK and CMake versions match the project's Gradle setup.
- If OpenCV include/link errors occur, confirm the OPENCV_ANDROID_SDK_ROOT path and CMake configuration.

Web viewer — Build & Run

1. Change into the web directory
   cd web

2. Install dependencies
   npm install

3. Build
   npm run build
   - This compiles TypeScript from src/ → dist/

4. Serve (for development)
   npm run serve
   - Open http://localhost:3000 (or port printed in console)

Integration with the Android app
- The web viewer supports:
  - Uploading PNG/JPEG images from Android (via adb push, a simple HTTP upload, or manual transfer)
  - Programmatic updates via base64 strings or image URLs (see web/README.md)
- The web viewer README documents usage examples for:
  - edgeViewer.updateFromBase64(base64, metadata)
  - edgeViewer.updateFrame(url, metadata)

Common configuration problems & troubleshooting
- "OpenCV headers not found" — Check OPENCV_ANDROID_SDK_ROOT and ensure Android Studio is pointing to the right CMake/NDK.
- "JNI symbol not found" — Confirm native methods signatures match Java/Kotlin declarations and verify ABI filters (arm64-v8a/armeabi-v7a).
- Low FPS — try building with Release config (optimization), reduce preview resolution or skip some processing.
- Wrong orientation — ensure device rotation matrix is applied before handing data to native code.

Contributing
- Contributions welcome. Suggested workflow:
  - Fork the repository
  - Create a branch: git checkout -b feat/your-feature
  - Implement and test on device
  - Open a pull request describing the change and testing steps
- Please include platform/NDK/CMake versions in PR descriptions for native changes.

License
- This project is provided for educational and demonstration purposes.

Acknowledgements
- OpenCV project — computer vision library
- Android Camera2 / NDK / OpenGL documentation and samples

Author
- Akchhya (Akchhya1108) — demonstrates real-time CV integration on Android

Screenshots & demos

