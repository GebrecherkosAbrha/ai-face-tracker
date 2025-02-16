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