// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Add custom commands for face tracking app
Cypress.Commands.add('waitForFaceDetection', () => {
  cy.get('#status', { timeout: 20000 })
    .should('be.visible')
    .should(($el) => {
      const text = $el.text();
      expect(text).to.match(/Camera active|Models loaded successfully/);
    });
});

Cypress.Commands.add('checkMetrics', () => {
  const metrics = ['#faceCount', '#fps', '#confidence', '#processTime'];
  metrics.forEach(metric => {
    cy.get(metric, { timeout: 10000 })
      .should('exist')
      .should('be.visible');
  });
}); 