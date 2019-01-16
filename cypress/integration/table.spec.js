describe('Entity search', function() {

  it('can show results for datasets', function() {
    cy.visit('/dataset/search');
    
    const expectedTableIems = 10;
    cy.log(`should have more than ${expectedTableIems} items in the list`)
    cy.get('table tbody tr')
      .should('have.length.greaterThan', expectedTableIems);
    
    const expectedPageItems = 3;
    cy.log(`should have more than ${expectedPageItems} pages`)
    cy.get('.ant-pagination-item')
      .should('have.length.greaterThan', expectedPageItems);
  });

  it('can filter search results', function() {
    cy.visit('/dataset/search');
    const nonseValue = 'nonse_92643hksf';
    
    cy.get('.dataTable-search input')
      .type(nonseValue + '{enter}');
    
    cy.get('table tbody tr')
      .should('have.length', 0);
  });

})