describe('Standard search', function() {

  ['organization', 'dataset', 'network', 'installation', 'node', 'vocabulary'].forEach(type => {
    it(`can show results for: ${type}`, function() {
      cy.visit(`/${type}/search`);
      
      const expectedTableIems = 5;
      cy.log(`should have more than ${expectedTableIems} items in the list`)
      cy.get('table tbody tr')
        .should('have.length.greaterThan', expectedTableIems);
    });
  });

})