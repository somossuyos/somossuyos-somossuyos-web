const init = () => {
  cy.visit('localhost:3000');
  // Viewport estándar para desktop (1280x720)
  // eslint-disable-next-line no-magic-numbers
  cy.viewport(1280, 720);
};

export default init;