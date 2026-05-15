import init from '../support/init';

describe('Schedule form', () => {
  it('Should schedule a conference correctly', () => {
    init();
    cy.get('a[href="/agendar-conferencia"]')
      .should('exist')
      .click();
    cy.get('input[name="names"]')
      .type('Test');
    cy.get('input[name="lastNames"]')
      .type('Test');
    cy.get('input[name="email"]')
      .type('test@test.com');
    cy.get('input[name="phone"]')
      .type('1234567889');
    cy.get('input[name="event"]')
      .check();
    cy.get('input[name="organizerName"]')
      .type('test');
    cy.get('input[name="organizerCountry"]')
      .type('test');
    cy.get('input[name="organizerDirection"]')
      .type('Dirección de prueba');
    cy.get('textarea[name="message"]')
      .type('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet libero luctus, mollis arcu maximus, mattis nunc. In dignissim est sed nisi auctor, non rutrum urna mattis. Praesent dolor odio, hendrerit et orci ut, cursus pharetra enim. Curabitur molestie mollis dui, id facilisis nisi lobortis quis. Nunc urna ante, tincidunt sit amet pharetra quis, convallis eu orci. Ut gravida felis et lectus viverra elementum. Quisque mi elit, interdum vitae dictum nec, hendrerit eget mi.');
    cy.get('button')
      .contains('ENVIAR')
      .should('be.enabled')
      .click();

    cy.get('p')
      .contains('Mensaje enviado correctamente')
      .should('exist');
  });
});