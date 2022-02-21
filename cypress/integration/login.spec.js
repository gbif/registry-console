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
    
    let editorUsername = Cypress.env('editorUsername');
    let editorPassword = Cypress.env('password');

    cy.get('#userName')
      .type(editorUsername)
      .should('have.value', editorUsername);
    cy.get('#password')
      .type(editorPassword)
      .should('have.value', editorPassword);
    cy.get('#loginForm button').click();

    cy.get('.ant-layout-header').contains(editorUsername);
  });

  it('will fail on missing password', function() {
    cy.visit('/');
    cy.contains('Login').click();

    let editorUsername = Cypress.env('editorUsername');
    
    cy.get('#userName')
      .type(editorUsername)
      .should('have.value', editorUsername);
    
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