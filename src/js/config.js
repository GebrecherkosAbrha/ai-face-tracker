/**
 * Configuration settings for the face tracking application
 */
const CONFIG = {
    // Face detection settings
    FACE_DETECTION: {
        modelUrl: 'https://justadudewhohacks.github.io/face-api.js/models',
        detectionOptions: {
            scoreThreshold: 0.5,
            inputSize: 512
        }
    },
    
    // Video settings
    VIDEO: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
    },
    
    // Performance settings
    PERFORMANCE: {
        maxFPS: 30,
        updateInterval: 1000 / 30 // 30 FPS
    },
    
    // UI settings
    UI: {
        snapshotQuality: 'image/png',
        effectsEnabledByDefault: true
    }
}; 