import { TEST_CONFIG } from '../support/config';

describe('AI Face Tracker', () => {
  beforeEach(() => {
    // Create a mock MediaStream before visiting the page
    const mockStream = {
      getTracks: () => [{
        stop: () => {},
        kind: 'video',
        enabled: true,
        readyState: 'live'
      }],
      getVideoTracks: () => [{
        stop: () => {},
        kind: 'video',
        enabled: true,
        readyState: 'live'
      }]
    };

    // Stub navigator.mediaDevices before page load
    cy.window().then((win) => {
      // Ensure mediaDevices exists
      if (!win.navigator.mediaDevices) {
        win.navigator.mediaDevices = {};
      }

      // Create a more reliable stub for getUserMedia
      win.navigator.mediaDevices.getUserMedia = (constraints) => {
        return Promise.resolve(mockStream);
      };
    });

    // Visit page with additional configuration
    cy.visit('http://localhost:8080', {
      onBeforeLoad: (win) => {
        // Ensure mediaDevices exists
        if (!win.navigator.mediaDevices) {
          win.navigator.mediaDevices = {};
        }
        
        // Stub getUserMedia
        win.navigator.mediaDevices.getUserMedia = (constraints) => {
          return Promise.resolve(mockStream);
        };

        // Stub Face-API
        win.faceapi = {
          nets: {
            tinyFaceDetector: {
              load: cy.stub().resolves(),
              loadFromUri: cy.stub().resolves()
            },
            faceLandmark68Net: {
              load: cy.stub().resolves(),
              loadFromUri: cy.stub().resolves()
            }
          },
          detectAllFaces: cy.stub().resolves([{
            detection: { score: 0.8, box: { x: 0, y: 0, width: 100, height: 100 } }
          }]),
          matchDimensions: cy.stub(),
          resizeResults: cy.stub().returns([{
            detection: { score: 0.8, box: { x: 0, y: 0, width: 100, height: 100 } }
          }]),
          draw: {
            drawDetections: cy.stub(),
            drawFaceLandmarks: cy.stub()
          },
          TinyFaceDetectorOptions: class {}
        };
      }
    });

    // Wait for app to be ready with more flexible assertion
    cy.get('#status', { timeout: TEST_CONFIG.waitForResourcesTimeout })
      .should('be.visible')
      .should(($el) => {
        const text = $el.text();
        // Add error message to acceptable states during testing
        expect(text).to.match(/(Camera active|Models loaded successfully|Starting camera)/);
      });
  });

  it('loads the application successfully', () => {
    cy.get('h1', { timeout: 5000 }).should('contain', 'AI Face Tracker');
    cy.get('#videoPlayer').should('be.visible');
    cy.get('#overlay').should('be.visible');
    cy.checkMetrics();
  });

  it('toggles effects when button is clicked', () => {
    // Wait for button to be ready
    cy.get('#toggleEffects')
      .as('effectsButton')
      .should('be.visible')
      .should('have.text', 'Toggle Effects');
    
    // Click and verify text change
    cy.get('@effectsButton').click();
    
    // Use have.text instead of contain for exact match
    cy.get('@effectsButton')
      .should('have.text', 'Enable Effects');
  });

  it('takes snapshots when button is clicked', () => {
    // Wait for video to be ready
    cy.get('#videoPlayer')
      .should('be.visible')
      .should('have.prop', 'readyState', 4);
    
    // Take snapshot
    cy.get('#takeSnapshot')
      .should('be.visible')
      .click();

    // Wait longer for snapshot processing
    cy.get('#snapshotsContainer img', { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .should('have.length.at.least', 1);
  });

  it('displays and updates performance metrics', () => {
    cy.checkMetrics();
    
    cy.get('#faceCount')
      .should('be.visible')
      .invoke('text')
      .should('match', /Faces: \d+/);
  });
}); 