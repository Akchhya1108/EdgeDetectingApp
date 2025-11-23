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
        this.loadSampleFrame();
        this.updateStats();
    }

    private loadSampleFrame(): void {
        // Create a sample edge-detected frame
        // In real implementation, this would load from Android app
        const img = new Image();

        img.onload = () => {
            this.canvas.width = img.width;
            this.canvas.height = img.height;
            this.ctx.drawImage(img, 0, 0);
            console.log('Sample frame loaded');
        };

        img.onerror = () => {
            // If sample image not found, draw a placeholder
            console.log('Sample image not found, drawing placeholder');
            this.drawPlaceholder();
        };

        // Try to load sample image from assets
        img.src = 'assets/sample_frame.png';
    }

    private drawPlaceholder(): void {
        this.canvas.width = this.currentStats.width;
        this.canvas.height = this.currentStats.height;

        // Draw black background
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw some sample edge lines to simulate edge detection
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 2;

        // Random edge-like patterns
        for (let i = 0; i < 50; i++) {
            this.ctx.beginPath();
            const x1 = Math.random() * this.canvas.width;
            const y1 = Math.random() * this.canvas.height;
            const x2 = x1 + (Math.random() - 0.5) * 100;
            const y2 = y1 + (Math.random() - 0.5) * 100;
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }

        // Add text overlay
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Sample Edge Detection Frame', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = '14px Arial';
        this.ctx.fillText('(Placeholder - Replace with actual frame)', this.canvas.width / 2, this.canvas.height / 2 + 30);
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
        };
        img.src = imageData;
    }
}

// Initialize viewer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('FlamappAI Web Viewer Starting...');
    const viewer = new EdgeViewer();

    // Make viewer globally accessible for testing
    (window as any).edgeViewer = viewer;

    console.log('Viewer ready. You can call window.edgeViewer.updateFrame() to load new frames.');
});