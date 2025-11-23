/**
 * FlamappAI Web Viewer - Enhanced with Upload Stats
 * Displays processed edge detection frames from Android app
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

class EdgeViewer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private statsDiv: HTMLElement;
    private currentStats: FrameStats;
    private animationId: number | null = null;
    private isUploadedFrame: boolean = false;

    constructor() {
        this.canvas = document.getElementById('frameCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.statsDiv = document.getElementById('stats')!;

        // Default stats for simulated frames
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
        console.log('🚀 EdgeViewer initialized');
        this.setupButtons();
        this.loadSampleFrame();
        this.updateStats();
    }

    private setupButtons(): void {
        const refreshBtn = document.getElementById('refreshBtn');
        const exportBtn = document.getElementById('exportBtn');
        const animateBtn = document.getElementById('animateBtn');
        const uploadInput = document.getElementById('uploadInput') as HTMLInputElement;
        const canvasWrapper = document.querySelector('.canvas-wrapper');

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.generateNewSample());
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

        // Drag & Drop support
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

    private handleDroppedFile(file: File): void {
        if (!file.type.startsWith('image/')) {
            alert('Please drop an image file (PNG, JPG, etc.)');
            return;
        }

        console.log('📦 Dropped file:', file.name);
        this.processImageFile(file);
    }

    private loadSampleFrame(): void {
        const img = new Image();

        img.onload = () => {
            this.canvas.width = img.width;
            this.canvas.height = img.height;
            this.ctx.drawImage(img, 0, 0);
            console.log('✅ Sample frame loaded');
        };

        img.onerror = () => {
            console.log('⚠️ Sample image not found, drawing placeholder');
            this.drawPlaceholder();
        };

        img.src = 'assets/sample_frame.png';
    }

    private drawPlaceholder(): void {
        this.canvas.width = this.currentStats.width;
        this.canvas.height = this.currentStats.height;

        // Black background
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Edge detection pattern
        this.drawEdgePattern();

        // Text overlay
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🔬 Sample Edge Detection', this.canvas.width / 2, 40);

        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#AAAAAA';
        this.ctx.fillText('Simulated Canny Edge Detection Output', this.canvas.width / 2, 70);
    }

    private drawEdgePattern(): void {
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 1;

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // Concentric circles
        for (let r = 50; r < 200; r += 30) {
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        // Rectangles
        this.ctx.strokeRect(centerX - 150, centerY - 100, 300, 200);
        this.ctx.strokeRect(centerX - 120, centerY - 80, 240, 160);

        // Random edge lines
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const len = 10 + Math.random() * 30;
            const angle = Math.random() * Math.PI * 2;

            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
            this.ctx.globalAlpha = 0.3 + Math.random() * 0.7;
            this.ctx.stroke();
        }
        this.ctx.globalAlpha = 1.0;
    }

    private generateNewSample(): void {
        // Mark as simulated frame
        this.isUploadedFrame = false;

        // Update stats with random values
        this.currentStats = {
            width: 640,
            height: 480,
            fps: 20 + Math.random() * 15,
            processingTime: 10 + Math.floor(Math.random() * 20),
            mode: ['Raw', 'Grayscale', 'Edge Detection'][Math.floor(Math.random() * 3)]
        };

        this.drawPlaceholder();
        this.updateStats();

        console.log('🔄 Generated new sample frame');
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

        this.generateNewSample();

        setTimeout(() => {
            if (this.animationId !== null) {
                this.animate();
            }
        }, 100);
    }

    private handleFileUpload(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) return;

        console.log('📤 Loading file:', file.name);
        this.processImageFile(file);
    }

    private processImageFile(file: File): void {
        // Mark as uploaded frame
        this.isUploadedFrame = true;

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataURL = e.target?.result as string;

            const img = new Image();
            img.onload = () => {
                // Calculate real stats for uploaded image
                const width = img.width;
                const height = img.height;
                const megapixels = (width * height) / 1000000;
                const estimatedRgbaSize = width * height * 4; // RGBA = 4 bytes per pixel
                const sizeKB = Math.round(estimatedRgbaSize / 1024);

                this.currentStats = {
                    width: width,
                    height: height,
                    fps: 0, // Not applicable for static image
                    mode: 'Static Image',
                    processingTime: 0, // Not applicable
                    megapixels: megapixels,
                    estimatedSize: `~${sizeKB} KB`,
                    type: 'Uploaded'
                };

                // Draw image on canvas
                this.canvas.width = width;
                this.canvas.height = height;
                this.ctx.drawImage(img, 0, 0);

                this.updateStats();
                console.log(`✅ Android frame loaded: ${width}x${height} (${megapixels.toFixed(2)} MP)`);
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

    private updateStats(): void {
        let html = '';

        if (this.isUploadedFrame && this.currentStats.type === 'Uploaded') {
            // Stats for uploaded images
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
                    <span class="stat-label">Type:</span>
                    <span class="stat-value">${this.currentStats.mode}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Est. Size:</span>
                    <span class="stat-value">${this.currentStats.estimatedSize}</span>
                </div>
            `;
        } else {
            // Stats for simulated/generated frames
            html = `
                <div class="stat-item">
                    <span class="stat-label">Resolution:</span>
                    <span class="stat-value">${this.currentStats.width}x${this.currentStats.height}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">FPS:</span>
                    <span class="stat-value">${this.currentStats.fps.toFixed(1)}</span>
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
        img.onload = () => {
            this.canvas.width = img.width;
            this.canvas.height = img.height;
            this.ctx.drawImage(img, 0, 0);
            this.updateStats();
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

    // Make viewer globally accessible for testing
    (window as any).edgeViewer = viewer;

    console.log('✅ Viewer ready!');
    console.log('📝 Try these commands in console:');
    console.log('   edgeViewer.updateFromBase64("YOUR_BASE64_STRING")');
    console.log('   edgeViewer.updateFrame("image_url.png", stats)');
});