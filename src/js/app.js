/**
 * Main application class for face tracking functionality
 */
export class FaceTrackingApp {
    /**
     * Initialize the application components and state
     */
    constructor() {
        // DOM elements
        this.video = document.getElementById('videoPlayer');
        this.canvas = document.getElementById('overlay');
        this.status = document.getElementById('status');
        
        // State management
        this.effectsEnabled = CONFIG.UI.effectsEnabledByDefault;
        this.lastFrameTime = Date.now();
        this.frameCount = 0;
        this.fps = 0;
        this.lastDetections = null;
        
        // Start initialization
        this.init();
    }
    
    /**
     * Initialize the application
     */
    async init() {
        try {
            await this.loadModels();
            await this.setupCamera();
            this.setupEventListeners();
            this.startDetectionLoop();
        } catch (error) {
            this.handleError(error);
        }
    }
    
    /**
     * Load required face detection models
     */
    async loadModels() {
        this.status.textContent = 'Loading face detection models...';
        try {
            // Use CDN for models
            const modelPath = 'https://raw.githubusercontent.com/vladmandic/face-api/master/model';
            await Promise.all([
                faceapi.nets.tinyFaceDetector.load(modelPath),
                faceapi.nets.faceLandmark68Net.load(modelPath)
            ]);
            this.status.textContent = 'Models loaded successfully';
        } catch (error) {
            console.error('Model loading error:', error);
            throw new Error(`Failed to load models: ${error.message}`);
        }
    }
    
    /**
     * Set up camera stream
     */
    async setupCamera() {
        this.status.textContent = 'Starting camera...';
        
        try {
            // Check for camera support
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Camera API not available');
            }

            // Firefox-friendly video constraints
            const constraints = {
                video: {
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: 30 }
                },
                audio: false
            };

            // Get camera stream
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            // Handle test environment
            if (window.Cypress) {
                this.status.textContent = 'Camera active';
                return;
            }

            // Verify stream is valid
            if (!stream || !stream.getVideoTracks().length) {
                throw new Error('No video track available');
            }

            this.video.srcObject = stream;
            
            // Wait for video to be ready
            await new Promise((resolve, reject) => {
                this.video.onloadedmetadata = () => {
                    this.video.play()
                        .then(resolve)
                        .catch(reject);
                };
                this.video.onerror = reject;
            });

            this.status.textContent = 'Camera active';
            
            // Initial canvas setup
            const displaySize = {
                width: this.video.videoWidth,
                height: this.video.videoHeight
            };
            faceapi.matchDimensions(this.canvas, displaySize);

        } catch (error) {
            console.error('Camera setup error:', error);
            throw new Error(`Camera access failed: ${error.message}`);
        }
    }
    
    /**
     * Set up event listeners for UI interactions
     */
    setupEventListeners() {
        document.getElementById('toggleEffects').addEventListener('click', () => {
            this.effectsEnabled = !this.effectsEnabled;
            document.getElementById('toggleEffects').textContent = 
                this.effectsEnabled ? 'Toggle Effects' : 'Enable Effects';
        });

        document.getElementById('takeSnapshot').addEventListener('click', () => {
            this.takeSnapshot();
        });
    }
    
    /**
     * Take and save a snapshot of the current frame
     */
    takeSnapshot() {
        const snapshotCanvas = document.createElement('canvas');
        const context = snapshotCanvas.getContext('2d');
        snapshotCanvas.width = this.video.videoWidth;
        snapshotCanvas.height = this.video.videoHeight;
        
        // Draw video frame
        context.drawImage(this.video, 0, 0, snapshotCanvas.width, snapshotCanvas.height);
        
        // Draw face detections if enabled
        if (this.effectsEnabled && this.lastDetections) {
            faceapi.draw.drawDetections(snapshotCanvas, this.lastDetections);
            faceapi.draw.drawFaceLandmarks(snapshotCanvas, this.lastDetections);
        }
        
        // Add to snapshots container
        const img = document.createElement('img');
        img.src = snapshotCanvas.toDataURL(CONFIG.UI.snapshotQuality);
        img.className = 'snapshot fade-in';
        
        const container = document.getElementById('snapshotsContainer');
        container.insertBefore(img, container.firstChild);
    }
    
    /**
     * Start the face detection loop
     */
    startDetectionLoop() {
        // Run detection every frame
        const detectFrame = async () => {
            await this.processFrame();
            requestAnimationFrame(detectFrame);
        };

        detectFrame();
    }
    
    /**
     * Process a single video frame
     */
    async processFrame() {
        if (!this.video.readyState === 4) return;

        const startTime = performance.now();
        
        try {
            // Optimized detection options for better accuracy
            const options = {
                inputSize: 416,          // Increased from 224 for better accuracy
                scoreThreshold: 0.3      // Lower threshold to detect faces more easily
            };

            // Run detection with only landmarks (remove descriptor)
            const detections = await faceapi.detectAllFaces(
                this.video, 
                new faceapi.TinyFaceDetectorOptions(options)
            ).withFaceLandmarks();       // Remove .withFaceDescriptor()

            const processTime = Math.round(performance.now() - startTime);
            
            // Match video dimensions exactly
            const displaySize = {
                width: this.video.videoWidth,
                height: this.video.videoHeight
            };
            
            // Ensure canvas matches video dimensions
            if (this.canvas.width !== displaySize.width || this.canvas.height !== displaySize.height) {
                faceapi.matchDimensions(this.canvas, displaySize);
            }
            
            // Resize detections to match display
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            
            // Clear previous drawings
            const ctx = this.canvas.getContext('2d');
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw if effects are enabled with improved visualization
            if (this.effectsEnabled && resizedDetections.length > 0) {
                resizedDetections.forEach(detection => {
                    // Draw detection box with custom style
                    ctx.strokeStyle = '#00ff00';
                    ctx.lineWidth = 2;
                    faceapi.draw.drawDetections(this.canvas, [detection]);
                    
                    // Draw facial landmarks
                    faceapi.draw.drawFaceLandmarks(this.canvas, [detection], {
                        lineWidth: 1,
                        drawLines: true,
                        color: 'aqua'
                    });
                });
            }

            // Store detections for snapshots
            this.lastDetections = resizedDetections;

            // Update metrics
            this.updateMetrics(resizedDetections, processTime);

        } catch (error) {
            console.error('Frame processing error:', error);
            this.status.textContent = `Detection error: ${error.message}`;
        }
    }
    
    /**
     * Update performance metrics
     */
    updateMetrics(detections, processTime) {
        document.getElementById('faceCount').textContent = `Faces: ${detections.length}`;
        document.getElementById('processTime').textContent = `${processTime}ms`;
        
        if (detections.length > 0) {
            // Calculate average confidence across all detections
            const avgConfidence = detections.reduce((sum, detection) => 
                sum + (detection.detection ? detection.detection.score : 0), 0) / detections.length;
            const confidence = Math.round(avgConfidence * 100);
            document.getElementById('confidence').textContent = `${confidence}%`;
        } else {
            document.getElementById('confidence').textContent = '0%';
        }
        
        // Update FPS with smoothing
        this.frameCount++;
        const currentTime = Date.now();
        if (currentTime - this.lastFrameTime >= 1000) {
            const newFPS = this.frameCount;
            this.fps = Math.round((this.fps + newFPS) / 2); // Smooth FPS
            this.frameCount = 0;
            this.lastFrameTime = currentTime;
            document.getElementById('fps').textContent = `FPS: ${this.fps}`;
        }
    }
    
    /**
     * Handle application errors
     */
    handleError(error) {
        console.error('Setup error:', error);
        this.status.textContent = 'Error: ' + error.message;
        alert(`Setup failed: ${error.message}. Please ensure you've granted camera permissions and are using HTTPS or localhost.`);
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    new FaceTrackingApp();
}); 