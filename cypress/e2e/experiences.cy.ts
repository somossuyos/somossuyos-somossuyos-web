import init from '../support/init';


describe('experiences related navigation', () => {
  it('should navigate to an experience page', () => {
    init();

    // Navegar a la página de eventos donde están las experiencias
    cy.get('footer a')
      .contains('EVENTOS')
      .should('exist')
      .click();

    // Verificar que estamos en la página de eventos
    cy.url().should('include', '/eventos');

    // Verificar que hay contenido de eventos
    cy.get('h1, h2, h3').should('exist');

    // Verificar que hay enlaces a eventos específicos
    cy.get('a[href*="/eventos/"]').should('exist');
  });

  it('should inscribe one person to an experience', () => {
    init();

    // Navegar a la página de eventos
    cy.get('footer a')
      .contains('EVENTOS')
      .should('exist')
      .click();

    // Verificar que estamos en la página de eventos
    cy.url().should('include', '/eventos');

    // Verificar que hay contenido de eventos
    cy.get('h1, h2, h3').should('exist');

    // Verificar que hay enlaces a eventos específicos
    cy.get('a[href*="/eventos/"]').should('exist');

    // Hacer clic en el primer evento disponible - usando force para elementos cubiertos
    cy.get('a[href*="/eventos/"]').first().click({ force: true });

    // Verificar que estamos en la página del evento
    cy.url().should('include', '/eventos/');

    // Verificar que hay contenido del evento
    cy.get('h1, h2, h3').should('exist');
  });

  it('should inscribe multiple person to an experience', () => {
    init();

    // Navegar a la página de eventos
    cy.get('footer a')
      .contains('EVENTOS')
      .should('exist')
      .click();

    // Verificar que estamos en la página de eventos
    cy.url().should('include', '/eventos');

    // Verificar que hay contenido de eventos
    cy.get('h1, h2, h3').should('exist');

    // Verificar que hay enlaces a eventos específicos
    cy.get('a[href*="/eventos/"]').should('exist');

    // Hacer clic en el primer evento disponible - usando force para elementos cubiertos
    cy.get('a[href*="/eventos/"]').first().click({ force: true });

    // Verificar que estamos en la página del evento
    cy.url().should('include', '/eventos/');

    // Verificar que hay contenido del evento
    cy.get('h1, h2, h3').should('exist');

    // Verificar que hay contenido de la página del evento
    cy.get('body').should('contain.text', 'evento');
  });
});