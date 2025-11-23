/**
 * FlamappAI Web Viewer
 * Displays processed edge detection frames from Android app
 */

interface FrameStats {
    width: number;
    height: number;
    fps: number;
    mode: string;
    processingTime: number;
}

class EdgeViewer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private statsDiv: HTMLElement;
    private currentStats: FrameStats;
    private animationId: number | null = null;

    constructor() {
        this.canvas = document.getElementById('frameCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.statsDiv = document.getElementById('stats')!;

        // Default stats
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
        console.log('EdgeViewer initialized');
        this.setupButtons();
        this.loadSampleFrame();
        this.updateStats();
    }

    private setupButtons(): void {
        const refreshBtn = document.getElementById('refreshBtn');
        const exportBtn = document.getElementById('exportBtn');
        const animateBtn = document.getElementById('animateBtn');

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.generateNewSample());
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportFrame());
        }

        if (animateBtn) {
            animateBtn.addEventListener('click', () => this.toggleAnimation());
        }
    }

    private loadSampleFrame(): void {
        // Create a sample edge-detected frame
        const img = new Image();

        img.onload = () => {
            this.canvas.width = img.width;
            this.canvas.height = img.height;
            this.ctx.drawImage(img, 0, 0);
            console.log('Sample frame loaded');
        };

        img.onerror = () => {
            console.log('Sample image not found, drawing placeholder');
            this.drawPlaceholder();
        };

        img.src = 'assets/sample_frame.png';
    }

    private drawPlaceholder(): void {
        this.canvas.width = this.currentStats.width;
        this.canvas.height = this.currentStats.height;

        // Draw black background
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw realistic edge detection pattern
        this.drawEdgePattern();

        // Add text overlay
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

        // Draw geometric shapes with edges
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        // Circle edges
        for (let r = 50; r < 200; r += 30) {
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        // Rectangular edges
        this.ctx.strokeRect(centerX - 150, centerY - 100, 300, 200);
        this.ctx.strokeRect(centerX - 120, centerY - 80, 240, 160);

        // Random noise lines (simulate detailed edges)
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
        // Update stats with random values
        this.currentStats.fps = 20 + Math.random() * 15;
        this.currentStats.processingTime = 10 + Math.floor(Math.random() * 20);
        this.currentStats.mode = ['Raw', 'Grayscale', 'Edge Detection'][Math.floor(Math.random() * 3)];

        // Redraw
        this.drawPlaceholder();
        this.updateStats();

        console.log('Generated new sample frame');
    }

    private exportFrame(): void {
        const dataURL = this.canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `edge_frame_${Date.now()}.png`;
        link.href = dataURL;
        link.click();
        console.log('Frame exported');
    }

    private toggleAnimation(): void {
        const btn = document.getElementById('animateBtn');
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
            if (btn) btn.textContent = '▶ Animate';
            console.log('Animation stopped');
        } else {
            this.animate();
            if (btn) btn.textContent = '⏸ Stop';
            console.log('Animation started');
        }
    }

    private animate(): void {
        this.generateNewSample();
        this.animationId = requestAnimationFrame(() => {
            setTimeout(() => this.animate(), 100);
        }) as unknown as number;
    }

    private updateStats(): void {
        const html = `
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

        this.statsDiv.innerHTML = html;
    }

    public updateFrame(imageData: string, stats: FrameStats): void {
        // Method to update frame from base64 or URL
        this.currentStats = stats;

        const img = new Image();
        img.onload = () => {
            this.canvas.width = img.width;
            this.canvas.height = img.height;
            this.ctx.drawImage(img, 0, 0);
            this.updateStats();
            console.log('Frame updated from external source');
        };
        img.onerror = () => {
            console.error('Failed to load image from:', imageData.substring(0, 50) + '...');
        };
        img.src = imageData;
    }

    public updateFromBase64(base64: string, stats?: Partial<FrameStats>): void {
        // Helper method specifically for base64 strings
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