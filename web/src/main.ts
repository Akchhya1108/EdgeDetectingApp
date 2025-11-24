/**
 * FlamappAI Web Viewer - WITH REAL OPENCV.JS EDGE DETECTION
 * Performs actual Canny edge detection using OpenCV.js
 */

interface FrameStats {
    width: number;
    height: number;
    fps: number;
    mode: string;
    processingTime: number;
    megapixels?: number;
    estimatedSize?: string;
    type?: string;
}

declare var cv: any; // OpenCV.js global

class EdgeViewer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private statsDiv: HTMLElement;
    private currentStats: FrameStats;
    private animationId: number | null = null;
    private isUploadedFrame: boolean = false;
    private opencvReady: boolean = false;
    private currentImageData: ImageData | null = null;

    constructor() {
        this.canvas = document.getElementById('frameCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.statsDiv = document.getElementById('stats')!;

        this.currentStats = {
            width: 640,
            height: 480,
            fps: 25.0,
            mode: 'Edge Detection',
            processingTime: 15
        };

        this.init();
    }

    private init(): void {
        console.log('🚀 EdgeViewer initializing...');

        // Wait for OpenCV.js to load
        this.waitForOpenCV().then(() => {
            console.log('✅ OpenCV.js loaded successfully!');
            this.opencvReady = true;
            this.setupButtons();
            this.loadSampleFrame();
            this.updateStats();
        }).catch(err => {
            console.error('❌ Failed to load OpenCV.js:', err);
            alert('OpenCV.js failed to load. Edge detection will not work.');
        });
    }

    private waitForOpenCV(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (typeof cv !== 'undefined' && cv.Mat) {
                resolve();
                return;
            }

            let attempts = 0;
            const maxAttempts = 100;

            const checkOpenCV = setInterval(() => {
                attempts++;
                if (typeof cv !== 'undefined' && cv.Mat) {
                    clearInterval(checkOpenCV);
                    resolve();
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkOpenCV);
                    reject(new Error('OpenCV.js load timeout'));
                }
            }, 100);
        });
    }

    private setupButtons(): void {
        const refreshBtn = document.getElementById('refreshBtn');
        const exportBtn = document.getElementById('exportBtn');
        const animateBtn = document.getElementById('animateBtn');
        const uploadInput = document.getElementById('uploadInput') as HTMLInputElement;
        const canvasWrapper = document.querySelector('.canvas-wrapper');
        const modeSelect = document.getElementById('modeSelect') as HTMLSelectElement;

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.reprocessCurrentImage());
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportFrame());
        }

        if (animateBtn) {
            animateBtn.addEventListener('click', () => this.toggleAnimation());
        }

        if (uploadInput) {
            uploadInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }

        if (modeSelect) {
            modeSelect.addEventListener('change', () => this.reprocessCurrentImage());
        }

        // Drag & Drop
        if (canvasWrapper) {
            canvasWrapper.addEventListener('dragover', (e) => {
                e.preventDefault();
                canvasWrapper.classList.add('drag-over');
            });

            canvasWrapper.addEventListener('dragleave', () => {
                canvasWrapper.classList.remove('drag-over');
            });

            canvasWrapper.addEventListener('drop', (e) => {
                e.preventDefault();
                canvasWrapper.classList.remove('drag-over');
                const files = (e as DragEvent).dataTransfer?.files;
                if (files && files.length > 0) {
                    this.handleDroppedFile(files[0]);
                }
            });
        }
    }

    private loadSampleFrame(): void {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            this.canvas.width = img.width;
            this.canvas.height = img.height;
            this.ctx.drawImage(img, 0, 0);
            this.currentImageData = this.ctx.getImageData(0, 0, img.width, img.height);
            this.applyEdgeDetection();
            console.log('✅ Sample frame loaded');
        };

        img.onerror = () => {
            console.log('⚠️ Sample image not found, creating test pattern');
            this.createTestPattern();
        };

        img.src = 'assets/sample_frame.png';
    }

    private createTestPattern(): void {
        this.canvas.width = 640;
        this.canvas.height = 480;

        // Create a test pattern with shapes
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw various shapes for edge detection
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(100, 100, 200, 150);

        this.ctx.beginPath();
        this.ctx.arc(400, 200, 80, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillRect(200, 300, 250, 100);

        // Store the image data
        this.currentImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        // Apply edge detection
        this.applyEdgeDetection();
    }

    private applyEdgeDetection(): void {
        if (!this.opencvReady || !this.currentImageData) {
            console.warn('⚠️ OpenCV not ready or no image data');
            return;
        }

        const startTime = performance.now();
        const modeSelect = document.getElementById('modeSelect') as HTMLSelectElement;
        const mode = modeSelect ? modeSelect.value : 'edges';

        try {
            // Create OpenCV matrices
            const src = cv.matFromImageData(this.currentImageData);
            const dst = new cv.Mat();

            switch (mode) {
                case 'raw':
                    // Just copy the original
                    src.copyTo(dst);
                    this.currentStats.mode = 'Raw';
                    break;

                case 'gray':
                    // Convert to grayscale
                    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
                    cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA);
                    this.currentStats.mode = 'Grayscale';
                    break;

                case 'edges':
                default:
                    // REAL Canny Edge Detection!
                    const gray = new cv.Mat();
                    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

                    // Apply Gaussian blur to reduce noise
                    const blurred = new cv.Mat();
                    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);

                    // Apply Canny edge detection (threshold1=100, threshold2=200)
                    const edges = new cv.Mat();
                    cv.Canny(blurred, edges, 100, 200);

                    // Convert back to RGBA for display
                    cv.cvtColor(edges, dst, cv.COLOR_GRAY2RGBA);

                    // Clean up intermediate matrices
                    gray.delete();
                    blurred.delete();
                    edges.delete();

                    this.currentStats.mode = 'Canny Edge Detection';
                    break;
            }

            // Display the result
            cv.imshow(this.canvas, dst);

            // Clean up
            src.delete();
            dst.delete();

            const processingTime = Math.round(performance.now() - startTime);
            this.currentStats.processingTime = processingTime;
            this.updateStats();

            console.log(`✅ OpenCV processing complete (${processingTime}ms)`);

        } catch (error) {
            console.error('❌ OpenCV processing error:', error);
            alert('Edge detection failed. See console for details.');
        }
    }

    private reprocessCurrentImage(): void {
        if (this.currentImageData) {
            this.applyEdgeDetection();
        } else {
            console.warn('⚠️ No image loaded to reprocess');
        }
    }

    private handleDroppedFile(file: File): void {
        if (!file.type.startsWith('image/')) {
            alert('Please drop an image file (PNG, JPG, etc.)');
            return;
        }
        console.log('📦 Dropped file:', file.name);
        this.processImageFile(file);
    }

    private handleFileUpload(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;
        console.log('📤 Loading file:', file.name);
        this.processImageFile(file);
    }

    private processImageFile(file: File): void {
        this.isUploadedFrame = true;

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataURL = e.target?.result as string;
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = () => {
                const width = img.width;
                const height = img.height;
                const megapixels = (width * height) / 1000000;
                const estimatedRgbaSize = width * height * 4;
                const sizeKB = Math.round(estimatedRgbaSize / 1024);

                this.currentStats = {
                    width: width,
                    height: height,
                    fps: 0,
                    mode: 'Processing...',
                    processingTime: 0,
                    megapixels: megapixels,
                    estimatedSize: `~${sizeKB} KB`,
                    type: 'Uploaded'
                };

                // Draw original image
                this.canvas.width = width;
                this.canvas.height = height;
                this.ctx.drawImage(img, 0, 0);

                // Store image data
                this.currentImageData = this.ctx.getImageData(0, 0, width, height);

                // Apply edge detection
                this.applyEdgeDetection();

                console.log(`✅ Image loaded: ${width}x${height} (${megapixels.toFixed(2)} MP)`);
            };

            img.onerror = () => {
                console.error('❌ Failed to load uploaded image');
                alert('Failed to load image. Please try again.');
            };

            img.src = dataURL;
        };

        reader.onerror = () => {
            console.error('❌ FileReader error');
            alert('Failed to read file. Please try again.');
        };

        reader.readAsDataURL(file);
    }

    private exportFrame(): void {
        const dataURL = this.canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `edge_frame_${Date.now()}.png`;
        link.href = dataURL;
        link.click();
        console.log('💾 Frame exported');
    }

    private toggleAnimation(): void {
        const btn = document.getElementById('animateBtn');
        if (this.animationId !== null) {
            this.animationId = null;
            if (btn) btn.textContent = '▶ Animate';
            console.log('⏸ Animation stopped');
        } else {
            if (btn) btn.textContent = '⏸ Stop';
            this.animationId = 1;
            console.log('▶ Animation started');
            this.animate();
        }
    }

    private animate(): void {
        if (this.animationId === null) return;

        // Cycle through different threshold values
        this.reprocessCurrentImage();

        setTimeout(() => {
            if (this.animationId !== null) {
                this.animate();
            }
        }, 500);
    }

    private updateStats(): void {
        let html = '';

        if (this.isUploadedFrame && this.currentStats.type === 'Uploaded') {
            html = `
                <div class="stat-item">
                    <span class="stat-label">Resolution:</span>
                    <span class="stat-value">${this.currentStats.width}x${this.currentStats.height}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Megapixels:</span>
                    <span class="stat-value">${this.currentStats.megapixels?.toFixed(2)} MP</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Mode:</span>
                    <span class="stat-value">${this.currentStats.mode}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Processing Time:</span>
                    <span class="stat-value">${this.currentStats.processingTime}ms</span>
                </div>
            `;
        } else {
            html = `
                <div class="stat-item">
                    <span class="stat-label">Resolution:</span>
                    <span class="stat-value">${this.currentStats.width}x${this.currentStats.height}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Mode:</span>
                    <span class="stat-value">${this.currentStats.mode}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Processing Time:</span>
                    <span class="stat-value">${this.currentStats.processingTime}ms</span>
                </div>
            `;
        }

        this.statsDiv.innerHTML = html;
    }

    // Public API methods
    public updateFrame(imageData: string, stats: FrameStats): void {
        this.isUploadedFrame = false;
        this.currentStats = stats;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            this.canvas.width = img.width;
            this.canvas.height = img.height;
            this.ctx.drawImage(img, 0, 0);
            this.currentImageData = this.ctx.getImageData(0, 0, img.width, img.height);
            this.applyEdgeDetection();
            console.log('✅ Frame updated from external source');
        };
        img.onerror = () => {
            console.error('❌ Failed to load image');
        };
        img.src = imageData;
    }

    public updateFromBase64(base64: string, stats?: Partial<FrameStats>): void {
        const dataURL = base64.startsWith('data:') ? base64 : `data:image/png;base64,${base64}`;
        if (stats) {
            this.currentStats = { ...this.currentStats, ...stats };
        }
        this.updateFrame(dataURL, this.currentStats);
    }
}

// Initialize viewer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 FlamappAI Web Viewer Starting...');
    const viewer = new EdgeViewer();
    (window as any).edgeViewer = viewer;
    console.log('✅ Viewer ready! Waiting for OpenCV.js...');
});