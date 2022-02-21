describe('GrScicoll suggest', function () {
  let plainFields = ['name', 'description', 'code', 'homepage', 'catalogUrl', 'apiUrl', 'latitude', 'longitude', 'geographicDescription', 'taxonomicDescription', 'numberSpecimens', 'logoUrl']
  let addressFields = ['address', 'city', 'province', 'country', 'postalCode'];

  // it('can suggest new institution', function () {
  //   cy.visit('/institution/create');

  //   cy.fixture('institution').then((institution) => {
  //     cy.fixture('suggestionInfo').then((suggester) => {

  //       plainFields.forEach(fieldName => {
  //         cy.get(`#${fieldName}`)
  //           .type(institution[fieldName]);
  //       });

  //       ['phone', 'email', 'additionalNames'].forEach(fieldName => {
  //         cy.get(`#${fieldName} .ant-tag`).click();
  //         cy.get(`#${fieldName} input`).type(`${institution[fieldName][0]}{enter}`);
  //       });

  //       if (institution.active) {
  //         cy.get(`#active`).check();
  //       }
  //       if (institution.indexHerbariorumRecord) {
  //         cy.get(`#indexHerbariorumRecord`).check();
  //       }

  //       cy.get(`[data-id="address.country"`).click();
  //       cy.get(`.ant-select-dropdown-menu-item`).contains('Åland Islands').click();
  //       // cy.get(`[name="address_country"] .ant-select`).click()
  //         // .type('{downarrow}{enter}');

  //       cy.get('#_comment')
  //         .type(suggester.comments[0]);
  //       cy.get('#_proposerEmail')
  //         .type(suggester.proposerEmail);

  //       cy.get('#createNew').click();
  //     })
  //   });
  // });


  it('can approve suggestions', function () {
    cy.login(Cypress.env('editorUsername'), Cypress.env('password'));

    cy.fixture('institution').then((institution) => {
      cy.fixture('suggestionInfo').then((suggester) => {
        // test that we can find the suggestions by the users email
        cy.visit(`/suggestions/institutions?status=PENDING&proposerEmail=${encodeURIComponent(suggester.proposerEmail)}`);

        // that there is results in the table
        const expectedTableIemsAbove = 0;
        cy.log(`should have more than ${expectedTableIemsAbove} items in the list`)
        cy.get('table tbody tr')
          .should('have.length.greaterThan', expectedTableIemsAbove);

        // that we can click items and see the individual suggestions
        cy.get('table tbody a').first().click();
        cy.url().should('include', '/institution/create?suggestionId');

        // confirm that values are as expected
        plainFields.forEach(fieldName => {
          cy.get(`#${fieldName}`)
            .should('have.value', institution[fieldName]);
        });

        cy.get('#_comment')
          .type('Looks great to this machine');

        // we should be able to apply a suggestion if logged in
        cy.get('#applySuggestion').click();

      });
    });
  });

})