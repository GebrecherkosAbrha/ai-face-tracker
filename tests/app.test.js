import { jest } from '@jest/globals';
import { FaceTrackingApp } from '../src/js/app.js';

describe('FaceTrackingApp', () => {
  let app;
  
  beforeEach(() => {
    // Mock canvas methods
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      drawImage: jest.fn(),
      clearRect: jest.fn()
    }));

    // Setup DOM elements
    document.body.innerHTML = `
      <video id="videoPlayer"></video>
      <canvas id="overlay"></canvas>
      <div id="status"></div>
      <div id="faceCount">Faces: 0</div>
      <div id="fps">FPS: 0</div>
      <div id="confidence">0%</div>
      <div id="processTime">0ms</div>
      <button id="toggleEffects">Toggle Effects</button>
      <button id="takeSnapshot">Take Snapshot</button>
      <div id="snapshotsContainer"></div>
    `;
    
    app = new FaceTrackingApp();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('initializes with correct default values', () => {
    expect(app.effectsEnabled).toBe(true);
    expect(app.fps).toBe(0);
    expect(app.frameCount).toBe(0);
    expect(app.lastDetections).toBe(null);
  });

  test('loads models successfully', async () => {
    await app.loadModels();
    expect(faceapi.nets.tinyFaceDetector.load).toHaveBeenCalled();
    expect(faceapi.nets.faceLandmark68Net.load).toHaveBeenCalled();
    expect(app.status.textContent).toBe('Models loaded successfully');
  });

  test('sets up camera successfully', async () => {
    await app.setupCamera();
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
    expect(app.status.textContent).toBe('Camera active');
  });

  test('toggles effects when button is clicked', () => {
    const toggleButton = document.getElementById('toggleEffects');
    toggleButton.click();
    expect(app.effectsEnabled).toBe(false);
    expect(toggleButton.textContent).toBe('Enable Effects');
  });

  test('takes snapshot when button is clicked', () => {
    const snapshotButton = document.getElementById('takeSnapshot');
    snapshotButton.click();
    const snapshots = document.getElementById('snapshotsContainer').children;
    expect(snapshots.length).toBe(1);
    expect(snapshots[0].tagName).toBe('IMG');
  });
}); 