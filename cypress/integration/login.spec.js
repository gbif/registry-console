describe('Login', function() {

  beforeEach(function () {
    cy.clearLocalStorage();
    cy.window().then((win) => {
      win.sessionStorage.clear();
    })
  })

  it('can login', function() {
    cy.visit('/');
    cy.contains('Login').click();
    
    let adminUsername = Cypress.env('adminUsername');
    let adminPassword = Cypress.env('adminPassword');

    cy.get('#userName')
      .type(adminUsername)
      .should('have.value', adminUsername);
    cy.get('#password')
      .type(adminPassword)
      .should('have.value', adminPassword);
    cy.get('#loginForm button').click();

    cy.get('.ant-layout-header').contains(adminUsername);
  });

  it('will fail on missing password', function() {
    cy.visit('/');
    cy.contains('Login').click();

    let adminUsername = Cypress.env('adminUsername');
    
    cy.get('#userName')
      .type(adminUsername)
      .should('have.value', adminUsername);
    
    cy.get('#loginForm button').click();

    cy.get('#loginForm')
      .contains('Please input your Password!');

    cy.get('.ant-layout-header').contains('Login');
  });

  it('will fail on unknown user', function() {
    cy.visit('/');
    cy.contains('Login').click();
    
    cy.get('#userName')
      .type('nonse_239487sdkfjh');
    cy.get('#password')
      .type('nonse_239487sdkfjh');
    cy.get('#loginForm button').click();
    
    cy.get('#loginForm')
      .contains('Invalid username or password');

    cy.get('.ant-layout-header').contains('Login');
  });

})