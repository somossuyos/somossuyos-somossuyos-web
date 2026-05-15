import init from '../support/init';

describe('send contact data correctly', () => {
  it('should send contact data correctly', () => {
    init();
    cy.get('a')
      .contains('CONTACTO')
      .click();
    cy.get('form')
      .within(() => {
        cy.get('input[name="names"]')
          .type('test');
        cy.get('input[name="lastNames"]')
          .type('test');
        cy.get('input[name="email"]')
          .type('test@test.co');
        cy.get('textarea[name="message"]')
          .type('Esto es una prueba');
      });

    cy.get('button')
      .contains('ENVIAR')
      .should('be.enabled')
      .click();

    cy.get('p')
      .contains('Mensaje enviado correctamente')
      .should('exist')
      .should('be.visible');
  });
});