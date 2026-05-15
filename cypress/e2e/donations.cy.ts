import init from '../support/init';

describe('dontations loading', () => {

  it('dotanions button should open a modal to select wompi or paypal donation links', () => {
    init();
    cy.get('button')
      .contains('DONAR')
      .scrollIntoView()
      .click();
    cy.get('a[href*="https://www.paypal.me/mariapaldana"]')
      .should('be.visible');
    cy.get('a[href*="https://checkout.wompi.co/l/VPOS_cziAyf"]')
      .should('be.visible');
  });
  it('donation button on footer should open donations modal', () => {
    init();
    cy.get('footer')
      .within(() => {
        cy.get('button')
          .contains('QUIERO DONAR')
          .scrollIntoView()
          .should('exist')
          .click();
      });

    cy.get('p')
      .contains('Selecciona por dónde quieres hacer tu donación')
      .should('exist');
  });

});