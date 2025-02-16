import { jest } from '@jest/globals';

// Mock CONFIG object
globalThis.CONFIG = {
  UI: {
    effectsEnabledByDefault: true,
    snapshotQuality: 'image/png'
  },
  FACE_DETECTION: {
    modelUrl: 'https://raw.githubusercontent.com/vladmandic/face-api/master/model',
    detectionOptions: {
      scoreThreshold: 0.5,
      inputSize: 512
    }
  },
  VIDEO: {
    width: { ideal: 640 },
    height: { ideal: 480 },
    facingMode: 'user'
  },
  PERFORMANCE: {
    maxFPS: 30,
    updateInterval: 1000 / 30
  }
};

// Mock the Face-API.js library
globalThis.faceapi = {
  nets: {
    tinyFaceDetector: {
      load: jest.fn().mockResolvedValue(true),
      loadFromUri: jest.fn().mockResolvedValue(true)
    },
    faceLandmark68Net: {
      load: jest.fn().mockResolvedValue(true),
      loadFromUri: jest.fn().mockResolvedValue(true)
    }
  },
  detectAllFaces: jest.fn(),
  matchDimensions: jest.fn(),
  resizeResults: jest.fn(),
  draw: {
    drawDetections: jest.fn(),
    drawFaceLandmarks: jest.fn()
  },
  TinyFaceDetectorOptions: jest.fn()
};

// Mock MediaDevices
globalThis.navigator.mediaDevices = {
  getUserMedia: jest.fn().mockResolvedValue({
    getTracks: () => [{
      stop: jest.fn()
    }]
  })
}; 