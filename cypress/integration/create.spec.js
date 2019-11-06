describe('Create has restrictions', function() {

  beforeEach(function () {
    cy.login(Cypress.env('adminUsername'), Cypress.env('adminPassword'));
  })

  it('admins can create all types', async function() {
    cy.visit('/organization/create');
    cy.contains('Organization details');

    cy.visit('/dataset/create');
    cy.contains('Dataset details');

    cy.visit('/installation/create');
    cy.contains('Installation details');

    cy.visit('/collection/create');
    cy.contains('Collection details');

    cy.visit('/institution/create');
    cy.contains('Institution details');

    cy.visit('/person/create');
    cy.contains('Person details');

    cy.visit('/user/search');
    cy.contains('Users');
  });
  
})