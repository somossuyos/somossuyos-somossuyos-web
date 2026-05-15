import init from '../support/init';

describe('Page Rendering Tests', () => {
  beforeEach(() => {
    init();
  });

  describe('Home Page', () => {
    it('should render home page correctly', () => {
      cy.visit('/');

      // Verificar que la página carga
      cy.get('body').should('be.visible');

      // Verificar elementos básicos - ajustado a la estructura real
      cy.get('nav').should('exist');
      cy.get('main').should('exist');
      cy.get('footer').should('exist');

      // Verificar que no hay errores de consola
      cy.window().then((win) => {
        cy.spy(win.console, 'error').as('consoleError');
      });

      cy.wait(2000);
      cy.get('@consoleError').should('not.be.called');
    });
  });

  describe('About Us Page', () => {
    it('should render about us page correctly', () => {
      cy.visit('/nosotros');

      // Verificar que la página carga
      cy.get('body').should('be.visible');

      // Verificar elementos básicos - ajustado a la estructura real
      cy.get('nav').should('exist');
      cy.get('main').should('exist');
      cy.get('footer').should('exist');

      // Verificar contenido específico de la página
      cy.get('h1, h2').should('exist');

      // Verificar que no hay errores de consola
      cy.window().then((win) => {
        cy.spy(win.console, 'error').as('consoleError');
      });

      cy.wait(2000);
      cy.get('@consoleError').should('not.be.called');
    });
  });

  describe('Contact Page', () => {
    it('should render contact page correctly', () => {
      cy.visit('/contacto');

      // Verificar que la página carga
      cy.get('body').should('be.visible');

      // Verificar elementos básicos - ajustado a la estructura real
      cy.get('nav').should('exist');
      cy.get('main').should('exist');
      cy.get('footer').should('exist');

      // Verificar formulario de contacto
      cy.get('form').should('exist');

      // Verificar que no hay errores de consola
      cy.window().then((win) => {
        cy.spy(win.console, 'error').as('consoleError');
      });

      cy.wait(2000);
      cy.get('@consoleError').should('not.be.called');
    });
  });

  describe('Resources Page', () => {
    it('should render resources page correctly', () => {
      cy.visit('/recursos');

      // Verificar que la página carga
      cy.get('body').should('be.visible');

      // Verificar elementos básicos - ajustado a la estructura real
      cy.get('nav').should('exist');
      cy.get('main').should('exist');
      cy.get('footer').should('exist');

      // Verificar contenido específico de la página
      cy.get('h1, h2').should('exist');

      // Verificar que no hay errores de consola
      cy.window().then((win) => {
        cy.spy(win.console, 'error').as('consoleError');
      });

      cy.wait(2000);
      cy.get('@consoleError').should('not.be.called');
    });
  });

  describe('Shop Page', () => {
    it('should render shop page correctly', () => {
      cy.visit('/tienda');

      // Verificar que la página carga
      cy.get('body').should('be.visible');

      // Verificar elementos básicos - ajustado a la estructura real
      cy.get('nav').should('exist');
      cy.get('main').should('exist');
      cy.get('footer').should('exist');

      // Verificar contenido específico de la página
      cy.get('h1, h2').should('exist');

      // Verificar que no hay errores de consola
      cy.window().then((win) => {
        cy.spy(win.console, 'error').as('consoleError');
      });

      cy.wait(2000);
      cy.get('@consoleError').should('not.be.called');
    });
  });

  describe('Events Page', () => {
    it('should render events page correctly', () => {
      cy.visit('/eventos');

      // Verificar que la página carga
      cy.get('body').should('be.visible');

      // Verificar elementos básicos - ajustado a la estructura real
      cy.get('nav').should('exist');
      cy.get('main').should('exist');
      cy.get('footer').should('exist');

      // Verificar contenido específico de la página
      cy.get('h1, h2').should('exist');

      // Verificar que no hay errores de consola
      cy.window().then((win) => {
        cy.spy(win.console, 'error').as('consoleError');
      });

      cy.wait(2000);
      cy.get('@consoleError').should('not.be.called');
    });
  });

  describe('Blog Page', () => {
    it('should render blog page correctly', () => {
      cy.visit('/blog');

      // Verificar que la página carga
      cy.get('body').should('be.visible');

      // Verificar elementos básicos - ajustado a la estructura real
      cy.get('nav').should('exist');
      cy.get('main').should('exist');
      cy.get('footer').should('exist');

      // Verificar contenido específico de la página
      cy.get('h1, h2').should('exist');

      // Verificar que no hay errores de consola
      cy.window().then((win) => {
        cy.spy(win.console, 'error').as('consoleError');
      });

      cy.wait(2000);
      cy.get('@consoleError').should('not.be.called');
    });
  });

  describe('Calendar Page', () => {
    it('should render calendar page correctly', () => {
      cy.visit('/calendario');

      // Verificar que la página carga
      cy.get('body').should('be.visible');

      // Verificar elementos básicos - ajustado a la estructura real
      cy.get('nav').should('exist');
      cy.get('main').should('exist');
      cy.get('footer').should('exist');

      // Verificar contenido específico de la página
      cy.get('h1, h2').should('exist');

      // Verificar que no hay errores de consola
      cy.window().then((win) => {
        cy.spy(win.console, 'error').as('consoleError');
      });

      cy.wait(2000);
      cy.get('@consoleError').should('not.be.called');
    });
  });

  describe('Schedule Conference Page', () => {
    it('should render schedule conference page correctly', () => {
      cy.visit('/agendar-conferencia');

      // Verificar que la página carga
      cy.get('body').should('be.visible');

      // Verificar elementos básicos - ajustado a la estructura real
      cy.get('nav').should('exist');
      cy.get('main').should('exist');
      cy.get('footer').should('exist');

      // Verificar formulario de agendar conferencia
      cy.get('form').should('exist');

      // Verificar que no hay errores de consola
      cy.window().then((win) => {
        cy.spy(win.console, 'error').as('consoleError');
      });

      cy.wait(2000);
      cy.get('@consoleError').should('not.be.called');
    });
  });

  describe('Shopping Cart Page', () => {
    it('should render shopping cart page correctly', () => {
      cy.visit('/carrito');

      // Verificar que la página carga
      cy.get('body').should('be.visible');

      // Verificar elementos básicos - ajustado a la estructura real
      cy.get('nav').should('exist');
      cy.get('main').should('exist');
      cy.get('footer').should('exist');

      // Verificar contenido específico de la página
      cy.get('h1, h2').should('exist');

      // Verificar que no hay errores de consola
      cy.window().then((win) => {
        cy.spy(win.console, 'error').as('consoleError');
      });

      cy.wait(2000);
      cy.get('@consoleError').should('not.be.called');
    });
  });

  describe('Checkout Page', () => {
    it('should render checkout page correctly', () => {
      cy.visit('/checkout');

      // Verificar que la página carga
      cy.get('body').should('be.visible');

      // Verificar elementos básicos - ajustado a la estructura real
      cy.get('nav').should('exist');
      cy.get('main').should('exist');
      cy.get('footer').should('exist');

      // Verificar contenido específico de la página
      cy.get('h1, h2').should('exist');

      // Verificar que no hay errores de consola
      cy.window().then((win) => {
        cy.spy(win.console, 'error').as('consoleError');
      });

      cy.wait(2000);
      cy.get('@consoleError').should('not.be.called');
    });
  });

  describe('404 Page', () => {
    it('should render 404 page correctly', () => {
      cy.visit('/pagina-que-no-existe', { failOnStatusCode: false });

      // Verificar que la página carga
      cy.get('body').should('be.visible');

      // Verificar elementos básicos - ajustado a la estructura real
      cy.get('nav').should('exist');
      cy.get('main').should('exist');
      cy.get('footer').should('exist');

      // Verificar contenido específico de la página 404
      cy.get('h1, h2').should('exist');

      // Verificar que no hay errores de consola
      cy.window().then((win) => {
        cy.spy(win.console, 'error').as('consoleError');
      });

      cy.wait(2000);
      cy.get('@consoleError').should('not.be.called');
    });
  });
});
